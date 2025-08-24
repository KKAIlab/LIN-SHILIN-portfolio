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
    
    // 加载作品列表
    loadArtworks(searchTerm = '', category = '') {
        const artworks = dataManager.getArtworks();
        const i18nData = dataManager.getI18nData();
        const grid = document.getElementById('artworks-grid');
        
        // 过滤作品
        let filteredArtworks = artworks;
        
        if (searchTerm) {
            filteredArtworks = filteredArtworks.filter(artwork => {
                const title = i18nData.zh[artwork.titleKey] || '';
                const desc = i18nData.zh[artwork.descriptionKey] || '';
                return title.includes(searchTerm) || desc.includes(searchTerm);
            });
        }
        
        if (category) {
            filteredArtworks = filteredArtworks.filter(artwork => artwork.category === category);
        }
        
        grid.innerHTML = '';
        
        filteredArtworks.forEach(artwork => {
            const title = i18nData.zh[artwork.titleKey] || '未命名';
            const desc = i18nData.zh[artwork.descriptionKey] || '';
            
            const card = document.createElement('div');
            card.className = 'artwork-card';
            card.innerHTML = `
                <img src="${artwork.image}" alt="${title}" class="artwork-image" loading="lazy">
                <div class="artwork-info">
                    <h3 class="artwork-title">${title}</h3>
                    <div class="artwork-meta">分类：${this.getCategoryName(artwork.category)} | ${artwork.details.year}</div>
                    <div class="artwork-actions">
                        <button class="btn btn-primary btn-small" onclick="adminPanel.editArtwork(${artwork.id})">编辑</button>
                        <button class="btn btn-danger btn-small" onclick="adminPanel.deleteArtwork(${artwork.id})">删除</button>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        if (filteredArtworks.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">没有找到符合条件的作品</p>';
        }
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
    
    // 处理图片上传
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '8px';
            
            document.getElementById('image-preview').innerHTML = '';
            document.getElementById('image-preview').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    
    // 保存作品
    saveArtwork() {
        const form = document.getElementById('artwork-form');
        const formData = new FormData(form);
        
        // 获取表单数据
        const titleZh = document.getElementById('artwork-title-zh').value.trim();
        const titleEn = document.getElementById('artwork-title-en').value.trim();
        const titleJa = document.getElementById('artwork-title-ja').value.trim();
        const descZh = document.getElementById('artwork-desc-zh').value.trim();
        const descEn = document.getElementById('artwork-desc-en').value.trim();
        const descJa = document.getElementById('artwork-desc-ja').value.trim();
        const category = document.getElementById('artwork-category').value;
        const medium = document.getElementById('artwork-medium').value.trim();
        const size = document.getElementById('artwork-size').value.trim();
        const year = document.getElementById('artwork-year').value.trim();
        
        // 验证必填字段
        if (!titleZh || !category) {
            alert('请填写必填字段：中文标题和分类');
            return;
        }
        
        // 获取图片
        let imageUrl = '';
        const imagePreview = document.getElementById('image-preview').querySelector('img');
        if (imagePreview) {
            imageUrl = imagePreview.src;
        } else if (this.currentEditingArtwork) {
            // 编辑模式下保留原图片
            const currentArtwork = dataManager.getArtworkById(this.currentEditingArtwork);
            imageUrl = currentArtwork.image;
        }
        
        if (!imageUrl) {
            alert('请选择作品图片');
            return;
        }
        
        // 生成唯一的key
        const timestamp = Date.now();
        const titleKey = this.currentEditingArtwork ? 
            dataManager.getArtworkById(this.currentEditingArtwork).titleKey :
            `artwork-${timestamp}-title`;
        const descKey = this.currentEditingArtwork ? 
            dataManager.getArtworkById(this.currentEditingArtwork).descriptionKey :
            `artwork-${timestamp}-desc`;
        
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
        console.log('触发前台数据同步...');
        
        // 触发storage事件，通知前台页面数据已更新
        // 这将让前台页面的storage事件监听器响应
        try {
            // 通过修改一个临时键来触发storage事件
            const timestamp = Date.now();
            localStorage.setItem('frontend_sync_trigger', timestamp);
            localStorage.removeItem('frontend_sync_trigger');
            
            // 也可以通过自定义事件的方式通知
            if (window.parent && window.parent !== window) {
                // 如果是iframe中运行，通知父窗口
                window.parent.postMessage({
                    type: 'DATA_UPDATED',
                    timestamp: timestamp
                }, '*');
            }
            
            this.showNotification('数据已同步到前台网站！', 'success');
            console.log('前台数据同步完成');
        } catch (error) {
            console.error('同步数据到前台时出错:', error);
            this.showNotification('数据同步失败，请刷新前台页面', 'error');
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
    // 创建全局管理面板实例
    window.adminPanel = new AdminPanel();
});