// 获取国际化语言资源（优先从localStorage获取）
function getI18nData() {
    const storedI18n = localStorage.getItem('i18n_data');
    if (storedI18n) {
        return JSON.parse(storedI18n);
    }
    
    // 默认多语言数据（作为后备）
    return getDefaultI18nData();
}

// 默认国际化语言资源
function getDefaultI18nData() {
    return {
    // 中文 (默认)
    zh: {
        // 艺术家姓名
        'artist-name': '林士林',
        
        // 导航栏
        'nav-home': '首页',
        'nav-about': '关于',
        'nav-gallery': '作品',
        'nav-process': '创作',
        'nav-contact': '联系',
        
        // 主题切换
        'theme-toggle': '切换深色模式',
        'theme-light': '浅色模式',
        'theme-dark': '深色模式',
        
        // 首页部分
        'hero-line1': '创造',
        'hero-line2': '独特',
        'hero-line3': '艺术',
        'hero-subtitle': '探索色彩与形态的无限可能',
        'cta-button': '查看作品',
        
        // 关于部分
        'about-title': '关于艺术家',
        'about-subtitle': '艺术是连接有形世界与无形世界的桥梁',
        'about-intro': '我是一位专注于当代艺术创作的艺术家，致力于通过多样化的媒介探索人性、自然与社会的深层联系。我的作品融合了传统技法与现代理念，希望通过独特的视觉语言与观众产生共鸣。',
        'stat-artworks': '作品',
        'stat-exhibitions': '展览',
        'stat-experience': '年经验',
        
        // 作品集部分
        'gallery-title': '作品集',
        'gallery-subtitle': '每一幅作品都是内心世界的投射',
        'filter-all': '全部',
        'filter-paintings': '绘画',
        'filter-digital': '数字艺术',
        'filter-sketches': '素描',
        
        // 创作过程部分
        'process-title': '创作过程',
        'process-subtitle': '从概念到成品的艺术之旅',
        'step1-title': '灵感捕捉',
        'step1-desc': '观察生活中的细节，收集色彩和形态的灵感',
        'step2-title': '概念构思',
        'step2-desc': '将抽象的想法转化为具体的视觉概念',
        'step3-title': '创作实现',
        'step3-desc': '运用各种技法和媒介将概念变为现实',
        'step4-title': '完善细节',
        'step4-desc': '精雕细琢，让每个细节都完美呈现',
        
        // 联系部分
        'contact-title': '联系我',
        'contact-subtitle': '让我们一起探讨艺术的无限可能',
        'contact-email': '邮箱',
        'contact-social': '社交媒体',
        'form-name': '您的姓名',
        'form-email': '邮箱地址',
        'form-message': '想说的话...',
        'form-submit': '发送消息',
        
        // 页脚
        'copyright': '版权所有',
        
        // 作品数据
        'artwork-1-title': '抽象印象',
        'artwork-1-desc': '探索色彩与情感的深层连接，通过抽象的形式表达内心的感受。',
        'artwork-2-title': '数字梦境',
        'artwork-2-desc': '运用数字技术创造的超现实主义作品，展现梦境与现实的边界。',
        'artwork-3-title': '人物素描',
        'artwork-3-desc': '通过细腻的线条捕捉人物的神韵和情感表达。',
        'artwork-4-title': '风景写生',
        'artwork-4-desc': '自然风光的真实记录，展现大自然的美丽与宁静。',
        'artwork-5-title': '未来城市',
        'artwork-5-desc': '对未来城市景观的想象，融合科技与人文元素。',
        'artwork-6-title': '静物组合',
        'artwork-6-desc': '日常物品的艺术化表达，探索光影与形态的关系。',
        
        // 模态框
        'modal-medium': '媒介',
        'modal-size': '尺寸',
        'modal-year': '年份'
    },
    
    // English
    en: {
        'artist-name': 'LIN SHILIN',
        
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-gallery': 'Gallery',
        'nav-process': 'Process',
        'nav-contact': 'Contact',
        
        // Theme toggle
        'theme-toggle': 'Toggle dark mode',
        'theme-light': 'Light mode',
        'theme-dark': 'Dark mode',
        
        'hero-line1': 'CREATE',
        'hero-line2': 'UNIQUE',
        'hero-line3': 'ART',
        'hero-subtitle': 'Exploring infinite possibilities of color and form',
        'cta-button': 'View Works',
        
        'about-title': 'About the Artist',
        'about-subtitle': 'Art is the bridge between the visible and invisible worlds',
        'about-intro': 'I am an artist dedicated to contemporary art creation, committed to exploring the deep connections between humanity, nature, and society through diverse media. My works blend traditional techniques with modern concepts, hoping to resonate with audiences through unique visual language.',
        'stat-artworks': 'Artworks',
        'stat-exhibitions': 'Exhibitions',
        'stat-experience': 'Years Experience',
        
        'gallery-title': 'Gallery',
        'gallery-subtitle': 'Every artwork is a projection of the inner world',
        'filter-all': 'All',
        'filter-paintings': 'Paintings',
        'filter-digital': 'Digital Art',
        'filter-sketches': 'Sketches',
        
        'process-title': 'Creative Process',
        'process-subtitle': 'The artistic journey from concept to completion',
        'step1-title': 'Inspiration Capture',
        'step1-desc': 'Observing details in life, collecting inspiration from colors and forms',
        'step2-title': 'Concept Development',
        'step2-desc': 'Transforming abstract ideas into concrete visual concepts',
        'step3-title': 'Creative Realization',
        'step3-desc': 'Using various techniques and media to bring concepts to reality',
        'step4-title': 'Detail Refinement',
        'step4-desc': 'Fine-tuning every detail to achieve perfect presentation',
        
        'contact-title': 'Contact Me',
        'contact-subtitle': 'Let\'s explore the infinite possibilities of art together',
        'contact-email': 'Email',
        'contact-social': 'Social Media',
        'form-name': 'Your Name',
        'form-email': 'Email Address',
        'form-message': 'Your Message...',
        'form-submit': 'Send Message',
        
        'copyright': 'All rights reserved',
        
        'artwork-1-title': 'Abstract Impression',
        'artwork-1-desc': 'Exploring the deep connection between color and emotion, expressing inner feelings through abstract forms.',
        'artwork-2-title': 'Digital Dreams',
        'artwork-2-desc': 'Surrealist works created using digital technology, revealing the boundaries between dreams and reality.',
        'artwork-3-title': 'Portrait Sketches',
        'artwork-3-desc': 'Capturing the spirit and emotional expression of characters through delicate lines.',
        'artwork-4-title': 'Landscape Painting',
        'artwork-4-desc': 'True records of natural scenery, showing the beauty and tranquility of nature.',
        'artwork-5-title': 'Future City',
        'artwork-5-desc': 'Imagination of future urban landscapes, integrating technology and humanistic elements.',
        'artwork-6-title': 'Still Life',
        'artwork-6-desc': 'Artistic expression of everyday objects, exploring the relationship between light and form.',
        
        'modal-medium': 'Medium',
        'modal-size': 'Size',
        'modal-year': 'Year'
    },
    
    // 日本語
    ja: {
        'artist-name': 'リンシリン',
        
        'nav-home': 'ホーム',
        'nav-about': '紹介',
        'nav-gallery': '作品',
        'nav-process': '制作',
        'nav-contact': '連絡',
        
        // テーマ切り替え
        'theme-toggle': 'ダークモード切り替え',
        'theme-light': 'ライトモード',
        'theme-dark': 'ダークモード',
        
        'hero-line1': '創造',
        'hero-line2': 'ユニーク',
        'hero-line3': 'アート',
        'hero-subtitle': '色と形の無限の可能性を探求',
        'cta-button': '作品を見る',
        
        'about-title': 'アーティストについて',
        'about-subtitle': '芸術は見える世界と見えない世界を結ぶ橋です',
        'about-intro': '私は現代アート創作に専念するアーティストで、多様なメディアを通じて人間性、自然、社会の深いつながりを探求することに取り組んでいます。私の作品は伝統的な技法と現代的な概念を融合し、独特な視覚言語で観客との共鳴を希望しています。',
        'stat-artworks': '作品',
        'stat-exhibitions': '展示',
        'stat-experience': '年の経験',
        
        'gallery-title': 'ギャラリー',
        'gallery-subtitle': 'すべての作品は内面世界の投影です',
        'filter-all': 'すべて',
        'filter-paintings': '絵画',
        'filter-digital': 'デジタルアート',
        'filter-sketches': 'スケッチ',
        
        'process-title': '制作過程',
        'process-subtitle': 'コンセプトから完成品までのアートの旅',
        'step1-title': 'インスピレーション捕捉',
        'step1-desc': '生活の細部を観察し、色と形からインスピレーションを収集',
        'step2-title': 'コンセプト構想',
        'step2-desc': '抽象的なアイデアを具体的な視覚コンセプトに変換',
        'step3-title': '創作実現',
        'step3-desc': '様々な技法とメディアを使用してコンセプトを現実化',
        'step4-title': '詳細完善',
        'step4-desc': '細部まで磨き上げ、完璧な表現を実現',
        
        'contact-title': 'お問い合わせ',
        'contact-subtitle': '一緒にアートの無限の可能性を探求しましょう',
        'contact-email': 'メール',
        'contact-social': 'ソーシャルメディア',
        'form-name': 'お名前',
        'form-email': 'メールアドレス',
        'form-message': 'メッセージ...',
        'form-submit': 'メッセージを送る',
        
        'copyright': '全著作権所有',
        
        'artwork-1-title': '抽象印象',
        'artwork-1-desc': '色と感情の深いつながりを探求し、抽象的な形で内面の感情を表現。',
        'artwork-2-title': 'デジタル夢境',
        'artwork-2-desc': 'デジタル技術で創造したシュールレアリズム作品、夢と現実の境界を表現。',
        'artwork-3-title': '人物スケッチ',
        'artwork-3-desc': '繊細な線で人物の神韻と感情表現を捉える。',
        'artwork-4-title': '風景写生',
        'artwork-4-desc': '自然風光の真実な記録、自然の美しさと静寂を表現。',
        'artwork-5-title': '未来都市',
        'artwork-5-desc': '未来都市景観への想像、科学技術と人文要素の融合。',
        'artwork-6-title': '静物組合',
        'artwork-6-desc': '日常物品の芸術的表現、光と影と形の関係を探求。',
        
        'modal-medium': '媒体',
        'modal-size': 'サイズ',
        'modal-year': '年'
    };
}

// 国际化语言资源
const i18n = getI18nData();

// 当前语言
let currentLanguage = 'zh';

// 切换语言函数 - 彻底修复版
function switchLanguage(lang) {
    console.log('🌐 [语言切换] 开始切换语言到:', lang);
    currentLanguage = lang;
    window.currentLanguage = lang; // 将当前语言存储在全局变量中
    
    // 检查多语言数据是否加载
    if (!i18n || !i18n[lang]) {
        console.error('❌ [语言切换] 多语言数据未加载或不支持语言:', lang);
        console.log('可用语言:', Object.keys(i18n || {}));
        return;
    }
    
    console.log(`📊 [语言切换] ${lang}语言包含 ${Object.keys(i18n[lang]).length} 个翻译项`);
    
    // 首先清除所有profile保护标记，允许语言切换
    console.log('🧹 [语言切换] 清除所有profile保护标记，允许语言切换');
    document.querySelectorAll('[data-profile-updated="true"]').forEach((element, index) => {
        element.removeAttribute('data-profile-updated');
        console.log(`🧹 [${index}] 清除保护标记:`, element.getAttribute('data-i18n'));
    });
    
    // 更新所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`🔍 [语言切换] 找到 ${elements.length} 个需要翻译的元素`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    elements.forEach((element, index) => {
        const key = element.getAttribute('data-i18n');
        const originalText = element.textContent || element.placeholder;
        
        // 检查是否有自定义个人信息需要保留
        let hasCustomProfile = false;
        const storedProfile = localStorage.getItem('profile_data');
        
        if (storedProfile && (key === 'artist-name' || key === 'about-intro')) {
            const profile = JSON.parse(storedProfile);
            // 只有当个人信息确实不同于默认翻译时才保护
            if ((key === 'artist-name' && profile.name && profile.name !== i18n[lang][key]) ||
                (key === 'about-intro' && profile.bio && profile.bio !== i18n[lang][key])) {
                hasCustomProfile = true;
                console.log(`🛡️ [${index}] 发现自定义个人信息，将在语言切换后重新应用:`, key);
            }
        }
        
        // 特殊处理邮箱
        let hasCustomEmail = false;
        if (element.id === 'contact-email-address' && storedProfile) {
            const profile = JSON.parse(storedProfile);
            if (profile.email && profile.email !== i18n[lang]['contact-email']) {
                hasCustomEmail = true;
                console.log(`🛡️ [${index}] 发现自定义邮箱，将在语言切换后重新应用`);
            }
        }
        
        // 执行翻译更新
        if (i18n[lang] && i18n[lang][key]) {
            const newText = i18n[lang][key];
            
            // 检查元素类型并更新
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = newText;
                console.log(`✅ [${index}] 更新占位符 ${key}: "${originalText}" → "${newText}"`);
            } else {
                element.textContent = newText;
                console.log(`✅ [${index}] 更新文本 ${key}: "${originalText}" → "${newText}"`);
            }
            
            // 标记需要重新应用个人信息的元素
            if (hasCustomProfile || hasCustomEmail) {
                element.setAttribute('data-needs-profile-reapply', 'true');
            }
            
            updatedCount++;
        } else {
            console.warn(`⚠️ [${index}] 未找到翻译 ${key} (${lang})`);
        }
    });
    
    // 统计信息
    console.log(`📊 语言切换统计: 更新了 ${updatedCount} 个元素，跳过了 ${skippedCount} 个元素`);
    
    // 更新所有带有 data-i18n-title 属性的元素的title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    console.log(`🏷️ 更新 ${titleElements.length} 个标题属性`);
    
    titleElements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (i18n[lang] && i18n[lang][key]) {
            element.title = i18n[lang][key];
            console.log(`✅ 更新标题 ${key}: "${i18n[lang][key]}"`);
        }
    });
    
    // 更新语言按钮状态
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log(`🔘 更新 ${langButtons.length} 个语言按钮状态`);
    
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
            console.log(`✅ 激活语言按钮: ${lang}`);
        }
    });
    
    // 更新页面标题
    const titles = {
        zh: '林士林作品集 | LIN SHILIN Portfolio',
        en: 'LIN SHILIN Portfolio | Contemporary Artist',
        ja: 'リンシリン作品集 | 現代アーティスト'
    };
    
    if (titles[lang]) {
        document.title = titles[lang];
        console.log(`📄 更新页面标题: ${titles[lang]}`);
    }
    
    // 更新页面语言属性
    document.documentElement.lang = lang;
    console.log(`🌍 设置页面语言属性: ${lang}`);
    
    // 保存语言偏好到本地存储
    localStorage.setItem('preferredLanguage', lang);
    console.log(`💾 保存语言偏好: ${lang}`);
    
    // 更新作品数据语言
    updateArtworksLanguage(lang);
    
    // 延迟重新应用个人信息（确保语言切换完成后）
    setTimeout(() => {
        console.log('🔄 [语言切换] 开始重新应用个人信息');
        const elementsNeedingReapply = document.querySelectorAll('[data-needs-profile-reapply="true"]');
        
        if (elementsNeedingReapply.length > 0 && storedProfile) {
            const profile = JSON.parse(storedProfile);
            
            elementsNeedingReapply.forEach((element, index) => {
                const key = element.getAttribute('data-i18n');
                let appliedCustomData = false;
                
                if (key === 'artist-name' && profile.name) {
                    element.textContent = profile.name;
                    element.setAttribute('data-profile-updated', 'true');
                    appliedCustomData = true;
                    console.log(`🔄 [${index}] 重新应用自定义艺术家姓名: ${profile.name}`);
                } else if (key === 'about-intro' && profile.bio) {
                    element.textContent = profile.bio;
                    element.setAttribute('data-profile-updated', 'true');
                    appliedCustomData = true;
                    console.log(`🔄 [${index}] 重新应用自定义个人简介 (长度: ${profile.bio.length})`);
                } else if (element.id === 'contact-email-address' && profile.email) {
                    element.textContent = profile.email;
                    element.setAttribute('data-profile-updated', 'true');
                    appliedCustomData = true;
                    console.log(`🔄 [${index}] 重新应用自定义邮箱: ${profile.email}`);
                }
                
                if (appliedCustomData) {
                    element.removeAttribute('data-needs-profile-reapply');
                }
            });
        }
        
        console.log(`🎉 [语言切换] 语言切换完成! 当前语言: ${lang}`);
        console.log(`📊 [语言切换] 统计: 更新了 ${updatedCount} 个元素，跳过了 ${skippedCount} 个元素`);
        console.log('🔍 如果页面文本没有变化，请检查控制台中的详细日志');
    }, 100); // 短暂延迟确保DOM更新完成
}

// 更新作品数据语言
function updateArtworksLanguage(lang) {
    // 如果作品数据已经加载，重新渲染
    if (window.artworks && window.renderArtworks) {
        window.renderArtworks();
    }
}

// 获取翻译文本
function getText(key, lang = currentLanguage) {
    return i18n[lang] && i18n[lang][key] ? i18n[lang][key] : key;
}

// 初始化多语言
function initI18n() {
    // 从本地存储或浏览器语言检测默认语言
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.toLowerCase();
    
    let defaultLang = 'zh';
    if (savedLang) {
        defaultLang = savedLang;
    } else if (browserLang.startsWith('en')) {
        defaultLang = 'en';
    } else if (browserLang.startsWith('ja')) {
        defaultLang = 'ja';
    }
    
    // 设置默认语言
    switchLanguage(defaultLang);
    
    // 绑定语言切换事件
    const bindLanguageEvents = () => {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            // 移除之前的事件监听器（如果存在）
            btn.removeEventListener('click', btn._langHandler);
            
            // 创建新的事件处理器
            btn._langHandler = function() {
                const lang = this.getAttribute('data-lang');
                console.log('切换语言到:', lang);
                switchLanguage(lang);
            };
            
            // 绑定新的事件监听器
            btn.addEventListener('click', btn._langHandler);
        });
    };
    
    // 首次绑定
    bindLanguageEvents();
    
    // 暴露重新绑定函数给全局使用
    window.rebindLanguageEvents = bindLanguageEvents;
    
    // 添加额外的事件绑定确保语言按钮始终有效
    const addFallbackHandlers = () => {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            // 添加多重事件监听确保响应
            const lang = btn.getAttribute('data-lang');
            
            // 移除旧的fallback处理器
            if (btn._fallbackHandler) {
                btn.removeEventListener('click', btn._fallbackHandler);
                btn.removeEventListener('touchstart', btn._fallbackHandler);
            }
            
            // 创建新的fallback处理器
            btn._fallbackHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 [Fallback] 强制语言切换到:', lang);
                switchLanguage(lang);
            };
            
            // 绑定多种事件确保响应
            btn.addEventListener('click', btn._fallbackHandler, { capture: true });
            btn.addEventListener('touchstart', btn._fallbackHandler, { passive: false });
            
            console.log(`🔗 [事件绑定] 为语言按钮 ${lang} 添加强化事件监听器`);
        });
    };
    
    // 立即添加fallback处理器
    addFallbackHandlers();
    
    // 暴露给全局使用
    window.addFallbackLanguageHandlers = addFallbackHandlers;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化i18n...');
    setTimeout(() => {
        console.log('开始初始化i18n系统');
        initI18n();
        
        // 验证初始化结果
        setTimeout(() => {
            const langBtns = document.querySelectorAll('.lang-btn');
            console.log(`找到 ${langBtns.length} 个语言按钮`);
            langBtns.forEach((btn, index) => {
                const lang = btn.getAttribute('data-lang');
                console.log(`语言按钮 ${index + 1}: ${lang}`);
                
                // 验证事件监听器是否正确绑定
                if (btn._langHandler) {
                    console.log(`按钮 ${lang} 事件处理器已绑定`);
                } else {
                    console.warn(`按钮 ${lang} 事件处理器缺失，重新绑定`);
                    btn._langHandler = function() {
                        console.log('手动绑定的语言切换:', lang);
                        switchLanguage(lang);
                    };
                    btn.addEventListener('click', btn._langHandler);
                }
            });
        }, 100);
    }, 50); // 减少延迟，优先初始化i18n，然后由main.js在后面覆盖个人信息
});

// 添加全局函数用于强制重新应用个人信息
window.forceApplyProfileData = function() {
    console.log('强制重新应用个人信息数据');
    
    const storedProfile = localStorage.getItem('profile_data');
    if (!storedProfile) return;
    
    const profile = JSON.parse(storedProfile);
    
    // 强制更新艺术家姓名
    document.querySelectorAll('[data-i18n="artist-name"]').forEach(element => {
        element.textContent = profile.name;
        element.setAttribute('data-profile-updated', 'true');
        console.log('强制更新艺术家姓名:', profile.name);
    });
    
    // 强制更新个人简介
    const aboutIntro = document.querySelector('[data-i18n="about-intro"]');
    if (aboutIntro && profile.bio) {
        aboutIntro.textContent = profile.bio;
        aboutIntro.setAttribute('data-profile-updated', 'true');
        console.log('强制更新个人简介长度:', profile.bio.length);
    }
    
    // 强制更新邮箱
    const emailElement = document.getElementById('contact-email-address');
    if (emailElement && profile.email) {
        emailElement.textContent = profile.email;
        emailElement.setAttribute('data-profile-updated', 'true');
        console.log('强制更新邮箱:', profile.email);
    }
};

// 给main.js提供一个检查函数
window.checkI18nReady = function() {
    return typeof i18n !== 'undefined' && typeof currentLanguage !== 'undefined';
};

// 暴露核心函数到全局作用域，确保其他脚本可以访问
window.switchLanguage = switchLanguage;
window.getText = getText;
window.i18nData = i18n;