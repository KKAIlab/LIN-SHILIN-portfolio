// 更新个人信息和统计数据
function updateProfileData() {
    const storedProfile = localStorage.getItem('profile_data');
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        
        // 更新艺术家姓名
        const artistNameElements = document.querySelectorAll('[data-i18n="artist-name"]');
        artistNameElements.forEach(element => {
            element.textContent = profile.name;
        });
        
        // 更新关于页面的个人简介
        const aboutIntro = document.querySelector('[data-i18n="about-intro"]');
        if (aboutIntro) {
            aboutIntro.textContent = profile.bio;
        }
        
        // 更新联系邮箱
        const contactEmailP = document.querySelector('.contact-item p');
        if (contactEmailP && contactEmailP.textContent.includes('@')) {
            contactEmailP.textContent = profile.email;
        }
        
        // 更新统计数据的data-count属性
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        statNumbers.forEach(element => {
            const statItem = element.closest('.stat-item');
            if (statItem) {
                const statLabel = statItem.querySelector('.stat-label');
                if (statLabel) {
                    const labelText = statLabel.textContent || statLabel.getAttribute('data-i18n');
                    if (labelText.includes('作品') || labelText.includes('artworks')) {
                        element.dataset.count = profile.stats.artworks;
                        element.textContent = profile.stats.artworks;
                    } else if (labelText.includes('展览') || labelText.includes('exhibitions')) {
                        element.dataset.count = profile.stats.exhibitions;
                        element.textContent = profile.stats.exhibitions;
                    } else if (labelText.includes('经验') || labelText.includes('experience')) {
                        element.dataset.count = profile.stats.experience;
                        element.textContent = profile.stats.experience;
                    }
                }
            }
        });
    }
}

// 监听localStorage变化，实时更新页面内容
function listenForDataUpdates() {
    // 监听storage事件（跨标签页更新）
    window.addEventListener('storage', function(e) {
        if (e.key === 'profile_data' || e.key === 'artworks_data' || e.key === 'i18n_data') {
            // 重新加载数据并更新页面
            setTimeout(() => {
                updateProfileData();
                reloadArtworks();
                reloadI18nData();
            }, 100);
        }
    });
    
    // 定时检查数据更新（同标签页更新）
    let lastProfileUpdate = localStorage.getItem('profile_data');
    let lastArtworksUpdate = localStorage.getItem('artworks_data');
    let lastI18nUpdate = localStorage.getItem('i18n_data');
    
    setInterval(() => {
        const currentProfile = localStorage.getItem('profile_data');
        const currentArtworks = localStorage.getItem('artworks_data');
        const currentI18n = localStorage.getItem('i18n_data');
        
        if (currentProfile !== lastProfileUpdate) {
            lastProfileUpdate = currentProfile;
            updateProfileData();
        }
        
        if (currentArtworks !== lastArtworksUpdate) {
            lastArtworksUpdate = currentArtworks;
            reloadArtworks();
        }
        
        if (currentI18n !== lastI18nUpdate) {
            lastI18nUpdate = currentI18n;
            reloadI18nData();
        }
    }, 1000); // 每秒检查一次
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

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initLoader();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    updateProfileData(); // 更新个人信息
    initGallery();
    initModal();
    initCounters();
    initContactForm();
    initScrollEffects();
    initParallax();
    
    // 启动数据监听
    listenForDataUpdates();
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
    
    // 渲染作品
    function renderArtworks(worksToShow = artworks) {
        galleryGrid.innerHTML = '';
        
        worksToShow.forEach((artwork, index) => {
            const artworkCard = document.createElement('div');
            artworkCard.className = 'artwork-card';
            artworkCard.dataset.category = artwork.category;
            artworkCard.style.animationDelay = `${index * 0.1}s`;
            
            const title = getText(artwork.titleKey);
            const description = getText(artwork.descriptionKey);
            
            artworkCard.innerHTML = `
                <img src="${artwork.image}" alt="${title}" class="artwork-image" loading="lazy">
                <div class="artwork-info">
                    <h3 class="artwork-title">${title}</h3>
                    <p class="artwork-description">${description}</p>
                </div>
            `;
            
            // 添加点击事件
            artworkCard.addEventListener('click', () => openModal(artwork));
            
            galleryGrid.appendChild(artworkCard);
        });
        
        // 添加入场动画
        gsap.fromTo('.artwork-card', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
        );
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