// 后台管理主要功能
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentEditingArtwork = null;
        
        this.initializeEventListeners();
        this.loadDashboardData();
    }
    
    // 初始化事件监听器
    initializeEventListeners() {
        // 导航切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
        
        // 登出按钮
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
        
        // 保存所有更改按钮
        document.getElementById('save-all-btn').addEventListener('click', () => {
            this.saveAllChanges();
        });
        
        // 作品管理相关
        document.getElementById('add-artwork-btn').addEventListener('click', () => {
            this.openArtworkModal();
        });
        
        document.getElementById('artwork-search').addEventListener('input', (e) => {
            this.filterArtworks(e.target.value);
        });
        
        document.getElementById('artwork-filter').addEventListener('change', (e) => {
            this.filterArtworks(null, e.target.value);
        });
        
        // 作品表单提交
        document.getElementById('artwork-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveArtwork();
        });
        
        // 图片上传
        document.getElementById('artwork-image-input').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // 批量上传（按钮 + 拖拽区域）
        this.initializeBatchUpload();
        
        // 个人信息保存
        document.getElementById('save-profile-btn').addEventListener('click', () => {
            this.saveProfile();
        });
        
        // 设置相关
        document.getElementById('update-password-btn').addEventListener('click', () => {
            this.updatePassword();
        });
        
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('import-data-btn').addEventListener('click', () => {
            document.getElementById('import-data-input').click();
        });
        
        document.getElementById('import-data-input').addEventListener('change', (e) => {
            this.importData(e);
        });
        
        // 批量操作事件
        document.getElementById('select-all-btn').addEventListener('click', () => {
            this.toggleSelectAll();
        });
        
        document.getElementById('delete-selected-btn').addEventListener('click', () => {
            this.deleteSelectedArtworks();
        });
        
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            this.resetData();
        });
        
        document.getElementById('backup-data').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('restore-data').addEventListener('click', () => {
            document.getElementById('import-data-input').click();
        });
        
        // 模态框关闭
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeArtworkModal();
        });
        
        document.getElementById('artwork-modal').addEventListener('click', (e) => {
            if (e.target.id === 'artwork-modal') {
                this.closeArtworkModal();
            }
        });
    }

    // 初始化批量上传相关事件
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
            dragArea.addEventListener('dragleave', () => {
                dragArea.classList.remove('dragover');
            });
            dragArea.addEventListener('drop', (e) => {
                e.preventDefault();
                dragArea.classList.remove('dragover');
                this.handleBatchFiles(e.dataTransfer.files);
            });
        }
    }
    
    // 切换页面部分
    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });
        
        // 更新页面标题
        const titles = {
            dashboard: '概览',
            artworks: '作品管理',
            profile: '个人信息',
            settings: '网站设置'
        };
        document.getElementById('page-title').textContent = titles[section] || '后台管理';
        
        // 切换内容区域
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
        
        this.currentSection = section;
        
        // 加载对应数据
        switch(section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'artworks':
                this.loadArtworks();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    // 加载概览数据
    loadDashboardData() {
        const stats = dataManager.getStatistics();
        const profile = dataManager.getProfile();
        
        document.getElementById('total-artworks').textContent = stats.totalArtworks;
        document.getElementById('total-exhibitions').textContent = profile.stats.exhibitions;
        document.getElementById('total-experience').textContent = profile.stats.experience + '年';
        
        const lastUpdated = new Date(stats.lastUpdated);
        document.getElementById('last-updated').textContent = lastUpdated.toLocaleDateString('zh-CN');
        
        document.getElementById('paintings-count').textContent = stats.paintings;
        document.getElementById('digital-count').textContent = stats.digital;
        document.getElementById('sketches-count').textContent = stats.sketches;
    }
    
    // 优化的作品列表加载
    loadArtworks(searchTerm = '', category = '') {
        console.log('🎨 开始加载作品列表...');
        
        try {
            const artworks = dataManager.getArtworks();
            const i18nData = dataManager.getI18nData();
            const grid = document.getElementById('artworks-grid');
            
            if (!artworks || artworks.length === 0) {
                console.warn('⚠️ 没有作品数据');
                grid.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">暂无作品数据</p>';
                return;
            }
            
            if (!i18nData) {
                console.error('❌ 多语言数据缺失');
                grid.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 40px;">多语言数据加载失败</p>';
                return;
            }
            
            console.log(`📊 共找到 ${artworks.length} 件作品`);
            
            // 过滤作品
            let filteredArtworks = [...artworks]; // 创建副本避免修改原数组
            
            if (searchTerm && searchTerm.trim()) {
                filteredArtworks = filteredArtworks.filter(artwork => {
                    try {
                        const title = i18nData.zh?.[artwork.titleKey] || artwork.titleKey || '';
                        const desc = i18nData.zh?.[artwork.descriptionKey] || artwork.descriptionKey || '';
                        const medium = artwork.details?.medium || '';
                        
                        const searchText = searchTerm.toLowerCase();
                        return title.toLowerCase().includes(searchText) || 
                               desc.toLowerCase().includes(searchText) ||
                               medium.toLowerCase().includes(searchText);
                    } catch (error) {
                        console.warn('⚠️ 搜索过滤时出错:', error);
                        return false;
                    }
                });
            }
            
            if (category && category !== 'all') {
                filteredArtworks = filteredArtworks.filter(artwork => artwork.category === category);
            }
            
            console.log(`🔍 过滤后显示 ${filteredArtworks.length} 件作品`);

            // 更新作品统计信息
            const totalCountEl = document.getElementById('total-artworks-count');
            if (totalCountEl) {
                totalCountEl.textContent = `共 ${artworks.length} 件作品`;
            }
            const filteredCountEl = document.getElementById('filtered-count');
            if (filteredCountEl) {
                const isFiltered = filteredArtworks.length !== artworks.length;
                filteredCountEl.style.display = isFiltered ? 'inline' : 'none';
                filteredCountEl.textContent = `显示 ${filteredArtworks.length} 件`;
            }

            // 清空网格
            grid.innerHTML = '';
            
            // 渲染作品卡片
            filteredArtworks.forEach(artwork => {
                try {
                    // 更安全的标题获取方式
                    let title = '未命名作品';
                    let desc = '';
                    
                    if (i18nData && i18nData.zh && artwork.titleKey) {
                        title = i18nData.zh[artwork.titleKey] || `作品 ${artwork.id}`;
                    } else if (artwork.titleKey && !artwork.titleKey.startsWith('artwork-')) {
                        title = artwork.titleKey;
                    } else {
                        title = `作品 ${artwork.id}`;
                    }
                    
                    if (i18nData && i18nData.zh && artwork.descriptionKey) {
                        desc = i18nData.zh[artwork.descriptionKey] || '';
                    } else if (artwork.descriptionKey && !artwork.descriptionKey.startsWith('artwork-')) {
                        desc = artwork.descriptionKey;
                    }
                    
                    const card = this.createArtworkCard(artwork, title, desc);
                    grid.appendChild(card);
                } catch (error) {
                    console.error('❌ 渲染作品卡片失败:', error, artwork);
                }
            });
            
            if (filteredArtworks.length === 0) {
                const noResultsMsg = searchTerm || category ? 
                    '没有找到符合条件的作品' : 
                    '暂无作品数据';
                grid.innerHTML = `<p style="text-align: center; color: #718096; padding: 40px;">${noResultsMsg}</p>`;
            }
            
            console.log('✅ 作品列表加载完成');
            
        } catch (error) {
            console.error('❌ 加载作品列表失败:', error);
            const grid = document.getElementById('artworks-grid');
            if (grid) {
                grid.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 40px;">作品列表加载失败，请刷新重试</p>';
            }
        }
    }
    
    // 创建作品卡片的辅助函数 - 修复事件绑定版本
    createArtworkCard(artwork, title, desc) {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.dataset.artworkId = artwork.id;
        
        // 安全的图片URL处理
        const imageUrl = artwork.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOWbvueJhzwvdGV4dD48L3N2Zz4=';
        
        // 确保title和desc不是key值
        const displayTitle = (title && !title.startsWith('artwork-')) ? title : `作品 ${artwork.id}`;
        const displayDesc = (desc && !desc.startsWith('artwork-')) ? desc : '暂无描述';
        
        card.innerHTML = `
            <div class="artwork-checkbox">
                <input type="checkbox" class="artwork-select" data-artwork-id="${artwork.id}">
            </div>
            <div class="artwork-image-container">
                <img src="${imageUrl}" alt="${displayTitle}" class="artwork-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4='">
                <div class="artwork-overlay">
                    <button class="btn btn-sm btn-primary artwork-preview-btn" data-artwork-id="${artwork.id}" title="预览">👁</button>
                </div>
            </div>
            <div class="artwork-info">
                <h3 class="artwork-title" title="${displayTitle}">${displayTitle}</h3>
                <div class="artwork-meta">
                    <span class="category-badge category-${artwork.category}">${this.getCategoryName(artwork.category)}</span>
                    <span class="year-badge">${artwork.details?.year || '未知'}</span>
                </div>
                <div class="artwork-description" title="${displayDesc}">${displayDesc.length > 50 ? displayDesc.substring(0, 50) + '...' : displayDesc}</div>
                <div class="artwork-details">
                    <small>${artwork.details?.medium || '未知媒介'} | ${artwork.details?.size || '未知尺寸'}</small>
                </div>
                <div class="artwork-actions">
                    <button class="btn btn-primary btn-small artwork-edit-btn" data-artwork-id="${artwork.id}" title="编辑作品" style="pointer-events: auto; z-index: 10;">
                        ✏️ 编辑
                    </button>
                    <button class="btn btn-danger btn-small artwork-delete-btn" data-artwork-id="${artwork.id}" title="删除作品" style="pointer-events: auto; z-index: 10;">
                        🗑️ 删除
                    </button>
                </div>
            </div>
        `;
        
        // 绑定事件监听器（避免onclick依赖全局变量）
        this.bindCardEvents(card, artwork);
        
        return card;
    }
    
    // 绑定卡片事件
    bindCardEvents(card, artwork) {
        try {
            // 预览按钮
            const previewBtn = card.querySelector('.artwork-preview-btn');
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.previewArtwork(artwork.id);
                });
            } else {
                console.warn('⚠️ 预览按钮未找到');
            }
            
            // 编辑按钮
            const editBtn = card.querySelector('.artwork-edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.editArtwork(artwork.id);
                });
            } else {
                console.warn('⚠️ 编辑按钮未找到');
            }
            
            // 删除按钮
            const deleteBtn = card.querySelector('.artwork-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteArtwork(artwork.id);
                });
            } else {
                console.warn('⚠️ 删除按钮未找到');
            }

            // 复选框
            const checkbox = card.querySelector('.artwork-select');
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    this.updateBatchActions();
                });
            }
        } catch (error) {
            console.error('❌ 绑定卡片事件失败:', error);
        }
    }
    
    // 预览作品功能
    previewArtwork(id) {
        const artwork = dataManager.getArtworkById(id);
        if (!artwork) return;
        
        const i18nData = dataManager.getI18nData();
        const title = i18nData?.zh?.[artwork.titleKey] || '未命名';
        
        // 创建简单的预览模态框
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
            z-index: 10000; cursor: pointer;
        `;
        
        modal.innerHTML = `
            <div class="preview-content" style="max-width: 80%; max-height: 80%; text-align: center;">
                <img src="${artwork.image}" alt="${title}" style="max-width: 100%; max-height: 70vh; border-radius: 8px;">
                <h3 style="color: white; margin-top: 20px;">${title}</h3>
                <p style="color: #ccc; font-size: 14px;">点击任意处关闭</p>
            </div>
        `;
        
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.body.appendChild(modal);
    }
    
    // 获取分类名称
    getCategoryName(category) {
        const names = {
            paintings: '绘画',
            digital: '数字艺术',
            sketches: '素描'
        };
        return names[category] || category;
    }
    
    // 过滤作品
    filterArtworks(searchTerm = null, category = null) {
        const currentSearch = searchTerm !== null ? searchTerm : document.getElementById('artwork-search').value;
        const currentCategory = category !== null ? category : document.getElementById('artwork-filter').value;
        
        this.loadArtworks(currentSearch, currentCategory);
    }
    
    // 打开作品编辑模态框
    openArtworkModal(artworkId = null) {
        const modal = document.getElementById('artwork-modal');
        const form = document.getElementById('artwork-form');
        const title = document.getElementById('modal-title');
        
        if (artworkId) {
            // 编辑模式
            const artwork = dataManager.getArtworkById(artworkId);
            const i18nData = dataManager.getI18nData();
            
            this.currentEditingArtwork = artworkId;
            title.textContent = '编辑作品';
            
            // 填充表单数据
            document.getElementById('artwork-id').value = artwork.id;
            document.getElementById('artwork-title-zh').value = i18nData.zh[artwork.titleKey] || '';
            document.getElementById('artwork-title-en').value = i18nData.en[artwork.titleKey] || '';
            document.getElementById('artwork-title-ja').value = i18nData.ja[artwork.titleKey] || '';
            document.getElementById('artwork-desc-zh').value = i18nData.zh[artwork.descriptionKey] || '';
            document.getElementById('artwork-desc-en').value = i18nData.en[artwork.descriptionKey] || '';
            document.getElementById('artwork-desc-ja').value = i18nData.ja[artwork.descriptionKey] || '';
            document.getElementById('artwork-category').value = artwork.category;
            document.getElementById('artwork-medium').value = artwork.details.medium || '';
            document.getElementById('artwork-size').value = artwork.details.size || '';
            document.getElementById('artwork-year').value = artwork.details.year || '';
            
            // 显示当前图片
            if (artwork.image) {
                document.getElementById('image-preview').innerHTML = 
                    `<img src="${artwork.image}" alt="当前图片" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
            }
        } else {
            // 添加模式
            this.currentEditingArtwork = null;
            title.textContent = '添加新作品';
            form.reset();
            document.getElementById('image-preview').innerHTML = '';
        }
        
        modal.style.display = 'block';
    }
    
    // 关闭作品编辑模态框
    closeArtworkModal() {
        document.getElementById('artwork-modal').style.display = 'none';
        this.currentEditingArtwork = null;
        document.getElementById('artwork-form').reset();
        document.getElementById('image-preview').innerHTML = '';
    }
    
    // 判断文件是否为支持的图片类型
    isImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        if (file.type && allowedTypes.includes(file.type.toLowerCase())) {
            return true;
        }
        // 部分系统/浏览器不提供MIME类型，回退到扩展名判断
        return /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name || '');
    }

    // 图片上传处理（单张，作品编辑表单内）
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        console.log('📸 开始处理图片上传:', file.name, '大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB');

        if (!this.isImageFile(file)) {
            this.showNotification('请选择图片文件（支持 JPG, PNG, GIF, WebP）', 'error');
            e.target.value = '';
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showNotification('图片文件大小不能超过10MB', 'error');
            e.target.value = '';
            return;
        }

        this.showUploadProgress(true);

        this.readAndCompressImage(file)
            .then((image) => {
                this.tempImageData = {
                    url: image.url,
                    name: image.name,
                    size: image.size,
                    type: image.type,
                    originalSize: file.size
                };
                this.displayImagePreview(image.url, image.name);
                this.showNotification('图片已就绪，保存作品后生效', 'success');
                console.log('✅ 图片上传处理完成');
            })
            .catch((error) => {
                console.error('❌ 图片处理失败:', error);
                this.showNotification(error.message || '图片处理失败，请重试', 'error');
                e.target.value = '';
            })
            .finally(() => {
                this.showUploadProgress(false);
            });
    }

    // 读取并压缩图片文件，返回 Promise<{url, name, size, type}>
    readAndCompressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const originalUrl = event.target.result;
                if (!originalUrl || !originalUrl.startsWith('data:image/')) {
                    reject(new Error('图片数据格式无效'));
                    return;
                }

                // 小图片直接使用原图，避免无谓的质量损失（GIF动画也得以保留）
                if (file.size <= 300 * 1024) {
                    resolve({ url: originalUrl, name: file.name, size: file.size, type: file.type });
                    return;
                }

                const img = new Image();
                img.onload = () => {
                    try {
                        const compressedUrl = this.compressToDataUrl(img);
                        // 压缩结果反而更大时使用原图
                        const finalUrl = compressedUrl.length < originalUrl.length ? compressedUrl : originalUrl;
                        console.log('🗜️ 图片压缩完成:',
                            '原始大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB',
                            '压缩后大小:', (finalUrl.length * 0.75 / 1024 / 1024).toFixed(2) + 'MB'
                        );
                        resolve({
                            url: finalUrl,
                            name: file.name,
                            size: Math.round(finalUrl.length * 0.75),
                            type: finalUrl === originalUrl ? file.type : 'image/jpeg'
                        });
                    } catch (error) {
                        console.warn('⚠️ 图片压缩失败，使用原图:', error);
                        resolve({ url: originalUrl, name: file.name, size: file.size, type: file.type });
                    }
                };
                img.onerror = () => reject(new Error('图片解码失败，文件可能已损坏'));
                img.src = originalUrl;
            };

            reader.onerror = () => reject(new Error('图片读取失败，请重试'));
            reader.readAsDataURL(file);
        });
    }

    // 将图片绘制到canvas并压缩为JPEG
    // 注意：canvas不支持输出GIF/BMP等格式，统一转为JPEG以避免回退成更大的PNG
    compressToDataUrl(img) {
        const maxDimension = 1280;
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

        // 逐步降低质量，控制单张图片占用的localStorage空间
        const maxLength = 700 * 1024; // base64字符数上限（约520KB二进制）
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > maxLength && quality > 0.4) {
            quality -= 0.15;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        return dataUrl;
    }

    // 批量上传图片文件，每张图片自动创建一个作品
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
        if (saved > 0) {
            this.syncDataToFrontend();
        }

        if (quotaHit) {
            this.showNotification(`已上传 ${saved} 张后浏览器存储空间不足，请删除部分作品后再试`, 'error');
        } else {
            let message = `批量上传完成：成功 ${saved} 张`;
            if (failed > 0) message += `，失败 ${failed} 张`;
            if (skipped > 0) message += `，跳过 ${skipped} 个非图片或超大文件`;
            this.showNotification(message, failed > 0 ? 'error' : 'success');
        }
    }

    // 为批量上传的图片创建作品记录
    saveBatchArtwork(image, file) {
        const baseName = (file.name || '未命名作品').replace(/\.[^.]+$/, '');
        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const titleKey = `artwork-${uniqueId}-title`;
        const descKey = `artwork-${uniqueId}-desc`;

        const i18nData = dataManager.getI18nData();
        ['zh', 'en', 'ja'].forEach(lang => {
            i18nData[lang][titleKey] = baseName;
            i18nData[lang][descKey] = '';
        });
        dataManager.setI18nData(i18nData);

        const artwork = dataManager.addArtwork({
            titleKey: titleKey,
            descriptionKey: descKey,
            category: 'paintings',
            image: image.url,
            details: {
                medium: '未指定',
                size: '未指定',
                year: new Date().getFullYear().toString()
            }
        });

        if (!artwork) {
            throw new Error('作品保存失败');
        }
    }
    
    // 显示上传进度
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
        } else {
            if (progressEl && progressEl.parentNode) {
                progressEl.parentNode.removeChild(progressEl);
            }
        }
    }
    
    // 显示图片预览
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
    
    // 移除图片预览
    removeImagePreview() {
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('artwork-image-input').value = '';
        this.tempImageData = null;
        console.log('🗑️ 图片预览已移除');
    }
    
    // 替换图片
    replaceImage() {
        document.getElementById('artwork-image-input').click();
    }
    
    // 添加URL图片支持
    addImageFromUrl() {
        const url = prompt('请输入图片URL:');
        if (!url) return;
        
        // 验证URL格式
        try {
            new URL(url);
        } catch (e) {
            alert('请输入有效的URL地址');
            return;
        }
        
        // 创建图片元素验证URL是否有效
        const img = new Image();
        img.onload = () => {
            this.displayImagePreview(url, '外部图片');
            this.tempImageData = {
                url: url,
                name: '外部图片',
                type: 'url',
                isExternal: true
            };
            console.log('✅ 外部图片URL验证成功');
        };
        
        img.onerror = () => {
            alert('无法加载该图片URL，请检查地址是否正确');
        };
        
        img.src = url;
    }
    
    // 优化的作品保存功能
    saveArtwork() {
        console.log('🚀 开始保存作品...');
        
        try {
            // 显示保存状态
            this.showSaveProgress(true);
            
            const form = document.getElementById('artwork-form');
            if (!form) {
                throw new Error('找不到表单元素');
            }
            
            // 获取并验证表单数据
            const formData = this.extractFormData();
            const validationResult = this.validateFormData(formData);
            
            if (!validationResult.isValid) {
                this.showNotification(validationResult.message, 'error');
                this.showSaveProgress(false);
                return;
            }
            
            console.log('📝 表单验证通过:', formData);
            
            // 获取图片URL
            const imageUrl = this.getArtworkImageUrl();
            if (!imageUrl) {
                this.showNotification('请选择作品图片', 'error');
                this.showSaveProgress(false);
                return;
            }
            
            console.log('🖼️ 图片URL获取成功，长度:', imageUrl.length);
            
            // 执行保存
            this.executeArtworkSave(formData, imageUrl);
            
        } catch (error) {
            console.error('❌ 保存作品时发生错误:', error);
            this.showNotification('保存失败：' + error.message, 'error');
            this.showSaveProgress(false);
        }
    }
    
    // 提取表单数据
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
    
    // 安全获取输入值
    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    }
    
    // 验证表单数据
    validateFormData(data) {
        // 必填字段验证
        if (!data.titleZh) {
            return { isValid: false, message: '请填写中文标题' };
        }
        
        if (!data.category) {
            return { isValid: false, message: '请选择作品分类' };
        }
        
        // 分类验证
        const allowedCategories = ['paintings', 'digital', 'sketches'];
        if (!allowedCategories.includes(data.category)) {
            return { isValid: false, message: '无效的作品分类' };
        }
        
        // 年份验证（如果填写）
        if (data.year && (!/^\d{4}$/.test(data.year) || parseInt(data.year) < 1900 || parseInt(data.year) > new Date().getFullYear() + 1)) {
            return { isValid: false, message: '请输入有效的年份（1900-' + (new Date().getFullYear() + 1) + '）' };
        }
        
        // 标题长度验证
        if (data.titleZh.length > 100) {
            return { isValid: false, message: '中文标题长度不能超过100个字符' };
        }
        
        return { isValid: true };
    }
    
    // 获取作品图片URL
    getArtworkImageUrl() {
        // 优先级1：临时上传的图片
        if (this.tempImageData && this.tempImageData.url) {
            console.log('✅ 使用临时上传的图片');
            return this.tempImageData.url;
        }
        
        // 优先级2：预览容器中的图片
        const imagePreview = document.querySelector('#image-preview img');
        if (imagePreview && imagePreview.src && !imagePreview.src.includes('data:image/svg+xml')) {
            console.log('✅ 使用预览容器中的图片');
            return imagePreview.src;
        }
        
        // 优先级3：编辑模式下的原始图片
        if (this.currentEditingArtwork) {
            const currentArtwork = dataManager.getArtworkById(this.currentEditingArtwork);
            if (currentArtwork && currentArtwork.image) {
                console.log('✅ 使用现有作品的图片');
                return currentArtwork.image;
            }
        }
        
        console.warn('⚠️ 未找到有效的图片URL');
        return null;
    }
    
    // 执行作品保存
    executeArtworkSave(formData, imageUrl) {
        try {
            // 生成唯一的key
            const timestamp = Date.now();
            const titleKey = this.currentEditingArtwork ? 
                dataManager.getArtworkById(this.currentEditingArtwork).titleKey :
                `artwork-${timestamp}-title`;
            const descKey = this.currentEditingArtwork ? 
                dataManager.getArtworkById(this.currentEditingArtwork).descriptionKey :
                `artwork-${timestamp}-desc`;
            
            console.log('🔑 生成键值:', { titleKey, descKey });
            
            // 更新多语言数据
            this.updateI18nData(titleKey, descKey, formData);
            
            // 创建作品对象
            const artwork = {
                titleKey: titleKey,
                descriptionKey: descKey,
                category: formData.category,
                image: imageUrl,
                details: {
                    medium: formData.medium || '未指定',
                    size: formData.size || '未指定',
                    year: formData.year || new Date().getFullYear().toString()
                }
            };
            
            // 保存作品
            let savedArtwork;
            if (this.currentEditingArtwork) {
                savedArtwork = dataManager.updateArtwork(this.currentEditingArtwork, artwork);
                console.log('📝 更新作品:', savedArtwork);
            } else {
                savedArtwork = dataManager.addArtwork(artwork);
                console.log('➕ 添加新作品:', savedArtwork);
            }
            
            if (!savedArtwork) {
                throw new Error('作品保存失败，请检查数据');
            }
            
            // 清理临时数据
            this.tempImageData = null;
            
            // 显示成功消息
            const message = this.currentEditingArtwork ? '作品更新成功！' : '作品添加成功！';
            this.showNotification(message, 'success');
            
            // 关闭模态框并刷新列表
            this.closeArtworkModal();
            this.loadArtworks();
            this.loadDashboardData();
            
            // 同步到前台
            this.syncDataToFrontend();
            
            this.showSaveProgress(false);
            console.log('✅ 作品保存完成');
            
        } catch (error) {
            console.error('❌ 执行保存时发生错误:', error);
            if (error.isQuotaError) {
                this.showNotification('浏览器存储空间不足，无法保存。请删除部分作品，或改用"网络图片URL"方式添加图片', 'error');
                this.showSaveProgress(false);
                return;
            }
            throw error;
        }
    }
    
    // 更新多语言数据
    updateI18nData(titleKey, descKey, formData) {
        const i18nData = dataManager.getI18nData();
        if (!i18nData) {
            throw new Error('多语言数据未加载');
        }
        
        // 更新标题
        i18nData.zh[titleKey] = formData.titleZh;
        i18nData.en[titleKey] = formData.titleEn || formData.titleZh;
        i18nData.ja[titleKey] = formData.titleJa || formData.titleZh;
        
        // 更新描述
        i18nData.zh[descKey] = formData.descZh;
        i18nData.en[descKey] = formData.descEn || formData.descZh;
        i18nData.ja[descKey] = formData.descJa || formData.descZh;
        
        dataManager.setI18nData(i18nData);
        console.log('🌐 多语言数据已更新');
    }
    
    // 显示保存进度
    showSaveProgress(show) {
        const saveBtn = document.querySelector('#artwork-form button[type="submit"]');
        if (saveBtn) {
            if (show) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '⏳ 保存中...';
            } else {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '💾 保存作品';
            }
        }
    }
    
    // 继续作品保存流程（分离出来处理异步情况）
    continueArtworkSave(titleZh, titleEn, titleJa, descZh, descEn, descJa, category, medium, size, year, imageUrl) {
        console.log('📦 继续保存流程，图片URL长度:', imageUrl.length);
        
        // 生成唯一的key
        const timestamp = Date.now();
        const titleKey = this.currentEditingArtwork ? 
            dataManager.getArtworkById(this.currentEditingArtwork).titleKey :
            `artwork-${timestamp}-title`;
        const descKey = this.currentEditingArtwork ? 
            dataManager.getArtworkById(this.currentEditingArtwork).descriptionKey :
            `artwork-${timestamp}-desc`;
        
        console.log('🔑 生成键值:', { titleKey, descKey });
        
        // 更新多语言数据
        const i18nData = dataManager.getI18nData();
        i18nData.zh[titleKey] = titleZh;
        i18nData.en[titleKey] = titleEn || titleZh;
        i18nData.ja[titleKey] = titleJa || titleZh;
        i18nData.zh[descKey] = descZh;
        i18nData.en[descKey] = descEn || descZh;
        i18nData.ja[descKey] = descJa || descZh;
        dataManager.setI18nData(i18nData);
        
        // 创建作品对象
        const artwork = {
            titleKey: titleKey,
            descriptionKey: descKey,
            category: category,
            image: imageUrl,
            details: {
                medium: medium,
                size: size,
                year: year
            }
        };
        
        // 保存作品
        if (this.currentEditingArtwork) {
            dataManager.updateArtwork(this.currentEditingArtwork, artwork);
            this.showNotification('作品更新成功！');
        } else {
            dataManager.addArtwork(artwork);
            this.showNotification('作品添加成功！');
        }
        
        this.closeArtworkModal();
        this.loadArtworks();
        this.loadDashboardData();
        
        // 同步数据到前台
        this.syncDataToFrontend();
    }
    
    // 编辑作品
    editArtwork(id) {
        this.openArtworkModal(id);
    }
    
    // 删除作品
    deleteArtwork(id) {
        if (confirm('确定要删除这件作品吗？此操作不可撤销。')) {
            const artwork = dataManager.getArtworkById(id);
            
            // 删除多语言数据
            const i18nData = dataManager.getI18nData();
            delete i18nData.zh[artwork.titleKey];
            delete i18nData.en[artwork.titleKey];
            delete i18nData.ja[artwork.titleKey];
            delete i18nData.zh[artwork.descriptionKey];
            delete i18nData.en[artwork.descriptionKey];
            delete i18nData.ja[artwork.descriptionKey];
            dataManager.setI18nData(i18nData);
            
            // 删除作品
            dataManager.deleteArtwork(id);
            
            this.showNotification('作品删除成功！');
            this.loadArtworks();
            this.loadDashboardData();
            
            // 同步数据到前台
            this.syncDataToFrontend();
        }
    }
    
    // 加载个人信息
    loadProfile() {
        const profile = dataManager.getProfile();
        
        document.getElementById('artist-name').value = profile.name;
        document.getElementById('artist-bio').value = profile.bio;
        document.getElementById('contact-email').value = profile.email;
        document.getElementById('stat-artworks').value = profile.stats.artworks;
        document.getElementById('stat-exhibitions').value = profile.stats.exhibitions;
        document.getElementById('stat-experience').value = profile.stats.experience;
    }
    
    // 保存个人信息
    saveProfile() {
        const profile = {
            name: document.getElementById('artist-name').value.trim(),
            bio: document.getElementById('artist-bio').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            stats: {
                artworks: parseInt(document.getElementById('stat-artworks').value) || 0,
                exhibitions: parseInt(document.getElementById('stat-exhibitions').value) || 0,
                experience: parseInt(document.getElementById('stat-experience').value) || 0
            }
        };
        
        dataManager.setProfile(profile);
        this.showNotification('个人信息保存成功！');
        this.loadDashboardData();
        
        // 同步数据到前台
        this.syncDataToFrontend();
    }
    
    // 加载设置
    loadSettings() {
        const config = dataManager.getSiteConfig();
        document.getElementById('site-title').value = config.title;
    }
    
    // 更新密码
    updatePassword() {
        const newPassword = document.getElementById('change-password').value.trim();
        
        if (!newPassword) {
            alert('请输入新密码');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('密码长度至少6位');
            return;
        }
        
        authManager.setPassword(newPassword);
        document.getElementById('change-password').value = '';
        this.showNotification('密码更新成功！');
    }
    
    // 导出数据
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
    
    // 导入数据
    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (dataManager.importAllData(e.target.result)) {
                    this.showNotification('数据导入成功！');
                    this.loadDashboardData();
                    this.loadArtworks();
                    this.loadProfile();
                    this.loadSettings();
                    
                    // 同步数据到前台
                    this.syncDataToFrontend();
                } else {
                    alert('数据导入失败，请检查文件格式');
                }
            } catch (error) {
                alert('数据导入失败：' + error.message);
            }
        };
        reader.readAsText(file);
        
        // 清空input
        e.target.value = '';
    }
    
    // 重置数据
    resetData() {
        if (confirm('确定要重置所有数据吗？此操作不可撤销！')) {
            dataManager.resetAllData();
            this.showNotification('数据重置成功！');
            this.loadDashboardData();
            this.loadArtworks();
            this.loadProfile();
            this.loadSettings();
            
            // 同步数据到前台
            this.syncDataToFrontend();
        }
    }
    
    // 保存所有更改
    saveAllChanges() {
        this.showNotification('所有数据已保存！');
        
        // 同步数据到前台
        this.syncDataToFrontend();
    }
    
    // 同步数据到前台（触发前台数据更新）
    syncDataToFrontend() {
        console.log('🔄 触发前台数据同步...');
        
        try {
            const timestamp = Date.now();
            
            // 方法1: 触发跨标签页storage事件
            localStorage.setItem('sync_timestamp', timestamp.toString());
            
            // 方法2: 使用BroadcastChannel API（现代浏览器）
            if ('BroadcastChannel' in window) {
                const channel = new BroadcastChannel('artwork_updates');
                channel.postMessage({
                    type: 'DATA_UPDATED',
                    timestamp: timestamp,
                    keys: ['artworks_data', 'i18n_data', 'profile_data']
                });
                console.log('📡 通过BroadcastChannel发送数据更新通知');
            }
            
            // 方法3: 写入特殊标记文件触发更新
            localStorage.setItem('last_admin_update', JSON.stringify({
                timestamp: timestamp,
                type: 'artwork_change',
                action: 'sync_frontend'
            }));
            
            // 方法4: 如果是在iframe或popup中，使用postMessage
            if (window.opener) {
                window.opener.postMessage({
                    type: 'ARTWORK_DATA_UPDATED',
                    timestamp: timestamp
                }, '*');
                console.log('📤 通过postMessage通知父窗口');
            }
            
            // 方法5: 强制触发storage事件（hack方法）
            const storageEvent = new StorageEvent('storage', {
                key: 'artworks_data',
                newValue: localStorage.getItem('artworks_data'),
                oldValue: null,
                storageArea: localStorage,
                url: window.location.href
            });
            
            // 延迟触发，让其他页面有时间监听
            setTimeout(() => {
                window.dispatchEvent(storageEvent);
                console.log('🚀 手动触发storage事件');
            }, 100);
            
            this.showNotification('✅ 数据已同步到前台网站！', 'success');
            console.log('✅ 前台数据同步完成 - 使用多重通知机制');
            
        } catch (error) {
            console.error('❌ 同步数据到前台时出错:', error);
            this.showNotification('❌ 数据同步失败，请刷新前台页面', 'error');
        }
    }
    
    // 批量操作相关方法
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
    
    // 全选/取消全选
    toggleSelectAll() {
        const selectAllBtn = document.getElementById('select-all-btn');
        const checkboxes = document.querySelectorAll('.artwork-select');
        const checkedBoxes = document.querySelectorAll('.artwork-select:checked');
        
        const isAllSelected = checkedBoxes.length === checkboxes.length && checkboxes.length > 0;
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !isAllSelected;
        });
        
        selectAllBtn.textContent = isAllSelected ? '全选' : '取消全选';
        this.updateBatchActions();
    }
    
    // 批量删除作品
    deleteSelectedArtworks() {
        const checkboxes = document.querySelectorAll('.artwork-select:checked');
        const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-artwork-id')));
        
        if (selectedIds.length === 0) {
            alert('请先选择要删除的作品');
            return;
        }
        
        if (confirm(`确定要删除选中的 ${selectedIds.length} 件作品吗？此操作不可撤销。`)) {
            console.log('🗑️ 开始批量删除作品:', selectedIds);
            
            let deletedCount = 0;
            const i18nData = dataManager.getI18nData();
            
            selectedIds.forEach(id => {
                const artwork = dataManager.getArtworkById(id);
                if (artwork) {
                    // 删除多语言数据
                    delete i18nData.zh[artwork.titleKey];
                    delete i18nData.en[artwork.titleKey];
                    delete i18nData.ja[artwork.titleKey];
                    delete i18nData.zh[artwork.descriptionKey];
                    delete i18nData.en[artwork.descriptionKey];
                    delete i18nData.ja[artwork.descriptionKey];
                    
                    // 删除作品
                    dataManager.deleteArtwork(id);
                    deletedCount++;
                }
            });
            
            // 更新多语言数据
            dataManager.setI18nData(i18nData);
            
            this.showNotification(`成功删除 ${deletedCount} 件作品！`);
            this.loadArtworks();
            this.loadDashboardData();
            this.updateBatchActions();
            
            // 同步数据到前台
            this.syncDataToFrontend();
        }
    }
    
    // 登出
    logout() {
        if (confirm('确定要退出登录吗？')) {
            authManager.logout();
            window.location.href = './login.html';
        }
    }
    
    // 显示通知
    showNotification(message, type = 'success') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'success' ? '#48bb78' : '#f56565'
        });
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 显示加载状态
    showLoading(show = true) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'flex' : 'none';
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
    // 确保数据管理器已加载
    if (typeof dataManager === 'undefined') {
        console.error('❌ dataManager未定义，延迟初始化AdminPanel');
        // 重试机制
        const retryInit = () => {
            if (typeof dataManager !== 'undefined') {
                console.log('✅ dataManager已加载，开始初始化AdminPanel');
                window.adminPanel = new AdminPanel();
            } else {
                setTimeout(retryInit, 100);
            }
        };
        retryInit();
    } else {
        console.log('✅ dataManager可用，初始化AdminPanel');
        window.adminPanel = new AdminPanel();
    }
});