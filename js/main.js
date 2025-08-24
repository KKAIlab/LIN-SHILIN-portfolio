// 更新个人信息和统计数据 - 与语言切换协同版本
function updateProfileData() {
    const storedProfile = localStorage.getItem('profile_data');
    if (!storedProfile) {
        console.log('📝 [个人信息] 没有找到profile_data，跳过更新');
        return;
    }
    
    const profile = JSON.parse(storedProfile);
    console.log('📝 [个人信息] 开始更新个人信息:', profile);
    
    // 等待DOM完全加载
    if (document.readyState !== 'complete') {
        setTimeout(() => updateProfileData(), 100);
        return;
    }
    
    let updatedCount = 0;
    
    // 智能更新艺术家姓名（检查是否与默认翻译不同）
    const artistNameElements = document.querySelectorAll('[data-i18n="artist-name"]');
    artistNameElements.forEach((element, index) => {
        // 检查当前语言的默认翻译
        const currentLang = window.currentLanguage || 'zh';
        const defaultTranslation = window.i18nData && window.i18nData[currentLang] && window.i18nData[currentLang]['artist-name'];
        
        // 只有当个人信息与默认翻译不同时才应用
        if (profile.name && profile.name !== defaultTranslation) {
            const oldText = element.textContent;
            element.textContent = profile.name;
            element.setAttribute('data-profile-updated', 'true');
            if (oldText !== profile.name) {
                console.log(`📝 [个人信息] [${index}] 应用自定义艺术家姓名:`, oldText, ' -> ', profile.name);
                updatedCount++;
            }
        } else {
            // 移除保护标记，允许使用翻译
            element.removeAttribute('data-profile-updated');
            console.log(`📝 [个人信息] [${index}] 艺术家姓名使用默认翻译，移除保护`);
        }
    });
    
    // 智能更新个人简介
    const aboutIntro = document.querySelector('[data-i18n="about-intro"]');
    if (aboutIntro) {
        const currentLang = window.currentLanguage || 'zh';
        const defaultTranslation = window.i18nData && window.i18nData[currentLang] && window.i18nData[currentLang]['about-intro'];
        
        if (profile.bio && profile.bio !== defaultTranslation) {
            const oldBio = aboutIntro.textContent;
            aboutIntro.textContent = profile.bio;
            aboutIntro.setAttribute('data-profile-updated', 'true');
            if (oldBio !== profile.bio) {
                console.log('📝 [个人信息] 应用自定义个人简介长度:', oldBio.length, ' -> ', profile.bio.length);
                updatedCount++;
            }
        } else {
            aboutIntro.removeAttribute('data-profile-updated');
            console.log('📝 [个人信息] 个人简介使用默认翻译，移除保护');
        }
    }
    
    // 智能更新联系邮箱
    const emailElement = document.getElementById('contact-email-address');
    if (emailElement) {
        // 邮箱通常都是自定义的，所以直接应用
        if (profile.email) {
            const oldEmail = emailElement.textContent;
            emailElement.textContent = profile.email;
            emailElement.setAttribute('data-profile-updated', 'true');
            if (oldEmail !== profile.email) {
                console.log('📝 [个人信息] 应用自定义邮箱:', oldEmail, ' -> ', profile.email);
                updatedCount++;
            }
        }
    } else {
        console.log('⚠️ [个人信息] 未找到邮箱元素 contact-email-address');
    }
    
    // 备用方法：通过类名查找邮箱元素（以防ID不存在）
    const contactEmailElements = document.querySelectorAll('.contact-item p');
    contactEmailElements.forEach(element => {
        if (element.textContent.includes('@') || 
            element.textContent.includes('linshilin') || 
            element.textContent.includes('gmail.com')) {
            const oldEmail = element.textContent;
            element.textContent = profile.email;
            element.setAttribute('data-profile-updated', 'true'); // 标记已更新
            if (oldEmail !== profile.email) {
                console.log('备用曹新邮箱:', oldEmail, ' -> ', profile.email);
                updatedCount++;
            }
        }
    });
    
    // 更新统计数据
    if (profile.stats) {
        updateStatistics(profile.stats);
    }
    
    console.log(`个人信息更新完成，共更新${updatedCount}个元素`); // 调试日志
    
    // 如果有i18n强制应用函数，也调用一下
    if (typeof window.forceApplyProfileData === 'function') {
        setTimeout(() => {
            window.forceApplyProfileData();
        }, 100);
    }
}

// 单独的统计数据更新函数
function updateStatistics(stats) {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach(element => {
        const statItem = element.closest('.stat-item');
        if (statItem) {
            const statLabel = statItem.querySelector('.stat-label');
            if (statLabel) {
                const labelText = statLabel.textContent || statLabel.getAttribute('data-i18n');
                if (labelText.includes('作品') || labelText.includes('artworks')) {
                    element.dataset.count = stats.artworks;
                    element.textContent = stats.artworks;
                } else if (labelText.includes('展览') || labelText.includes('exhibitions')) {
                    element.dataset.count = stats.exhibitions;
                    element.textContent = stats.exhibitions;
                } else if (labelText.includes('经验') || labelText.includes('experience')) {
                    element.dataset.count = stats.experience;
                    element.textContent = stats.experience;
                }
            }
        }
    });
}

// 监听localStorage变化，实时更新页面内容
function listenForDataUpdates() {
    console.log('🔄 启动增强数据监听系统...'); // 调试日志
    
    // 方法1: 监听storage事件（跨标签页更新）
    window.addEventListener('storage', function(e) {
        console.log('📨 检测到localStorage变化:', e.key); // 调试日志
        if (e.key === 'profile_data' || e.key === 'artworks_data' || e.key === 'i18n_data' || 
            e.key === 'sync_timestamp' || e.key === 'last_admin_update') {
            // 重新加载数据并更新页面
            setTimeout(() => {
                console.log('执行跨标签页数据更新'); // 调试日志
                
                // 先重新加载i18n和作品数据
                if (e.key === 'artworks_data') {
                    reloadArtworks();
                }
                if (e.key === 'i18n_data') {
                    reloadI18nData();
                }
                
                // 最后强制更新个人信息，确保不被覆盖
                setTimeout(() => {
                    console.log('强制应用个人信息更新，覆盖i18n');
                    updateProfileData();
                }, 300);
            }, 100);
        }
    });
    
    // 定时检查数据更新（同标签页更新）
    let lastProfileUpdate = localStorage.getItem('profile_data');
    let lastArtworksUpdate = localStorage.getItem('artworks_data');
    let lastI18nUpdate = localStorage.getItem('i18n_data');
    
    const checkInterval = setInterval(() => {
        const currentProfile = localStorage.getItem('profile_data');
        const currentArtworks = localStorage.getItem('artworks_data');
        const currentI18n = localStorage.getItem('i18n_data');
        
        let hasUpdates = false;
        
        if (currentProfile !== lastProfileUpdate) {
            console.log('检测到个人信息变化'); // 调试日志
            lastProfileUpdate = currentProfile;
            hasUpdates = true;
        }
        
        if (currentArtworks !== lastArtworksUpdate) {
            console.log('检测到作品数据变化'); // 调试日志
            lastArtworksUpdate = currentArtworks;
            reloadArtworks();
            hasUpdates = true;
        }
        
        if (currentI18n !== lastI18nUpdate) {
            console.log('检测到多语言数据变化'); // 调试日志
            lastI18nUpdate = currentI18n;
            reloadI18nData();
            hasUpdates = true;
        }
        
        if (hasUpdates) {
            console.log('数据更新完成，强制应用个人信息'); // 调试日志
            // 确保个人信息最后更新，避免被覆盖，增加延迟
            setTimeout(() => {
                updateProfileData();
                
                // 再次确保个人信息应用成功（减少延迟，避免过度覆盖）
                setTimeout(updateProfileData, 200);
            }, 300);
        }
    }, 1000); // 每秒检查一次
    
    // 页面卸载时清除定时器
    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
    });
    
    // 手动触发一次更新（确保页面加载时显示最新数据）
    setTimeout(() => {
        console.log('页面加载完成，执行初始数据更新'); // 调试日志
        updateProfileData();
    }, 800); // 增加延迟确保在i18n之后执行
    
    // 方法2: 监听BroadcastChannel（同源页面间通信）
    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('artwork_updates');
        channel.addEventListener('message', function(e) {
            console.log('📡 收到BroadcastChannel消息:', e.data);
            if (e.data.type === 'DATA_UPDATED') {
                console.log('🔄 通过BroadcastChannel触发数据更新');
                setTimeout(() => {
                    reloadArtworks();
                    reloadI18nData();
                    updateProfileData();
                }, 100);
            }
        });
        console.log('✅ BroadcastChannel监听器已启动');
    }
    
    // 方法3: 监听postMessage（iframe/popup通信）
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'ARTWORK_DATA_UPDATED') {
            console.log('📤 收到postMessage数据更新通知');
            setTimeout(() => {
                reloadArtworks();
                reloadI18nData();
                updateProfileData();
            }, 100);
        }
    });
    
    // 方法4: 定时检查特殊更新标记
    let lastUpdateCheck = localStorage.getItem('last_admin_update');
    const updateCheckInterval = setInterval(() => {
        const currentUpdate = localStorage.getItem('last_admin_update');
        if (currentUpdate && currentUpdate !== lastUpdateCheck) {
            console.log('⏰ 定时检查发现数据更新');
            lastUpdateCheck = currentUpdate;
            setTimeout(() => {
                reloadArtworks();
                reloadI18nData();  
                updateProfileData();
            }, 100);
        }
    }, 3000); // 每3秒检查一次
    
    // 清除定时器
    window.addEventListener('beforeunload', () => {
        clearInterval(updateCheckInterval);
    });
    
    console.log('✅ 增强数据监听系统已全部启动');
}

// 重新加载作品数据
function reloadArtworks() {
    // 更新全局作品数据
    window.artworks = getArtworksData();
    
    // 重新渲染作品集
    if (window.renderArtworks && typeof window.renderArtworks === 'function') {
        window.renderArtworks(window.artworks);
    } else {
        // 如果renderArtworks不存在，重新初始化作品集
        initGallery();
    }
}

// 重新加载多语言数据
function reloadI18nData() {
    // 更新全局i18n数据
    const newI18nData = getI18nData();
    Object.assign(i18n, newI18nData);
    
    // 重新应用当前语言
    if (typeof switchLanguage === 'function' && window.currentLanguage) {
        switchLanguage(window.currentLanguage);
    }
}

// 添加全局函数用于手动刷新数据
window.refreshProfileData = function() {
    console.log('手动刷新个人信息数据'); // 调试日志
    
    // 强制更新个人信息
    updateProfileData();
    
    // 使用i18n的强制应用函数
    if (typeof window.forceApplyProfileData === 'function') {
        setTimeout(() => {
            window.forceApplyProfileData();
        }, 200);
    }
    
    // 特别检查邮箱更新
    const storedProfile = localStorage.getItem('profile_data');
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const emailElement = document.getElementById('contact-email-address');
        if (emailElement && profile.email) {
            console.log('特别检查强制更新邮箱:', emailElement.textContent, ' -> ', profile.email);
            emailElement.textContent = profile.email;
            emailElement.setAttribute('data-profile-updated', 'true');
        }
        
        // 检查所有艺术家姓名元素
        const artistElements = document.querySelectorAll('[data-i18n="artist-name"]');
        artistElements.forEach(element => {
            console.log('特别检查强制更新艺术家姓名:', element.textContent, ' -> ', profile.name);
            element.textContent = profile.name;
            element.setAttribute('data-profile-updated', 'true');
        });
        
        // 检查个人简介
        const aboutElement = document.querySelector('[data-i18n="about-intro"]');
        if (aboutElement && profile.bio) {
            console.log('特别检查强制更新个人简介长度:', aboutElement.textContent.length, ' -> ', profile.bio.length);
            aboutElement.textContent = profile.bio;
            aboutElement.setAttribute('data-profile-updated', 'true');
        }
    }
    
    // 显示提示
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
    `;
    notification.textContent = '个人信息已强制刷新';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
};

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initLoader();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    
    // 协调式个人信息更新（与语言系统协同工作）
    setTimeout(() => {
        console.log('📝 [个人信息] 开始协调式个人信息更新'); 
        updateProfileData(); // 首次个人信息更新
    }, 600); // 确保在i18n初始化完成后运行
    
    initGallery();
    initModal();
    initCounters();
    initContactForm();
    initScrollEffects();
    initParallax();
    
    // 启动数据监听
    listenForDataUpdates();
    
    // 添加键盘快捷键：按F5强制刷新个人信息
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F5' && e.ctrlKey) {
            e.preventDefault();
            window.refreshProfileData();
        }
    });
});

// 页面加载动画
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            // 启动主页动画
            startHeroAnimations();
        }, 1000);
    });
}

// 主页动画
function startHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-title .line, .hero-subtitle, .cta-button, .scroll-indicator');
    
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// 导航栏功能
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 高亮当前部分
        highlightCurrentSection();
    });
    
    // 高亮当前部分的导航链接
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// 移动端菜单
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // 点击导航链接时关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 获取作品集数据（优先从localStorage获取）
function getArtworksData() {
    const storedArtworks = localStorage.getItem('artworks_data');
    if (storedArtworks) {
        return JSON.parse(storedArtworks);
    }
    
    // 默认作品数据（作为后备）
    return [
        {
            id: 1,
            titleKey: "artwork-1-title",
            descriptionKey: "artwork-1-desc",
            category: "paintings",
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
            details: {
                medium: "油画",
                size: "80cm × 100cm",
                year: "2024"
            }
        },
        {
            id: 2,
            titleKey: "artwork-2-title",
            descriptionKey: "artwork-2-desc",
            category: "digital",
            image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=600&fit=crop",
            details: {
                medium: "数字艺术",
                size: "3000px × 4000px",
                year: "2024"
            }
        },
        {
            id: 3,
            titleKey: "artwork-3-title",
            descriptionKey: "artwork-3-desc",
            category: "sketches",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
            details: {
                medium: "炭笔素描",
                size: "40cm × 50cm",
                year: "2023"
            }
        },
        {
            id: 4,
            titleKey: "artwork-4-title",
            descriptionKey: "artwork-4-desc",
            category: "paintings",
            image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=600&fit=crop",
            details: {
                medium: "水彩",
                size: "60cm × 80cm",
                year: "2023"
            }
        },
        {
            id: 5,
            titleKey: "artwork-5-title",
            descriptionKey: "artwork-5-desc",
            category: "digital",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=600&fit=crop",
            details: {
                medium: "数字绘画",
                size: "4000px × 3000px",
                year: "2024"
            }
        },
        {
            id: 6,
            titleKey: "artwork-6-title",
            descriptionKey: "artwork-6-desc",
            category: "sketches",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
            details: {
                medium: "铅笔素描",
                size: "35cm × 45cm",
                year: "2023"
            }
        }
    ];
}

// 作品集数据
const artworks = getArtworksData();

// 初始化作品集
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // 渲染作品 - 增强版
    function renderArtworks(worksToShow = artworks) {
        galleryGrid.innerHTML = '';
        
        worksToShow.forEach((artwork, index) => {
            const artworkCard = document.createElement('div');
            artworkCard.className = 'artwork-card';
            artworkCard.dataset.category = artwork.category;
            artworkCard.style.animationDelay = `${index * 0.1}s`;
            
            const title = getText(artwork.titleKey);
            const description = getText(artwork.descriptionKey);
            
            // 创建增强的作品卡片
            artworkCard.innerHTML = `
                <div class="artwork-image-container">
                    <img src="${artwork.image}" alt="${title}" class="artwork-image" loading="lazy">
                    <div class="artwork-overlay">
                        <div class="artwork-actions">
                            <button class="action-btn view-btn" title="查看详情" aria-label="查看详情">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                            <button class="action-btn fullscreen-btn" title="全屏查看" aria-label="全屏查看">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                                </svg>
                            </button>
                        </div>
                        <div class="artwork-meta">
                            <span class="artwork-category">${getCategoryText(artwork.category)}</span>
                            <span class="artwork-year">${artwork.details.year}</span>
                        </div>
                    </div>
                    <div class="loading-placeholder"></div>
                </div>
                <div class="artwork-info">
                    <h3 class="artwork-title">${title}</h3>
                    <p class="artwork-description">${description}</p>
                    <div class="artwork-details-preview">
                        <span class="detail-item">${artwork.details.medium}</span>
                        <span class="detail-separator">•</span>
                        <span class="detail-item">${artwork.details.size}</span>
                    </div>
                </div>
            `;
            
            // 添加交互事件
            const viewBtn = artworkCard.querySelector('.view-btn');
            const fullscreenBtn = artworkCard.querySelector('.fullscreen-btn');
            const image = artworkCard.querySelector('.artwork-image');
            
            // 查看详情
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(artwork);
            });
            
            // 全屏查看
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openFullscreen(artwork);
            });
            
            // 卡片点击事件
            artworkCard.addEventListener('click', () => openModal(artwork));
            
            // 图片加载事件
            image.addEventListener('load', () => {
                artworkCard.classList.add('image-loaded');
            });
            
            // 图片错误处理
            image.addEventListener('error', () => {
                artworkCard.classList.add('image-error');
                const placeholder = artworkCard.querySelector('.loading-placeholder');
                placeholder.innerHTML = '<span>图片加载失败</span>';
            });
            
            // 鼠标悬停效果增强
            artworkCard.addEventListener('mouseenter', () => {
                artworkCard.classList.add('hovered');
            });
            
            artworkCard.addEventListener('mouseleave', () => {
                artworkCard.classList.remove('hovered');
            });
            
            galleryGrid.appendChild(artworkCard);
        });
        
        // 使用Intersection Observer优化加载动画
        observeArtworkCards();
        
        // 增强的入场动画
        setTimeout(() => {
            const cards = document.querySelectorAll('.artwork-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }, 100);
    }
    
    // 过滤功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 过滤作品
            const filteredWorks = filter === 'all' 
                ? artworks 
                : artworks.filter(artwork => artwork.category === filter);
            
            renderArtworks(filteredWorks);
        });
    });
    
    // 初始渲染
    renderArtworks();
    
    // 将渲染函数添加到全局，供i18n使用
    window.renderArtworks = renderArtworks;
    window.artworks = artworks;
}

// 模态框功能
function initModal() {
    const modal = document.getElementById('artwork-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // 关闭模态框
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// 打开模态框
function openModal(artwork) {
    const modal = document.getElementById('artwork-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDetails = document.getElementById('modal-details');
    
    const title = getText(artwork.titleKey);
    const description = getText(artwork.descriptionKey);
    
    modalImage.src = artwork.image;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    modalDetails.innerHTML = `
        <p><strong>${getText('modal-medium')}：</strong>${artwork.details.medium}</p>
        <p><strong>${getText('modal-size')}：</strong>${artwork.details.size}</p>
        <p><strong>${getText('modal-year')}：</strong>${artwork.details.year}</p>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 数字计数动画
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateCounters() {
        if (animated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                counter.textContent = Math.floor(current);
                
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                }
            }, 20);
        });
        
        animated = true;
    }
    
    // 当统计部分出现在视窗中时开始动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// 联系表单
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // 这里你可以添加真实的表单提交逻辑
        // 例如使用 Formspree、Netlify Forms 或其他服务
        
        // 模拟提交
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('消息已发送！感谢您的联系。');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// 滚动效果
function initScrollEffects() {
    // 滚动时显示元素
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .about-content, .step, .contact-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 视差效果
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 工具函数：防抖
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 性能优化：使用 requestAnimationFrame 优化滚动事件
let ticking = false;

function updateOnScroll() {
    // 在这里添加需要在滚动时执行的代码
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// 预加载图片
function preloadImages() {
    const imageUrls = artworks.map(artwork => artwork.image);
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// 页面加载完成后预加载图片
window.addEventListener('load', preloadImages);

// 错误处理
window.addEventListener('error', function(e) {
    console.error('发生错误：', e.error);
    // 可以在这里添加错误报告逻辑
});

// 添加一些实用的CSS类动态控制
document.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
    }
}, 16)); // 约60fps

// ==================== 深色模式切换功能 ====================

// 深色模式管理
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeKey = 'preferred-theme';
        this.init();
    }
    
    init() {
        // 从localStorage获取保存的主题，或者检测系统偏好
        const savedTheme = localStorage.getItem(this.themeKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        
        // 绑定切换按钮事件
        this.bindEvents();
        
        // 监听系统主题变化
        this.watchSystemTheme();
    }
    
    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
        
        // 添加切换动画
        this.addTransitionClass();
        
        console.log(`主题已切换到: ${newTheme}`);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // 更新网站颜色meta标签
        this.updateMetaThemeColor(theme);
        
        // 触发主题切换事件
        this.dispatchThemeEvent(theme);
    }
    
    saveTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    }
    
    addTransitionClass() {
        document.documentElement.classList.add('theme-transition');
        
        // 移除过渡类（避免影响其他动画）
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }
    
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', 
                theme === 'dark' ? '#1a1a1a' : '#ffffff'
            );
        } else {
            // 如果不存在，创建meta标签
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
            document.head.appendChild(meta);
        }
    }
    
    dispatchThemeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }
    
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // 只在用户没有手动设置过主题时跟随系统
            if (!localStorage.getItem(this.themeKey)) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                console.log(`跟随系统主题变化: ${newTheme}`);
            }
        });
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // 重置为系统偏好
    resetToSystemPreference() {
        localStorage.removeItem(this.themeKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme = systemPrefersDark ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// 初始化深色模式
const themeManager = new ThemeManager();

// 监听主题切换事件，处理特殊元素
document.addEventListener('themeChanged', (e) => {
    const theme = e.detail.theme;
    console.log(`主题切换事件触发: ${theme}`);
    
    // 这里可以添加特殊元素的主题切换处理
    // 例如：更新图片、图标等
});

// 在CSS中添加主题切换过渡动画类
const themeTransitionCSS = `
.theme-transition,
.theme-transition *,
.theme-transition *:before,
.theme-transition *:after {
    transition: all 300ms !important;
    transition-delay: 0 !important;
}
`;

// 动态添加过渡样式
const style = document.createElement('style');
style.textContent = themeTransitionCSS;
document.head.appendChild(style);

// ==================== 作品展示增强功能 ====================

// 获取分类文本
function getCategoryText(category) {
    const categoryMap = {
        'paintings': window.currentLanguage === 'en' ? 'Painting' : 
                    window.currentLanguage === 'ja' ? '絵画' : '绘画',
        'digital': window.currentLanguage === 'en' ? 'Digital Art' : 
                  window.currentLanguage === 'ja' ? 'デジタルアート' : '数字艺术',
        'sketches': window.currentLanguage === 'en' ? 'Sketch' : 
                   window.currentLanguage === 'ja' ? 'スケッチ' : '素描'
    };
    return categoryMap[category] || category;
}

// Intersection Observer 优化图片加载和动画
function observeArtworkCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('in-viewport');
                
                // 懒加载图片优化
                const img = card.querySelector('.artwork-image');
                if (img && !img.src.startsWith('data:')) {
                    // 图片已经有src，但可以添加加载状态管理
                    img.classList.add('loading');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    document.querySelectorAll('.artwork-card').forEach(card => {
        observer.observe(card);
    });
}

// 全屏查看功能
function openFullscreen(artwork) {
    // 创建全屏容器
    const fullscreenModal = document.createElement('div');
    fullscreenModal.className = 'fullscreen-modal';
    fullscreenModal.innerHTML = `
        <div class="fullscreen-content">
            <button class="fullscreen-close" aria-label="关闭全屏">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="fullscreen-image-container">
                <img src="${artwork.image}" alt="${getText(artwork.titleKey)}" class="fullscreen-image">
                <div class="image-loading">
                    <div class="loading-spinner"></div>
                </div>
            </div>
            <div class="fullscreen-info">
                <h2>${getText(artwork.titleKey)}</h2>
                <p>${getText(artwork.descriptionKey)}</p>
                <div class="fullscreen-details">
                    <span>${artwork.details.medium}</span>
                    <span>•</span>
                    <span>${artwork.details.size}</span>
                    <span>•</span>
                    <span>${artwork.details.year}</span>
                </div>
            </div>
            <div class="fullscreen-controls">
                <button class="control-btn zoom-in" title="放大">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </button>
                <button class="control-btn zoom-out" title="缩小">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </button>
                <button class="control-btn reset-zoom" title="重置">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(fullscreenModal);
    document.body.style.overflow = 'hidden';
    
    // 全屏控制事件
    const closeBtn = fullscreenModal.querySelector('.fullscreen-close');
    const image = fullscreenModal.querySelector('.fullscreen-image');
    const zoomInBtn = fullscreenModal.querySelector('.zoom-in');
    const zoomOutBtn = fullscreenModal.querySelector('.zoom-out');
    const resetZoomBtn = fullscreenModal.querySelector('.reset-zoom');
    
    let currentZoom = 1;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    
    // 关闭全屏
    function closeFullscreen() {
        fullscreenModal.classList.add('closing');
        setTimeout(() => {
            document.body.removeChild(fullscreenModal);
            document.body.style.overflow = '';
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeFullscreen);
    
    // 点击背景关闭
    fullscreenModal.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) {
            closeFullscreen();
        }
    });
    
    // ESC键关闭
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeFullscreen();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // 缩放控制
    function updateImageTransform() {
        image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }
    
    zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(currentZoom * 1.2, 3);
        updateImageTransform();
    });
    
    zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(currentZoom / 1.2, 0.5);
        updateImageTransform();
    });
    
    resetZoomBtn.addEventListener('click', () => {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
    });
    
    // 鼠标拖拽
    image.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            image.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        image.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    });
    
    // 鼠标滚轮缩放
    fullscreenModal.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        currentZoom = Math.min(Math.max(currentZoom * delta, 0.5), 3);
        updateImageTransform();
    });
    
    // 图片加载完成后移除loading状态
    image.addEventListener('load', () => {
        fullscreenModal.querySelector('.image-loading').style.display = 'none';
    });
    
    // 显示动画
    setTimeout(() => {
        fullscreenModal.classList.add('show');
    }, 10);
}