// 管理员后台主题管理器
class AdminThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeKey = 'admin-preferred-theme';
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
        const themeToggle = document.getElementById('admin-theme-toggle');
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
        
        console.log(`管理员主题已切换到: ${newTheme}`);
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
        document.documentElement.classList.add('admin-theme-transition');
        
        // 移除过渡类（避免影响其他动画）
        setTimeout(() => {
            document.documentElement.classList.remove('admin-theme-transition');
        }, 300);
    }
    
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const color = theme === 'dark' ? '#2d3748' : '#ffffff';
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            // 如果不存在，创建meta标签
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = color;
            document.head.appendChild(meta);
        }
    }
    
    dispatchThemeEvent(theme) {
        const event = new CustomEvent('adminThemeChanged', {
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

// 初始化管理员主题管理器
let adminThemeManager = null;

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    adminThemeManager = new AdminThemeManager();
});

// 监听主题切换事件
document.addEventListener('adminThemeChanged', (e) => {
    const theme = e.detail.theme;
    console.log(`管理员主题切换事件触发: ${theme}`);
    
    // 这里可以添加特殊元素的主题切换处理
    // 例如：更新图标、图片等
});

// 添加主题切换过渡动画的CSS
const adminThemeTransitionCSS = `
.admin-theme-transition,
.admin-theme-transition *,
.admin-theme-transition *:before,
.admin-theme-transition *:after {
    transition: all 300ms !important;
    transition-delay: 0 !important;
}
`;

// 动态添加过渡样式
const adminThemeStyle = document.createElement('style');
adminThemeStyle.textContent = adminThemeTransitionCSS;
document.head.appendChild(adminThemeStyle);