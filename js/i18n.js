// 统一的多语言系统 - 最终版本
console.log('🌐 开始加载多语言系统...');

// 多语言数据
const i18n = {
    zh: {
        'artist-name': '林士林',
        'nav-home': '首页',
        'nav-about': '关于',
        'nav-gallery': '作品',
        'nav-process': '创作',
        'nav-contact': '联系',
        'hero-line1': '观物',
        'hero-line2': '造境',
        'hero-line3': '写心',
        'hero-subtitle': '在光影与留白之间，寻找内心的风景',
        'japanese-philosophy': '侘寂 · 物哀 · 幽玄',
        'cta-button': '欣赏作品',
        'about-title': '关于艺术家',
        'about-subtitle': '在传统与当代之间的诗意对话',
        'about-intro': '我是一位专注于当代艺术创作的艺术家，致力于通过多样化的媒介探索人性、自然与社会的深层联系。我的作品融合了传统技法与现代理念，希望通过独特的视觉语言与观众产生共鸣。',
        'philosophy-pottery': '留白之美',
        'philosophy-wagashi': '质感肌理',
        'philosophy-ikebana': '光影诗意',
        'stat-artworks': '作品',
        'stat-exhibitions': '展览',
        'stat-experience': '年经验',
        'gallery-title': '作品集',
        'gallery-subtitle': '每一件作品，都是一次凝视与回应',
        'filter-all': '全部',
        'filter-paintings': '绘画',
        'filter-digital': '数字艺术',
        'filter-sketches': '素描',
        'process-title': '创作过程',
        'process-subtitle': '从凝视到落笔，一段缓慢而诚实的旅程',
        'step1-title': '观察与收集',
        'step1-desc': '在日常的光影与细节中驻足，收集形态、色彩与情绪的种子',
        'step2-title': '构思与草图',
        'step2-desc': '让抽象的感受沉淀成形，在反复的草图中寻找恰当的视觉语言',
        'step3-title': '落笔与实验',
        'step3-desc': '运用不同的技法与媒介大胆尝试，允许偶然与不完美发生',
        'step4-title': '沉淀与完成',
        'step4-desc': '放下再拾起，反复审视与打磨，直到作品能够安静地自己说话',
        'contact-title': '联系我',
        'contact-subtitle': '让我们一起探讨艺术的无限可能',
        'contact-email': '邮箱',
        'contact-social': '社交媒体',
        'form-name': '您的姓名',
        'form-email': '邮箱地址',
        'form-message': '想说的话...',
        'form-submit': '发送消息',
        'copyright': '版权所有',
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
        'modal-medium': '媒介',
        'modal-size': '尺寸',
        'modal-year': '年份'
    },
    en: {
        'artist-name': 'LIN SHILIN',
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-gallery': 'Gallery',
        'nav-process': 'Process',
        'nav-contact': 'Contact',
        'hero-line1': 'To See',
        'hero-line2': 'To Shape',
        'hero-line3': 'To Feel',
        'hero-subtitle': 'Seeking the inner landscape, between light and empty space',
        'japanese-philosophy': 'Wabi-sabi · Mono no aware · Yūgen',
        'cta-button': 'View Works',
        'about-title': 'About the Artist',
        'about-subtitle': 'A poetic dialogue between tradition and the contemporary',
        'philosophy-pottery': 'Negative Space',
        'philosophy-wagashi': 'Texture',
        'philosophy-ikebana': 'Light & Shadow',
        'about-intro': 'I am an artist dedicated to contemporary art creation, committed to exploring the deep connections between humanity, nature, and society through diverse media. My works blend traditional techniques with modern concepts, hoping to resonate with audiences through unique visual language.',
        'stat-artworks': 'Artworks',
        'stat-exhibitions': 'Exhibitions',
        'stat-experience': 'Years Experience',
        'gallery-title': 'Gallery',
        'gallery-subtitle': 'Each work is an act of gazing, and of response',
        'filter-all': 'All',
        'filter-paintings': 'Paintings',
        'filter-digital': 'Digital Art',
        'filter-sketches': 'Sketches',
        'process-title': 'Creative Process',
        'process-subtitle': 'From gazing to the first stroke — a slow and honest journey',
        'step1-title': 'Observe & Gather',
        'step1-desc': 'Pausing amid everyday light and detail, collecting seeds of form, color and feeling',
        'step2-title': 'Conceive & Sketch',
        'step2-desc': 'Letting vague feelings settle into shape, searching for the right visual language through sketches',
        'step3-title': 'Make & Experiment',
        'step3-desc': 'Working boldly across techniques and media, allowing chance and imperfection to happen',
        'step4-title': 'Refine & Complete',
        'step4-desc': 'Setting the work aside and returning to it, until it can quietly speak for itself',
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
    ja: {
        'artist-name': 'リンシリン',
        'nav-home': 'ホーム',
        'nav-about': '紹介',
        'nav-gallery': '作品',
        'nav-process': '制作',
        'nav-contact': '連絡',
        'hero-line1': '観る',
        'hero-line2': '造る',
        'hero-line3': '写す',
        'hero-subtitle': '光と余白のあいだに、心の風景を探す',
        'japanese-philosophy': '侘寂 · 物哀 · 幽玄',
        'cta-button': '作品を見る',
        'about-title': 'アーティストについて',
        'about-subtitle': '伝統と現代のあいだの詩的な対話',
        'philosophy-pottery': '余白の美',
        'philosophy-wagashi': '質感',
        'philosophy-ikebana': '光と影',
        'about-intro': '私は現代アート創作に専念するアーティストで、多様なメディアを通じて人間性、自然、社会の深いつながりを探求することに取り組んでいます。私の作品は伝統的な技法と現代的な概念を融合し、独特な視覚言語で観客との共鳴を希望しています。',
        'stat-artworks': '作品',
        'stat-exhibitions': '展示',
        'stat-experience': '年の経験',
        'gallery-title': 'ギャラリー',
        'gallery-subtitle': 'ひとつひとつの作品は、見つめることへの応答',
        'filter-all': 'すべて',
        'filter-paintings': '絵画',
        'filter-digital': 'デジタルアート',
        'filter-sketches': 'スケッチ',
        'process-title': '制作過程',
        'process-subtitle': '見つめることから筆を執るまで、ゆっくりと誠実な旅',
        'step1-title': '観察と収集',
        'step1-desc': '日常の光と細部に足を止め、形・色・感情の種を集める',
        'step2-title': '構想とスケッチ',
        'step2-desc': '漠然とした感覚を形に沈殿させ、スケッチを重ねてふさわしい視覚言語を探す',
        'step3-title': '制作と実験',
        'step3-desc': '様々な技法とメディアで大胆に試み、偶然と不完全さを受け入れる',
        'step4-title': '推敲と完成',
        'step4-desc': '距離を置いてはまた向き合い、作品が静かに語り出すまで磨き上げる',
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
    }
};

// 当前语言状态
let currentLanguage = 'zh';

// 获取多语言数据（UI界面文本；作品和个人信息文本在 data/site-data.js 中）
function getI18nData() {
    return i18n;
}

// 获取文本
function getText(key, lang = currentLanguage) {
    return i18n[lang] && i18n[lang][key] ? i18n[lang][key] : key;
}

// 主要语言切换函数 - 增强错误处理版本
function switchLanguage(lang) {
    console.log(`🌐 切换语言到: ${lang}`);
    
    try {
        // 验证语言参数
        if (!lang || typeof lang !== 'string') {
            console.error('❌ 语言参数无效:', lang);
            return false;
        }
        
        if (!['zh', 'en', 'ja'].includes(lang)) {
            console.error('❌ 不支持的语言:', lang);
            return false;
        }
        
        // 防止重复切换
        if (currentLanguage === lang) {
            console.log('✅ 已经是当前语言');
            return true;
        }
        
        // 更新状态
        currentLanguage = lang;
        window.currentLanguage = lang;
        
        // 获取个人信息数据
        const profileData = getProfileData();
        
        // 更新所有多语言元素
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`🔍 找到 ${elements.length} 个多语言元素`);
        
        let successCount = 0;
        let errorCount = 0;
        
        elements.forEach((element, index) => {
            try {
                const key = element.getAttribute('data-i18n');
                if (!key) {
                    console.warn(`⚠️ 元素 ${index} 缺少data-i18n属性`);
                    errorCount++;
                    return;
                }
                
                let newText = getText(key, lang);
                
                // 检查是否需要使用个人信息覆盖
                if (profileData) {
                    if (key === 'artist-name' && profileData.name) {
                        newText = profileData.name;
                    } else if (key === 'about-intro' && profileData.bio) {
                        newText = profileData.bio;
                    }
                }
                
                // 安全地更新元素内容
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = newText;
                } else {
                    element.textContent = newText;
                }
                
                successCount++;
            } catch (error) {
                console.error(`❌ 更新元素 ${index} 失败:`, error);
                errorCount++;
            }
        });
        
        console.log(`📊 更新结果: 成功 ${successCount}, 失败 ${errorCount}`);
        
        // 安全地更新邮箱
        try {
            const emailElement = document.getElementById('contact-email-address');
            if (emailElement && profileData && profileData.email) {
                emailElement.textContent = profileData.email;
            }
        } catch (error) {
            console.warn('⚠️ 更新邮箱失败:', error);
        }
        
        // 安全地更新语言按钮状态
        try {
            updateLanguageButtonStates(lang);
        } catch (error) {
            console.warn('⚠️ 更新按钮状态失败:', error);
        }
        
        // 安全地更新页面元数据
        try {
            updatePageMetadata(lang);
        } catch (error) {
            console.warn('⚠️ 更新页面元数据失败:', error);
        }
        
        // 安全地保存语言偏好
        try {
            if (typeof Storage !== 'undefined' && localStorage) {
                localStorage.setItem('preferredLanguage', lang);
            } else {
                console.warn('⚠️ localStorage不可用，无法保存语言偏好');
            }
        } catch (error) {
            console.warn('⚠️ 保存语言偏好失败:', error);
        }
        
        // 安全地更新作品展示语言
        try {
            if (window.renderArtworks && typeof window.renderArtworks === 'function') {
                setTimeout(() => window.renderArtworks(), 100);
            }
        } catch (error) {
            console.warn('⚠️ 更新作品展示语言失败:', error);
        }
        
        console.log(`✅ 语言切换完成: ${lang}`);
        
        // 触发语言切换事件
        try {
            const event = new CustomEvent('languageChanged', { 
                detail: { language: lang, profile: profileData } 
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.warn('⚠️ 触发语言切换事件失败:', error);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ 语言切换过程中发生严重错误:', error);
        return false;
    }
}

// 安全的语言按钮状态更新
function updateLanguageButtonStates(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        try {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        } catch (error) {
            console.warn('⚠️ 更新按钮状态失败:', error);
        }
    });
}

// 获取个人信息数据（来自 data/site-data.js，按当前语言解析多语言字段）
function getProfileData() {
    try {
        const siteData = window.SITE_DATA;
        if (!siteData || !siteData.profile) {
            return null;
        }
        const profile = siteData.profile;
        const pick = (value) => {
            if (value == null) return '';
            if (typeof value === 'string') return value;
            return value[currentLanguage] || value.zh || value.en || value.ja || '';
        };
        return {
            name: pick(profile.name),
            bio: pick(profile.bio),
            email: profile.email || ''
        };
    } catch (error) {
        console.warn('⚠️ 获取个人信息数据失败:', error);
        return null;
    }
}

// 更新页面元数据
function updatePageMetadata(lang) {
    const titles = {
        zh: '林士林作品集 | LIN SHILIN Portfolio',
        en: 'LIN SHILIN Portfolio | Contemporary Artist',
        ja: 'リンシリン作品集 | 現代アーティスト'
    };
    
    if (titles[lang]) {
        document.title = titles[lang];
    }
    
    document.documentElement.lang = lang;
}

// 初始化多语言系统
function initI18n() {
    console.log('🚀 初始化多语言系统...');
    
    // 更新多语言数据（合并localStorage数据）
    getI18nData();
    
    // 确定默认语言
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.toLowerCase();
    
    let defaultLang = 'zh';
    if (savedLang && ['zh', 'en', 'ja'].includes(savedLang)) {
        defaultLang = savedLang;
    } else if (browserLang.startsWith('en')) {
        defaultLang = 'en';
    } else if (browserLang.startsWith('ja')) {
        defaultLang = 'ja';
    }
    
    console.log(`🌍 检测到默认语言: ${defaultLang}`);
    
    // 绑定语言切换按钮事件
    bindLanguageButtons();
    
    // 应用默认语言
    switchLanguage(defaultLang);
    
    console.log('✅ 多语言系统初始化完成');
}

// 安全绑定语言切换按钮事件
function bindLanguageButtons() {
    try {
        const langButtons = document.querySelectorAll('.lang-btn');
        console.log(`🔘 绑定 ${langButtons.length} 个语言按钮事件`);
        
        if (langButtons.length === 0) {
            console.warn('⚠️ 没有找到语言按钮，延迟重试...');
            setTimeout(bindLanguageButtons, 500);
            return;
        }
        
        langButtons.forEach((button, index) => {
            try {
                const lang = button.getAttribute('data-lang');
                if (!lang) {
                    console.warn(`⚠️ 按钮 ${index} 缺少data-lang属性`);
                    return;
                }
                
                // 检查是否已经绑定过事件
                if (button.getAttribute('data-bound') === 'true') {
                    console.log(`⚠️ 按钮 ${lang} 已经绑定过事件，跳过`);
                    return;
                }
                
                // 添加事件监听器
                button.addEventListener('click', function(e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🖱️ 用户点击语言按钮: ${lang}`);
                        
                        // 立即更新按钮视觉状态
                        document.querySelectorAll('.lang-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // 执行语言切换
                        const result = switchLanguage(lang);
                        if (!result) {
                            console.error(`❌ 语言切换失败: ${lang}`);
                        }
                    } catch (error) {
                        console.error(`❌ 语言按钮点击处理失败:`, error);
                    }
                });
                
                // 标记已绑定
                button.setAttribute('data-bound', 'true');
                console.log(`✅ 成功绑定语言按钮: ${lang}`);
            } catch (error) {
                console.error(`❌ 绑定按钮 ${index} 失败:`, error);
            }
        });
        
        console.log('✅ 语言按钮事件绑定完成');
    } catch (error) {
        console.error('❌ 绑定语言按钮事件时发生错误:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM加载完成，准备初始化多语言系统');
    
    try {
        // 检查基本环境
        if (typeof document === 'undefined') {
            console.error('❌ document对象不可用');
            return;
        }
        
        // 立即初始化，不延迟
        initI18n();
        
        // 确保按钮事件绑定成功，添加备用机制
        setTimeout(() => {
            console.log('🔄 检查语言按钮绑定状态...');
            const langButtons = document.querySelectorAll('.lang-btn');
            let hasClickHandler = false;
            
            langButtons.forEach(button => {
                // 检查是否已有点击事件处理器
                const hasHandler = button.onclick !== null || button.getAttribute('data-bound') === 'true';
                if (hasHandler) {
                    hasClickHandler = true;
                }
            });
            
            if (!hasClickHandler && langButtons.length > 0) {
                console.warn('⚠️ 语言按钮事件可能未正确绑定，重试绑定...');
                bindLanguageButtons();
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ 初始化多语言系统时发生错误:', error);
    }
});

// 导出全局变量和函数
window.i18n = i18n;
window.i18nData = i18n;  // 兼容性
window.switchLanguage = switchLanguage;
window.getText = getText;
window.getI18nData = getI18nData;

console.log('🌐 多语言系统模块加载完成');