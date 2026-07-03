// ============================================================
// 后台管理面板
// 工作流程：编辑内容 → 自动保存为本地草稿 → 预览草稿 →
// 点击"发布到网站"通过 GitHub API 提交到仓库 → 全网生效
// ============================================================
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentEditingArtwork = null;
        this.tempImageData = null;

        this.initializeEventListeners();
        this.loadDashboardData();
        this.updatePublishStatus();
    }

    // ---------- 事件绑定 ----------
    initializeEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        this.on('logout-btn', 'click', () => this.logout());
        this.on('publish-btn', 'click', () => this.publishToWebsite());

        // 作品管理
        this.on('add-artwork-btn', 'click', () => this.openArtworkModal());
        this.on('artwork-search', 'input', (e) => this.filterArtworks(e.target.value));
        this.on('artwork-filter', 'change', (e) => this.filterArtworks(null, e.target.value));
        this.on('artwork-form', 'submit', (e) => {
            e.preventDefault();
            this.saveArtwork();
        });
        this.on('artwork-image-input', 'change', (e) => this.handleImageUpload(e));
        this.initializeBatchUpload();

        // 个人信息
        this.on('save-profile-btn', 'click', () => this.saveProfile());
        this.on('artist-photo-input', 'change', (e) => this.handlePhotoUpload(e));

        // 设置
        this.on('update-password-btn', 'click', () => this.updatePassword());
        this.on('save-publish-config-btn', 'click', () => this.savePublishConfig());
        this.on('test-publish-config-btn', 'click', () => this.testPublishConnection());
        this.on('export-data-btn', 'click', () => this.exportData());
        this.on('import-data-btn', 'click', () => document.getElementById('import-data-input').click());
        this.on('import-data-input', 'change', (e) => this.importData(e));
        this.on('reset-data-btn', 'click', () => this.resetData());
        this.on('backup-data', 'click', () => this.exportData());
        this.on('restore-data', 'click', () => document.getElementById('import-data-input').click());

        // 批量操作
        this.on('select-all-btn', 'click', () => this.toggleSelectAll());
        this.on('delete-selected-btn', 'click', () => this.deleteSelectedArtworks());

        // 模态框
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeArtworkModal());
        this.on('artwork-modal', 'click', (e) => {
            if (e.target.id === 'artwork-modal') this.closeArtworkModal();
        });
    }

    // 安全绑定事件（元素不存在时跳过）
    on(id, event, handler) {
        const element = document.getElementById(id);
        if (element) element.addEventListener(event, handler);
    }

    // 批量上传相关事件
    initializeBatchUpload() {
        const batchUploadBtn = document.getElementById('batch-upload-btn');
        const dragArea = document.getElementById('drag-upload-area');
        const browseBtn = document.getElementById('browse-files-btn');
        const fileInput = document.getElementById('file-input');

        if (batchUploadBtn && dragArea) {
            batchUploadBtn.addEventListener('click', () => {
                const isHidden = dragArea.style.display === 'none' || !dragArea.style.display;
                dragArea.style.display = isHidden ? 'block' : 'none';
            });
        }

        if (browseBtn && fileInput) {
            browseBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                this.handleBatchFiles(e.target.files);
                e.target.value = '';
            });
        }

        if (dragArea) {
            dragArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                dragArea.classList.add('dragover');
            });
            dragArea.addEventListener('dragleave', () => dragArea.classList.remove('dragover'));
            dragArea.addEventListener('drop', (e) => {
                e.preventDefault();
                dragArea.classList.remove('dragover');
                this.handleBatchFiles(e.dataTransfer.files);
            });
        }
    }

    // ---------- 页面切换 ----------
    switchSection(section) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        const titles = {
            dashboard: '概览',
            artworks: '作品管理',
            profile: '个人信息',
            settings: '网站设置'
        };
        document.getElementById('page-title').textContent = titles[section] || '后台管理';

        document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(`${section}-section`);
        if (target) target.classList.add('active');

        this.currentSection = section;

        switch (section) {
            case 'dashboard': this.loadDashboardData(); break;
            case 'artworks': this.loadArtworks(); break;
            case 'profile': this.loadProfile(); break;
            case 'settings': this.loadSettings(); break;
        }
    }

    // ---------- 概览 ----------
    loadDashboardData() {
        const stats = dataManager.getStatistics();
        const profile = dataManager.getProfile();

        this.setText('total-artworks', stats.totalArtworks);
        this.setText('total-exhibitions', profile.stats?.exhibitions ?? 0);
        this.setText('total-experience', (profile.stats?.experience ?? 0) + '年');

        const lastUpdated = stats.lastUpdated && stats.lastUpdated !== '未知'
            ? new Date(stats.lastUpdated).toLocaleDateString('zh-CN')
            : '-';
        this.setText('last-updated', lastUpdated);

        this.setText('paintings-count', stats.paintings);
        this.setText('digital-count', stats.digital);
        this.setText('sketches-count', stats.sketches);
    }

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // ---------- 作品列表 ----------
    // 图片路径解析：仓库相对路径在后台页面需要加 ../ 前缀
    resolveImageUrl(image) {
        if (!image) return '';
        if (image.startsWith('data:') || image.startsWith('http://') || image.startsWith('https://')) {
            return image;
        }
        return '../' + image;
    }

    artworkTitle(artwork) {
        return artwork.title?.zh || artwork.title?.en || artwork.title?.ja || `作品 ${artwork.id}`;
    }

    artworkDesc(artwork) {
        return artwork.description?.zh || artwork.description?.en || artwork.description?.ja || '';
    }

    loadArtworks(searchTerm = '', category = '') {
        try {
            const artworks = dataManager.getArtworks();
            const grid = document.getElementById('artworks-grid');

            this.setText('total-artworks-count', `共 ${artworks.length} 件作品`);

            let filtered = [...artworks];

            if (searchTerm && searchTerm.trim()) {
                const search = searchTerm.toLowerCase();
                filtered = filtered.filter(artwork => {
                    const title = this.artworkTitle(artwork);
                    const desc = this.artworkDesc(artwork);
                    const medium = artwork.details?.medium || '';
                    return title.toLowerCase().includes(search) ||
                           desc.toLowerCase().includes(search) ||
                           medium.toLowerCase().includes(search);
                });
            }

            if (category && category !== 'all') {
                filtered = filtered.filter(artwork => artwork.category === category);
            }

            const filteredCountEl = document.getElementById('filtered-count');
            if (filteredCountEl) {
                const isFiltered = filtered.length !== artworks.length;
                filteredCountEl.style.display = isFiltered ? 'inline' : 'none';
                filteredCountEl.textContent = `显示 ${filtered.length} 件`;
            }

            grid.innerHTML = '';

            if (filtered.length === 0) {
                const msg = (searchTerm || category) ? '没有找到符合条件的作品' : '暂无作品，点击"添加新作品"或"批量上传"开始创建';
                grid.innerHTML = `<p style="text-align: center; color: #718096; padding: 40px;">${msg}</p>`;
                return;
            }

            filtered.forEach(artwork => {
                grid.appendChild(this.createArtworkCard(artwork));
            });
        } catch (error) {
            console.error('❌ 加载作品列表失败:', error);
            const grid = document.getElementById('artworks-grid');
            if (grid) {
                grid.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 40px;">作品列表加载失败，请刷新重试</p>';
            }
        }
    }

    createArtworkCard(artwork) {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.dataset.artworkId = artwork.id;

        const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOWbvueJhzwvdGV4dD48L3N2Zz4=';
        const imageUrl = this.resolveImageUrl(artwork.image) || placeholder;
        const title = this.artworkTitle(artwork);
        const desc = this.artworkDesc(artwork) || '暂无描述';
        const isLocalDraft = artwork.image && artwork.image.startsWith('data:');

        card.innerHTML = `
            <div class="artwork-checkbox">
                <input type="checkbox" class="artwork-select" data-artwork-id="${artwork.id}">
            </div>
            <div class="artwork-image-container">
                <img src="${imageUrl}" alt="${title}" class="artwork-image" loading="lazy">
                ${isLocalDraft ? '<span class="draft-badge" style="position:absolute;top:8px;right:8px;background:#ed8936;color:white;font-size:11px;padding:2px 8px;border-radius:10px;">待发布</span>' : ''}
                <div class="artwork-overlay">
                    <button class="btn btn-sm btn-primary artwork-preview-btn" data-artwork-id="${artwork.id}" title="预览">预览</button>
                </div>
            </div>
            <div class="artwork-info">
                <h3 class="artwork-title" title="${title}">${title}</h3>
                <div class="artwork-meta">
                    <span class="category-badge category-${artwork.category}">${this.getCategoryName(artwork.category)}</span>
                    <span class="year-badge">${artwork.details?.year || '未知'}</span>
                </div>
                <div class="artwork-description" title="${desc}">${desc.length > 50 ? desc.substring(0, 50) + '...' : desc}</div>
                <div class="artwork-details">
                    <small>${artwork.details?.medium || '未知媒介'} | ${artwork.details?.size || '未知尺寸'}</small>
                </div>
                <div class="artwork-actions">
                    <button class="btn btn-primary btn-small artwork-edit-btn" data-artwork-id="${artwork.id}" title="编辑作品">编辑</button>
                    <button class="btn btn-danger btn-small artwork-delete-btn" data-artwork-id="${artwork.id}" title="删除作品">删除</button>
                </div>
            </div>
        `;

        this.bindCardEvents(card, artwork);
        return card;
    }

    bindCardEvents(card, artwork) {
        const previewBtn = card.querySelector('.artwork-preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.previewArtwork(artwork.id);
            });
        }

        const editBtn = card.querySelector('.artwork-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.editArtwork(artwork.id);
            });
        }

        const deleteBtn = card.querySelector('.artwork-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteArtwork(artwork.id);
            });
        }

        const checkbox = card.querySelector('.artwork-select');
        if (checkbox) {
            checkbox.addEventListener('change', () => this.updateBatchActions());
        }
    }

    previewArtwork(id) {
        const artwork = dataManager.getArtworkById(id);
        if (!artwork) return;

        const title = this.artworkTitle(artwork);
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
            z-index: 10000; cursor: pointer;
        `;
        modal.innerHTML = `
            <div class="preview-content" style="max-width: 80%; max-height: 80%; text-align: center;">
                <img src="${this.resolveImageUrl(artwork.image)}" alt="${title}" style="max-width: 100%; max-height: 70vh; border-radius: 8px;">
                <h3 style="color: white; margin-top: 20px;">${title}</h3>
                <p style="color: #ccc; font-size: 14px;">点击任意处关闭</p>
            </div>
        `;
        modal.addEventListener('click', () => document.body.removeChild(modal));
        document.body.appendChild(modal);
    }

    getCategoryName(category) {
        const names = { paintings: '绘画', digital: '数字艺术', sketches: '素描' };
        return names[category] || category;
    }

    filterArtworks(searchTerm = null, category = null) {
        const currentSearch = searchTerm !== null ? searchTerm : document.getElementById('artwork-search').value;
        const currentCategory = category !== null ? category : document.getElementById('artwork-filter').value;
        this.loadArtworks(currentSearch, currentCategory);
    }

    // ---------- 作品编辑模态框 ----------
    openArtworkModal(artworkId = null) {
        const modal = document.getElementById('artwork-modal');
        const form = document.getElementById('artwork-form');
        const title = document.getElementById('modal-title');

        this.tempImageData = null;

        if (artworkId) {
            const artwork = dataManager.getArtworkById(artworkId);
            if (!artwork) return;

            this.currentEditingArtwork = artworkId;
            title.textContent = '编辑作品';

            document.getElementById('artwork-id').value = artwork.id;
            document.getElementById('artwork-title-zh').value = artwork.title?.zh || '';
            document.getElementById('artwork-title-en').value = artwork.title?.en || '';
            document.getElementById('artwork-title-ja').value = artwork.title?.ja || '';
            document.getElementById('artwork-desc-zh').value = artwork.description?.zh || '';
            document.getElementById('artwork-desc-en').value = artwork.description?.en || '';
            document.getElementById('artwork-desc-ja').value = artwork.description?.ja || '';
            document.getElementById('artwork-category').value = artwork.category;
            document.getElementById('artwork-medium').value = artwork.details?.medium || '';
            document.getElementById('artwork-size').value = artwork.details?.size || '';
            document.getElementById('artwork-year').value = artwork.details?.year || '';

            if (artwork.image) {
                document.getElementById('image-preview').innerHTML =
                    `<img src="${this.resolveImageUrl(artwork.image)}" alt="当前图片" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
            } else {
                document.getElementById('image-preview').innerHTML = '';
            }
        } else {
            this.currentEditingArtwork = null;
            title.textContent = '添加新作品';
            form.reset();
            document.getElementById('image-preview').innerHTML = '';
        }

        modal.style.display = 'block';
    }

    closeArtworkModal() {
        document.getElementById('artwork-modal').style.display = 'none';
        this.currentEditingArtwork = null;
        this.tempImageData = null;
        document.getElementById('artwork-form').reset();
        document.getElementById('image-preview').innerHTML = '';
    }

    // ---------- 图片上传与压缩 ----------
    isImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        if (file.type && allowedTypes.includes(file.type.toLowerCase())) return true;
        // 部分系统/浏览器不提供MIME类型，回退到扩展名判断
        return /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name || '');
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!this.isImageFile(file)) {
            this.showNotification('请选择图片文件（支持 JPG, PNG, GIF, WebP）', 'error');
            e.target.value = '';
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification('图片文件大小不能超过10MB', 'error');
            e.target.value = '';
            return;
        }

        this.showUploadProgress(true);

        this.readAndCompressImage(file)
            .then((image) => {
                this.tempImageData = { url: image.url, name: image.name };
                this.displayImagePreview(image.url, image.name);
                this.showNotification('图片已就绪，保存作品后生效', 'success');
            })
            .catch((error) => {
                console.error('❌ 图片处理失败:', error);
                this.showNotification(error.message || '图片处理失败，请重试', 'error');
                e.target.value = '';
            })
            .finally(() => this.showUploadProgress(false));
    }

    // 读取并压缩图片文件，返回 Promise<{url, name}>
    readAndCompressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const originalUrl = event.target.result;
                if (!originalUrl || !originalUrl.startsWith('data:image/')) {
                    reject(new Error('图片数据格式无效'));
                    return;
                }

                // 小图片直接使用原图（GIF动画也得以保留）
                if (file.size <= 300 * 1024) {
                    resolve({ url: originalUrl, name: file.name });
                    return;
                }

                const img = new Image();
                img.onload = () => {
                    try {
                        const compressedUrl = this.compressToDataUrl(img);
                        const finalUrl = compressedUrl.length < originalUrl.length ? compressedUrl : originalUrl;
                        resolve({ url: finalUrl, name: file.name });
                    } catch (error) {
                        console.warn('⚠️ 图片压缩失败，使用原图:', error);
                        resolve({ url: originalUrl, name: file.name });
                    }
                };
                img.onerror = () => reject(new Error('图片解码失败，文件可能已损坏'));
                img.src = originalUrl;
            };

            reader.onerror = () => reject(new Error('图片读取失败，请重试'));
            reader.readAsDataURL(file);
        });
    }

    // canvas压缩为JPEG（canvas不支持输出GIF/BMP，统一转JPEG避免回退成更大的PNG）
    compressToDataUrl(img) {
        const maxDimension = 1600;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
            const scale = maxDimension / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 透明背景填白，避免JPEG输出变黑
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // 逐步降低质量，控制草稿占用的localStorage空间
        const maxLength = 900 * 1024;
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > maxLength && quality > 0.4) {
            quality -= 0.15;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        return dataUrl;
    }

    // 批量上传：每张图片自动创建一个作品（草稿）
    async handleBatchFiles(fileList) {
        const files = Array.from(fileList || []);
        if (files.length === 0) return;

        const maxSize = 10 * 1024 * 1024;
        const validFiles = files.filter(file => this.isImageFile(file) && file.size <= maxSize);
        const skipped = files.length - validFiles.length;

        if (validFiles.length === 0) {
            this.showNotification('没有可上传的图片（支持 JPG/PNG/GIF/WebP，单张最大10MB）', 'error');
            return;
        }

        this.showUploadProgress(true);

        let saved = 0;
        let failed = 0;
        let quotaHit = false;

        for (const file of validFiles) {
            try {
                const image = await this.readAndCompressImage(file);
                this.saveBatchArtwork(image, file);
                saved++;
            } catch (error) {
                if (error.isQuotaError) {
                    quotaHit = true;
                    break;
                }
                console.error('❌ 批量上传文件失败:', file.name, error);
                failed++;
            }
        }

        this.showUploadProgress(false);
        this.loadArtworks();
        this.loadDashboardData();
        this.updatePublishStatus();

        if (quotaHit) {
            this.showNotification(`已添加 ${saved} 张后浏览器存储空间不足，请先发布草稿再继续`, 'error');
        } else {
            let message = `批量上传完成：成功 ${saved} 张（已存为草稿，记得发布）`;
            if (failed > 0) message += `，失败 ${failed} 张`;
            if (skipped > 0) message += `，跳过 ${skipped} 个非图片或超大文件`;
            this.showNotification(message, failed > 0 ? 'error' : 'success');
        }
    }

    saveBatchArtwork(image, file) {
        const baseName = (file.name || '未命名作品').replace(/\.[^.]+$/, '');
        const artwork = dataManager.addArtwork({
            title: { zh: baseName, en: baseName, ja: baseName },
            description: { zh: '', en: '', ja: '' },
            category: 'paintings',
            image: image.url,
            details: {
                medium: '未指定',
                size: '未指定',
                year: new Date().getFullYear().toString()
            }
        });
        if (!artwork) throw new Error('作品保存失败');
    }

    showUploadProgress(show) {
        let progressEl = document.getElementById('upload-progress');

        if (show) {
            if (!progressEl) {
                progressEl = document.createElement('div');
                progressEl.id = 'upload-progress';
                progressEl.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10001; text-align: center;
                `;
                progressEl.innerHTML = `
                    <div style="margin-bottom: 10px;">处理图片中...</div>
                    <div style="width: 200px; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden;">
                        <div style="width: 100%; height: 100%; background: #4CAF50; animation: progress 1.5s ease-in-out infinite;"></div>
                    </div>
                    <style>
                        @keyframes progress {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(100%); }
                        }
                    </style>
                `;
                document.body.appendChild(progressEl);
            }
        } else if (progressEl && progressEl.parentNode) {
            progressEl.parentNode.removeChild(progressEl);
        }
    }

    displayImagePreview(imageUrl, fileName) {
        const previewContainer = document.getElementById('image-preview');
        previewContainer.innerHTML = `
            <div class="image-preview-wrapper">
                <img src="${imageUrl}" style="max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;">
                <div class="image-info">
                    <p class="image-name">${fileName}</p>
                    <div class="preview-actions">
                        <button type="button" class="btn btn-sm btn-outline" onclick="adminPanel.removeImagePreview()">移除</button>
                        <button type="button" class="btn btn-sm btn-outline" onclick="adminPanel.replaceImage()">替换</button>
                    </div>
                </div>
            </div>
        `;
    }

    removeImagePreview() {
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('artwork-image-input').value = '';
        this.tempImageData = null;
    }

    replaceImage() {
        document.getElementById('artwork-image-input').click();
    }

    addImageFromUrl() {
        const url = prompt('请输入图片URL:');
        if (!url) return;

        try {
            new URL(url);
        } catch (e) {
            alert('请输入有效的URL地址');
            return;
        }

        const img = new Image();
        img.onload = () => {
            this.displayImagePreview(url, '外部图片');
            this.tempImageData = { url: url, name: '外部图片' };
        };
        img.onerror = () => alert('无法加载该图片URL，请检查地址是否正确');
        img.src = url;
    }

    // ---------- 作品保存 ----------
    saveArtwork() {
        try {
            this.showSaveProgress(true);

            const formData = this.extractFormData();
            const validation = this.validateFormData(formData);
            if (!validation.isValid) {
                this.showNotification(validation.message, 'error');
                this.showSaveProgress(false);
                return;
            }

            const imageUrl = this.getArtworkImageUrl();
            if (!imageUrl) {
                this.showNotification('请选择作品图片', 'error');
                this.showSaveProgress(false);
                return;
            }

            const artwork = {
                title: {
                    zh: formData.titleZh,
                    en: formData.titleEn || formData.titleZh,
                    ja: formData.titleJa || formData.titleZh
                },
                description: {
                    zh: formData.descZh,
                    en: formData.descEn || formData.descZh,
                    ja: formData.descJa || formData.descZh
                },
                category: formData.category,
                image: imageUrl,
                details: {
                    medium: formData.medium || '未指定',
                    size: formData.size || '未指定',
                    year: formData.year || new Date().getFullYear().toString()
                }
            };

            const saved = this.currentEditingArtwork
                ? dataManager.updateArtwork(this.currentEditingArtwork, artwork)
                : dataManager.addArtwork(artwork);

            if (!saved) throw new Error('作品保存失败，请检查数据');

            this.showNotification(this.currentEditingArtwork ? '作品已更新（草稿）' : '作品已添加（草稿）', 'success');
            this.closeArtworkModal();
            this.loadArtworks();
            this.loadDashboardData();
            this.updatePublishStatus();
            this.showSaveProgress(false);
        } catch (error) {
            console.error('❌ 保存作品时发生错误:', error);
            const message = error.isQuotaError
                ? '浏览器存储空间不足，请先点击"发布到网站"（发布后图片转存到仓库，释放本地空间）'
                : '保存失败：' + error.message;
            this.showNotification(message, 'error');
            this.showSaveProgress(false);
        }
    }

    extractFormData() {
        return {
            titleZh: this.getInputValue('artwork-title-zh'),
            titleEn: this.getInputValue('artwork-title-en'),
            titleJa: this.getInputValue('artwork-title-ja'),
            descZh: this.getInputValue('artwork-desc-zh'),
            descEn: this.getInputValue('artwork-desc-en'),
            descJa: this.getInputValue('artwork-desc-ja'),
            category: this.getInputValue('artwork-category'),
            medium: this.getInputValue('artwork-medium'),
            size: this.getInputValue('artwork-size'),
            year: this.getInputValue('artwork-year')
        };
    }

    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    }

    validateFormData(data) {
        if (!data.titleZh) return { isValid: false, message: '请填写中文标题' };
        if (!data.category) return { isValid: false, message: '请选择作品分类' };

        const allowedCategories = ['paintings', 'digital', 'sketches'];
        if (!allowedCategories.includes(data.category)) {
            return { isValid: false, message: '无效的作品分类' };
        }

        if (data.year && (!/^\d{4}$/.test(data.year) || parseInt(data.year) < 1900 || parseInt(data.year) > new Date().getFullYear() + 1)) {
            return { isValid: false, message: '请输入有效的年份（1900-' + (new Date().getFullYear() + 1) + '）' };
        }

        if (data.titleZh.length > 100) {
            return { isValid: false, message: '中文标题长度不能超过100个字符' };
        }

        return { isValid: true };
    }

    getArtworkImageUrl() {
        // 优先级1：新上传的图片
        if (this.tempImageData && this.tempImageData.url) {
            return this.tempImageData.url;
        }
        // 优先级2：编辑模式下保留原图
        if (this.currentEditingArtwork) {
            const current = dataManager.getArtworkById(this.currentEditingArtwork);
            if (current && current.image) return current.image;
        }
        return null;
    }

    showSaveProgress(show) {
        const saveBtn = document.querySelector('#artwork-form button[type="submit"]');
        if (saveBtn) {
            saveBtn.disabled = show;
            saveBtn.innerHTML = show ? '⏳ 保存中...' : '💾 保存作品';
        }
    }

    // ---------- 编辑/删除 ----------
    editArtwork(id) {
        this.openArtworkModal(id);
    }

    deleteArtwork(id) {
        if (confirm('确定要删除这件作品吗？删除后需要点击"发布到网站"才会从正式网站移除。')) {
            dataManager.deleteArtwork(id);
            this.showNotification('作品已删除（草稿）');
            this.loadArtworks();
            this.loadDashboardData();
            this.updatePublishStatus();
        }
    }

    updateBatchActions() {
        const checkboxes = document.querySelectorAll('.artwork-select:checked');
        const batchActions = document.getElementById('batch-actions');
        const deleteBtn = document.getElementById('delete-selected-btn');

        if (checkboxes.length > 0) {
            batchActions.style.display = 'flex';
            deleteBtn.textContent = `删除选中 (${checkboxes.length})`;
        } else {
            batchActions.style.display = 'none';
        }
    }

    toggleSelectAll() {
        const selectAllBtn = document.getElementById('select-all-btn');
        const checkboxes = document.querySelectorAll('.artwork-select');
        const checkedBoxes = document.querySelectorAll('.artwork-select:checked');

        const isAllSelected = checkedBoxes.length === checkboxes.length && checkboxes.length > 0;
        checkboxes.forEach(checkbox => { checkbox.checked = !isAllSelected; });
        selectAllBtn.textContent = isAllSelected ? '全选' : '取消全选';
        this.updateBatchActions();
    }

    deleteSelectedArtworks() {
        const checkboxes = document.querySelectorAll('.artwork-select:checked');
        const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-artwork-id')));

        if (selectedIds.length === 0) {
            alert('请先选择要删除的作品');
            return;
        }

        if (confirm(`确定要删除选中的 ${selectedIds.length} 件作品吗？`)) {
            selectedIds.forEach(id => dataManager.deleteArtwork(id));
            this.showNotification(`已删除 ${selectedIds.length} 件作品（草稿）`);
            this.loadArtworks();
            this.loadDashboardData();
            this.updateBatchActions();
            this.updatePublishStatus();
        }
    }

    // ---------- 个人信息 ----------
    loadProfile() {
        const profile = dataManager.getProfile();

        document.getElementById('artist-name').value = profile.name?.zh || '';
        document.getElementById('artist-name-en').value = profile.name?.en || '';
        document.getElementById('artist-name-ja').value = profile.name?.ja || '';
        document.getElementById('artist-bio').value = profile.bio?.zh || '';
        document.getElementById('contact-email').value = profile.email || '';
        document.getElementById('stat-artworks').value = profile.stats?.artworks ?? 0;
        document.getElementById('stat-exhibitions').value = profile.stats?.exhibitions ?? 0;
        document.getElementById('stat-experience').value = profile.stats?.experience ?? 0;

        const photoPreview = document.getElementById('artist-photo-preview');
        if (photoPreview) {
            photoPreview.innerHTML = profile.photo
                ? `<img src="${this.resolveImageUrl(profile.photo)}" style="max-width: 160px; max-height: 160px; border-radius: 8px; object-fit: cover;">`
                : '<small style="color:#718096;">尚未设置照片</small>';
        }
    }

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!this.isImageFile(file)) {
            this.showNotification('请选择图片文件', 'error');
            e.target.value = '';
            return;
        }

        this.showUploadProgress(true);
        this.readAndCompressImage(file)
            .then((image) => {
                const profile = dataManager.getProfile();
                profile.photo = image.url;
                dataManager.setProfile(profile);
                this.loadProfile();
                this.updatePublishStatus();
                this.showNotification('照片已更新（草稿），发布后生效', 'success');
            })
            .catch((error) => {
                this.showNotification(error.message || '照片处理失败', 'error');
            })
            .finally(() => this.showUploadProgress(false));
    }

    saveProfile() {
        try {
            const profile = dataManager.getProfile();
            const nameZh = document.getElementById('artist-name').value.trim();
            const nameEn = document.getElementById('artist-name-en').value.trim();
            const nameJa = document.getElementById('artist-name-ja').value.trim();
            const bio = document.getElementById('artist-bio').value.trim();

            profile.name = {
                zh: nameZh,
                en: nameEn || nameZh,
                ja: nameJa || nameZh
            };
            // 简介只编辑中文时，其他语言跟随中文（保留已有的不同语言文本）
            const oldBioZh = profile.bio?.zh || '';
            profile.bio = {
                zh: bio,
                en: (profile.bio?.en && profile.bio.en !== oldBioZh) ? profile.bio.en : bio,
                ja: (profile.bio?.ja && profile.bio.ja !== oldBioZh) ? profile.bio.ja : bio
            };
            profile.email = document.getElementById('contact-email').value.trim();
            profile.stats = {
                artworks: parseInt(document.getElementById('stat-artworks').value) || 0,
                exhibitions: parseInt(document.getElementById('stat-exhibitions').value) || 0,
                experience: parseInt(document.getElementById('stat-experience').value) || 0
            };

            dataManager.setProfile(profile);
            this.showNotification('个人信息已保存（草稿）');
            this.loadDashboardData();
            this.updatePublishStatus();
        } catch (error) {
            const message = error.isQuotaError ? '浏览器存储空间不足，请先发布草稿' : '保存失败：' + error.message;
            this.showNotification(message, 'error');
        }
    }

    // ---------- 设置 ----------
    loadSettings() {
        const cfg = publisher.getConfig();
        const ownerInput = document.getElementById('publish-owner');
        const repoInput = document.getElementById('publish-repo');
        const branchInput = document.getElementById('publish-branch');
        const tokenInput = document.getElementById('publish-token');
        if (ownerInput) ownerInput.value = cfg.owner;
        if (repoInput) repoInput.value = cfg.repo;
        if (branchInput) branchInput.value = cfg.branch;
        if (tokenInput) tokenInput.value = cfg.token;
    }

    savePublishConfig() {
        const config = {
            owner: this.getInputValue('publish-owner') || 'KKAIlab',
            repo: this.getInputValue('publish-repo') || 'LIN-SHILIN-portfolio',
            branch: this.getInputValue('publish-branch') || 'main',
            token: this.getInputValue('publish-token')
        };
        publisher.setConfig(config);
        this.showNotification('发布设置已保存（仅保存在本浏览器）');
    }

    async testPublishConnection() {
        this.savePublishConfig();
        const statusEl = document.getElementById('publish-config-status');
        if (statusEl) statusEl.textContent = '⏳ 正在测试连接...';
        try {
            const repo = await publisher.testConnection();
            if (statusEl) statusEl.textContent = `✅ 连接成功：${repo.full_name}（有写入权限）`;
            this.showNotification('GitHub 连接测试成功！', 'success');
        } catch (error) {
            if (statusEl) statusEl.textContent = `❌ ${error.message}`;
            this.showNotification('连接测试失败：' + error.message, 'error');
        }
    }

    updatePassword() {
        const newPassword = document.getElementById('change-password').value.trim();
        if (!newPassword) { alert('请输入新密码'); return; }
        if (newPassword.length < 6) { alert('密码长度至少6位'); return; }

        authManager.setPassword(newPassword);
        document.getElementById('change-password').value = '';
        this.showNotification('密码更新成功！');
    }

    exportData() {
        const data = dataManager.exportAllData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `artist-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        this.showNotification('数据导出成功！');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                if (dataManager.importAllData(event.target.result)) {
                    this.showNotification('数据导入成功（草稿），发布后生效');
                    this.loadDashboardData();
                    this.loadArtworks();
                    this.loadProfile();
                    this.updatePublishStatus();
                } else {
                    alert('数据导入失败，请检查文件格式');
                }
            } catch (error) {
                alert('数据导入失败：' + error.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    resetData() {
        if (confirm('确定要放弃所有未发布的修改，恢复为已发布的版本吗？')) {
            dataManager.resetDraft();
            this.showNotification('已恢复为已发布版本');
            this.loadDashboardData();
            this.loadArtworks();
            this.loadProfile();
            this.updatePublishStatus();
        }
    }

    // ---------- 发布 ----------
    updatePublishStatus() {
        const publishBtn = document.getElementById('publish-btn');
        const statusEl = document.getElementById('publish-status');
        const hasChanges = dataManager.hasUnpublishedChanges();

        if (publishBtn) {
            publishBtn.textContent = hasChanges ? '发布到网站 ●' : '发布到网站';
            publishBtn.classList.toggle('has-changes', hasChanges);
        }
        if (statusEl) {
            statusEl.textContent = hasChanges ? '有未发布的修改' : '所有修改已发布';
            statusEl.style.color = hasChanges ? '#a86a44' : '#4f7a5e';
        }
    }

    async publishToWebsite() {
        const cfg = publisher.getConfig();
        if (!cfg.token) {
            this.showNotification('请先到"网站设置"中配置 GitHub Token', 'error');
            this.switchSection('settings');
            return;
        }

        if (!dataManager.hasUnpublishedChanges()) {
            if (!confirm('当前没有检测到修改，仍要重新发布吗？')) return;
        }

        const publishBtn = document.getElementById('publish-btn');
        const progressModal = this.showPublishProgress('准备发布...');

        try {
            if (publishBtn) publishBtn.disabled = true;

            const draft = dataManager.getDraft();
            const publishedData = await publisher.publish(draft, (message) => {
                this.updatePublishProgress(progressModal, message);
            });

            // 发布成功：图片已换成仓库路径，更新本地草稿和快照
            dataManager.markPublished(publishedData);
            window.SITE_DATA = JSON.parse(JSON.stringify(publishedData));

            this.closePublishProgress(progressModal);
            this.updatePublishStatus();
            this.loadArtworks();

            alert('✅ 发布成功！\n\nGitHub Pages 正在重新部署，约1-2分钟后所有访客即可看到最新内容。\n\n可以点击"查看网站"确认效果（部署完成前可能仍显示旧内容）。');
        } catch (error) {
            console.error('❌ 发布失败:', error);
            this.closePublishProgress(progressModal);
            alert('❌ 发布失败：' + error.message + '\n\n您的修改仍保存在草稿中，解决问题后可以重新发布。');
            if (error.needsConfig) this.switchSection('settings');
        } finally {
            if (publishBtn) publishBtn.disabled = false;
        }
    }

    showPublishProgress(message) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 10002;
        `;
        modal.innerHTML = `
            <div style="background: white; padding: 30px 40px; border-radius: 12px; text-align: center; min-width: 280px;">
                <div style="font-size: 32px; margin-bottom: 12px;">🚀</div>
                <div id="publish-progress-text" style="color: #2d3748; font-weight: 500;">${message}</div>
                <div style="margin-top: 16px; width: 100%; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: #4CAF50; animation: progress 1.5s ease-in-out infinite;"></div>
                </div>
                <small style="color: #718096; display: block; margin-top: 12px;">请勿关闭页面</small>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    updatePublishProgress(modal, message) {
        const text = modal.querySelector('#publish-progress-text');
        if (text) text.textContent = message;
    }

    closePublishProgress(modal) {
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    }

    // ---------- 其他 ----------
    logout() {
        if (confirm('确定要退出登录吗？')) {
            authManager.logout();
            window.location.href = './login.html';
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '13px 24px',
            borderRadius: '999px',
            color: '#fcfaf5',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '380px',
            transform: 'translateX(440px)',
            transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
            backgroundColor: type === 'success' ? '#4f7a5e' : '#b0492f'
        });

        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(420px)';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// 全局函数供HTML调用
window.switchSection = function(section) {
    adminPanel.switchSection(section);
};

window.closeArtworkModal = function() {
    adminPanel.closeArtworkModal();
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof dataManager === 'undefined') {
        console.error('❌ dataManager未定义，延迟初始化AdminPanel');
        const retryInit = () => {
            if (typeof dataManager !== 'undefined') {
                window.adminPanel = new AdminPanel();
            } else {
                setTimeout(retryInit, 100);
            }
        };
        retryInit();
    } else {
        window.adminPanel = new AdminPanel();
    }
});
