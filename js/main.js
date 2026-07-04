// ============================================================
// 数据访问层：网站内容来自 data/site-data.js（仓库内的唯一数据源）
// 后台管理通过 GitHub API 更新该文件，发布后对所有访客生效。
// ============================================================

// 获取网站数据（支持后台草稿预览模式：URL带 #preview 时读取本地草稿）
function getSiteData() {
    if (window.location.hash.includes('preview')) {
        try {
            const draft = localStorage.getItem('draft_site_data');
            if (draft) {
                console.log('👁 草稿预览模式：显示本地未发布的草稿数据');
                return JSON.parse(draft);
            }
        } catch (error) {
            console.warn('⚠️ 读取草稿数据失败，使用已发布数据:', error);
        }
    }
    return window.SITE_DATA || null;
}

// 取多语言字段的当前语言文本（兼容纯字符串）
function localized(value, lang) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    const l = lang || window.currentLanguage || 'zh';
    return value[l] || value.zh || value.en || value.ja || '';
}

// 应用个人信息到页面（艺术家姓名、简介、邮箱、统计、照片）
function applyProfileData() {
    const siteData = getSiteData();
    if (!siteData || !siteData.profile) return;
    const profile = siteData.profile;

    document.querySelectorAll('[data-i18n="artist-name"]').forEach(element => {
        const name = localized(profile.name);
        if (name) element.textContent = name;
    });

    const aboutIntro = document.querySelector('[data-i18n="about-intro"]');
    if (aboutIntro) {
        const bio = localized(profile.bio);
        if (bio) aboutIntro.textContent = bio;
    }

    const emailElement = document.getElementById('contact-email-address');
    if (emailElement && profile.email) {
        emailElement.textContent = profile.email;
    }

    // 社交链接：有配置的显示并设置跳转，未配置的隐藏
    const social = profile.social || {};
    document.querySelectorAll('.social-link[data-social]').forEach(link => {
        const url = social[link.dataset.social];
        if (url) {
            link.href = url;
            link.style.display = '';
        } else {
            link.style.display = 'none';
        }
    });
    const emailLink = document.querySelector('.social-link[data-social-email]');
    if (emailLink) {
        if (profile.email) {
            emailLink.href = 'mailto:' + profile.email;
            emailLink.style.display = '';
        } else {
            emailLink.style.display = 'none';
        }
    }

    if (profile.stats) {
        updateStatistics(profile.stats);
    }

    // 艺术家照片：有配置则使用，加载失败时隐藏相框
    const photoImg = document.querySelector('.about-image .image-frame img');
    if (photoImg) {
        if (profile.photo) {
            photoImg.src = profile.photo;
        }
        photoImg.onerror = () => {
            const frame = photoImg.closest('.about-image');
            if (frame) frame.style.display = 'none';
        };
    }
}

// 更新统计数据
function updateStatistics(stats) {
    const mapping = [
        { key: 'artworks', i18nKey: 'stat-artworks' },
        { key: 'exhibitions', i18nKey: 'stat-exhibitions' },
        { key: 'experience', i18nKey: 'stat-experience' }
    ];
    mapping.forEach(({ key, i18nKey }) => {
        const label = document.querySelector(`.stat-label[data-i18n="${i18nKey}"]`);
        const statItem = label && label.closest('.stat-item');
        const number = statItem && statItem.querySelector('.stat-number');
        if (number && stats[key] != null) {
            number.dataset.count = stats[key];
            number.textContent = stats[key];
        }
    });
}

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initLoader();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initGallery();
    initModal();
    initCounters();
    initContactForm();
    initScrollEffects();
    initParallax();

    // 应用个人信息（语言切换后重新应用以匹配当前语言）
    applyProfileData();
    window.addEventListener('languageChanged', applyProfileData);
});

// 页面加载动画
function initLoader() {
    const loader = document.getElementById('loader');
    let dismissed = false;

    function dismiss() {
        if (dismissed) return;
        dismissed = true;
        loader.classList.add('hidden');
        startHeroAnimations();
    }

    // 资源加载完成后尽快揭幕；同时设置兜底，避免慢网络下访客盯着加载幕
    window.addEventListener('load', () => setTimeout(dismiss, 250));
    setTimeout(dismiss, 2500);
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
    
    // 滚动时改变导航栏样式（rAF 节流，保证滚动流畅）
    let navTicking = false;
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        highlightCurrentSection();
        navTicking = false;
    }
    window.addEventListener('scroll', function() {
        if (!navTicking) {
            navTicking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();
    
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

// 获取作品集数据（来自 data/site-data.js）
function getArtworksData() {
    const siteData = getSiteData();
    if (siteData && Array.isArray(siteData.artworks)) {
        return siteData.artworks;
    }
    console.warn('⚠️ 网站数据未加载（data/site-data.js 缺失），作品集为空');
    return [];
}

// 作品集数据
const artworks = getArtworksData();

// 获取作品的多语言文本（兼容旧版 titleKey/descriptionKey 格式）
function artworkText(artwork, field) {
    const value = artwork[field];
    if (value != null) {
        return localized(value);
    }
    const legacyKey = field === 'title' ? artwork.titleKey : artwork.descriptionKey;
    return legacyKey ? getText(legacyKey) : '';
}

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
            
            const title = artworkText(artwork, 'title');
            const description = artworkText(artwork, 'description');
            
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
    
    const title = artworkText(artwork, 'title');
    const description = artworkText(artwork, 'description');

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
        
        // 模拟提交（用按钮状态反馈，避免打断浏览的弹窗）
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = '发送中…';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = '已发送，感谢您的来信';
            form.reset();
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2600);
        }, 1200);
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

// 视差效果（rAF 节流；页面上没有视差元素时不注册监听）
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    if (!shapes.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const rate = window.pageYOffset * -0.5;
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                shape.style.transform = `translateY(${rate * speed}px)`;
            });
            ticking = false;
        });
    }, { passive: true });
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
                <img src="${artwork.image}" alt="${artworkText(artwork, 'title')}" class="fullscreen-image">
                <div class="image-loading">
                    <div class="loading-spinner"></div>
                </div>
            </div>
            <div class="fullscreen-info">
                <h2>${artworkText(artwork, 'title')}</h2>
                <p>${artworkText(artwork, 'description')}</p>
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
