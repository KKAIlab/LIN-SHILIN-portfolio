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
        'hero-line1': '泥与火',
        'hero-line2': '之间',
        'hero-line3': '陶艺',
        'hero-subtitle': '在侘寂美学中寻找不完美的完美',
        'japanese-philosophy': '侘寂 • 物哀 • 幽玄',
        'cta-button': '欣赏作品',
        'about-title': '关于陶艺家',
        'about-subtitle': '泥土与火焰间的诗意对话',
        'about-intro': '专注于陶瓷艺术创作的匠人，深受日式侘寂美学影响。我的作品融合传统陶艺技法与现代设计理念，在泥土与火焰的对话中寻找自然之美。每一件作品都承载着对不完美之完美的理解，体现着时间流逝的痕迹与手工艺的温度。',
        'philosophy-pottery': '陶艺技法',
        'philosophy-wagashi': '和果子美学',
        'philosophy-ikebana': '花道精神',
        'stat-artworks': '作品',
        'stat-exhibitions': '展览',
        'stat-experience': '年经验',
        'gallery-title': '陶艺作品集',
        'gallery-subtitle': '每一件作品都承载着泥与火的对话',
        'filter-all': '全部',
        'filter-paintings': '茶器',
        'filter-digital': '花器',
        'filter-sketches': '餐具',
        'process-title': '陶艺工艺',
        'process-subtitle': '从泥土到器皿的生命之旅',
        'step1-title': '选泥练泥',
        'step1-desc': '精选优质陶土，反复揉练去除气泡',
        'step2-title': '塑形拉坯',
        'step2-desc': '在陶轮上用双手塑造器皿的形态',
        'step3-title': '修坯装饰',
        'step3-desc': '精心修整器形，添加纹饰与釉色',
        'step4-title': '烧制成器',
        'step4-desc': '历经窑火淬炼，完成泥与火的蜕变',
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
    ja: {
        'artist-name': 'リンシリン',
        'nav-home': 'ホーム',
        'nav-about': '紹介',
        'nav-gallery': '作品',
        'nav-process': '制作',
        'nav-contact': '連絡',
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