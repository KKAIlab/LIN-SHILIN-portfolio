// 最简单的语言切换修复
console.log('🔧 简单语言切换修复脚本已加载');

// 等待所有脚本加载完毕
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🔧 开始应用简单修复...');
        
        // 强制重新绑定语言按钮
        const langButtons = document.querySelectorAll('.lang-btn');
        console.log(`找到 ${langButtons.length} 个语言按钮`);
        
        langButtons.forEach((btn, index) => {
            const lang = btn.getAttribute('data-lang');
            console.log(`绑定语言按钮 ${index}: ${lang}`);
            
            // 移除所有现有的事件监听器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // 添加简单的点击事件
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🚀 [简单修复] 语言按钮被点击: ${lang}`);
                
                // 立即更新按钮状态
                document.querySelectorAll('.lang-btn').forEach(b => {
                    b.classList.remove('active');
                });
                newBtn.classList.add('active');
                
                // 立即执行语言切换
                forceLanguageSwitch(lang);
            });
        });
        
        console.log('✅ 简单修复应用完成');
    }, 2000); // 2秒延迟确保其他脚本已加载
});

function forceLanguageSwitch(targetLang) {
    console.log(`🌐 [强制切换] 开始切换到 ${targetLang}`);
    
    // 获取多语言数据
    let i18nData = null;
    if (window.i18nData) {
        i18nData = window.i18nData;
    } else if (window.i18n) {
        i18nData = window.i18n;
    } else if (typeof getI18nData === 'function') {
        i18nData = getI18nData();
    }
    
    if (!i18nData || !i18nData[targetLang]) {
        console.error(`❌ [强制切换] 未找到 ${targetLang} 的翻译数据`);
        console.log('可用的全局变量:', Object.keys(window).filter(k => k.includes('i18n')));
        
        // 尝试手动创建基本翻译数据
        i18nData = createBasicTranslations();
    }
    
    console.log(`📚 [强制切换] 使用翻译数据，${targetLang} 包含 ${Object.keys(i18nData[targetLang] || {}).length} 个翻译`);
    
    // 清除所有保护标记
    document.querySelectorAll('[data-profile-updated]').forEach(el => {
        el.removeAttribute('data-profile-updated');
    });
    
    // 强制更新所有多语言元素
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`🔍 [强制切换] 找到 ${elements.length} 个需要翻译的元素`);
    
    let successCount = 0;
    let failCount = 0;
    
    elements.forEach((element, index) => {
        const key = element.getAttribute('data-i18n');
        const originalText = element.textContent;
        
        if (i18nData[targetLang] && i18nData[targetLang][key]) {
            const newText = i18nData[targetLang][key];
            
            // 直接更新文本内容
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = newText;
            } else {
                element.textContent = newText;
            }
            
            console.log(`✅ [${index}] ${key}: "${originalText}" → "${newText}"`);
            successCount++;
        } else {
            console.warn(`⚠️ [${index}] 未找到翻译: ${key}`);
            failCount++;
        }
    });
    
    // 更新全局状态
    window.currentLanguage = targetLang;
    localStorage.setItem('preferredLanguage', targetLang);
    document.documentElement.lang = targetLang;
    
    // 更新页面标题
    const titles = {
        zh: '林士林作品集 | LIN SHILIN Portfolio',
        en: 'LIN SHILIN Portfolio | Contemporary Artist',
        ja: 'リンシリン作品集 | 現代アーティスト'
    };
    if (titles[targetLang]) {
        document.title = titles[targetLang];
    }
    
    console.log(`🎉 [强制切换] 语言切换完成！成功: ${successCount}, 失败: ${failCount}`);
    
    // 显示用户提示
    showSwitchNotification(`语言已切换到 ${getLanguageName(targetLang)}`);
}

function createBasicTranslations() {
    return {
        zh: {
            'artist-name': '林士林',
            'nav-home': '首页',
            'nav-about': '关于',
            'nav-gallery': '作品',
            'nav-process': '创作',
            'nav-contact': '联系',
            'hero-line1': '创造',
            'hero-line2': '独特',
            'hero-line3': '艺术',
            'hero-subtitle': '探索色彩与形态的无限可能',
            'cta-button': '查看作品'
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
            'cta-button': 'View Works'
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
            'cta-button': '作品を見る'
        }
    };
}

function getLanguageName(lang) {
    const names = {
        zh: '中文',
        en: 'English',
        ja: '日本語'
    };
    return names[lang] || lang;
}

function showSwitchNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #28a745;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10001;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 3000);
}

console.log('🔧 简单语言切换修复脚本准备就绪');