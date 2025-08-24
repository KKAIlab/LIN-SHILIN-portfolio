// 实时调试和错误检测系统
class DebugMonitor {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
        this.isEnabled = true;
        this.errorCount = 0;
        this.warningCount = 0;
        this.enableConsole = true; // 是否在控制台显示调试信息
        
        this.init();
    }
    
    init() {
        console.log('🔍 [调试监控] 启动实时调试和错误检测系统...');
        
        // 监听所有JavaScript错误
        this.setupErrorHandlers();
        
        // 监听DOM变化
        this.setupDOMObserver();
        
        // 监听语言切换状态
        this.setupLanguageMonitor();
        
        // 监听localStorage变化
        this.setupStorageMonitor();
        
        // 启动性能监控
        this.setupPerformanceMonitor();
        
        // 创建调试面板（可选）
        this.createDebugPanel();
        
        console.log('✅ [调试监控] 调试监控系统已启动');
    }
    
    log(message, type = 'info', category = 'general') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message,
            type,
            category,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(logEntry);
        
        // 保持日志数量在限制内
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // 更新计数器
        if (type === 'error') this.errorCount++;
        if (type === 'warning') this.warningCount++;
        
        // 在控制台输出
        if (this.enableConsole) {
            const emoji = this.getEmojiForType(type);
            const prefix = `${emoji} [${category.toUpperCase()}]`;
            
            switch (type) {
                case 'error':
                    console.error(`${prefix} ${message}`);
                    break;
                case 'warning':
                    console.warn(`${prefix} ${message}`);
                    break;
                case 'success':
                    console.log(`%c${prefix} ${message}`, 'color: #28a745; font-weight: bold;');
                    break;
                default:
                    console.log(`${prefix} ${message}`);
            }
        }
        
        // 更新调试面板
        this.updateDebugPanel();
        
        // 严重错误时显示用户通知
        if (type === 'error' && category === 'critical') {
            this.showUserNotification(message, 'error');
        }
    }
    
    getEmojiForType(type) {
        const emojiMap = {
            'error': '❌',
            'warning': '⚠️',
            'success': '✅',
            'info': 'ℹ️',
            'debug': '🐛'
        };
        return emojiMap[type] || 'ℹ️';
    }
    
    setupErrorHandlers() {
        // 全局错误处理
        window.addEventListener('error', (e) => {
            this.log(
                `JavaScript错误: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`,
                'error',
                'javascript'
            );
        });
        
        // Promise rejection处理
        window.addEventListener('unhandledrejection', (e) => {
            this.log(
                `未处理的Promise rejection: ${e.reason}`,
                'error',
                'promise'
            );
        });
        
        // 资源加载错误
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.log(
                    `资源加载失败: ${e.target.src || e.target.href}`,
                    'error',
                    'resource'
                );
            }
        }, true);
    }
    
    setupDOMObserver() {
        // 监听DOM变化以检测潜在问题
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查是否有重要元素被移除
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否移除了重要的语言元素
                            if (node.querySelector && node.querySelector('[data-i18n]')) {
                                this.log(
                                    `重要的多语言元素被移除: ${node.tagName}`,
                                    'warning',
                                    'dom'
                                );
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        this.log('DOM观察器已启动', 'success', 'dom');
    }
    
    setupLanguageMonitor() {
        // 监听语言切换事件
        let lastLanguage = window.currentLanguage || 'zh';
        
        // 定期检查语言状态
        setInterval(() => {
            const currentLang = window.currentLanguage || 'zh';
            const activeButton = document.querySelector('.lang-btn.active');
            const activeLang = activeButton ? activeButton.getAttribute('data-lang') : null;
            
            // 检查语言状态一致性
            if (activeLang && activeLang !== currentLang) {
                this.log(
                    `语言状态不一致: 按钮显示${activeLang}，系统记录${currentLang}`,
                    'warning',
                    'language'
                );
            }
            
            // 检查语言是否变化
            if (currentLang !== lastLanguage) {
                this.log(
                    `语言已切换: ${lastLanguage} → ${currentLang}`,
                    'success',
                    'language'
                );
                lastLanguage = currentLang;
                
                // 验证翻译是否正确应用
                setTimeout(() => {
                    this.validateTranslations(currentLang);
                }, 500);
            }
        }, 2000);
        
        this.log('语言监控器已启动', 'success', 'language');
    }
    
    validateTranslations(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        let validCount = 0;
        let invalidCount = 0;
        
        elements.forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const currentText = element.textContent.trim();
            
            // 检查是否为空文本
            if (!currentText) {
                this.log(
                    `翻译元素为空: ${key}`,
                    'warning',
                    'translation'
                );
                invalidCount++;
            } else if (currentText === key) {
                // 文本与key相同，可能翻译失败
                this.log(
                    `翻译可能失败: ${key}`,
                    'warning',
                    'translation'
                );
                invalidCount++;
            } else {
                validCount++;
            }
        });
        
        this.log(
            `翻译验证完成: ${validCount}个有效，${invalidCount}个异常`,
            invalidCount > 0 ? 'warning' : 'success',
            'translation'
        );
    }
    
    setupStorageMonitor() {
        // 监听localStorage变化
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            this.log(
                `LocalStorage更新: ${key}`,
                'info',
                'storage'
            );
            originalSetItem.apply(localStorage, arguments);
        };
        
        this.log('存储监控器已启动', 'success', 'storage');
    }
    
    setupPerformanceMonitor() {
        // 监听页面性能
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                
                this.log(
                    `页面加载完成，用时: ${loadTime.toFixed(2)}ms`,
                    loadTime > 3000 ? 'warning' : 'success',
                    'performance'
                );
            }, 100);
        });
        
        this.log('性能监控器已启动', 'success', 'performance');
    }
    
    createDebugPanel() {
        // 创建浮动调试面板
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 8px;
            z-index: 10000;
            display: none;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>🔍 调试面板</strong>
                <button id="debug-close" style="background: #ff4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 10px;">×</button>
            </div>
            <div id="debug-stats" style="margin-bottom: 10px; font-size: 10px;">
                <div>错误: <span id="error-count">0</span></div>
                <div>警告: <span id="warning-count">0</span></div>
                <div>语言: <span id="current-lang">zh</span></div>
            </div>
            <div id="debug-logs" style="max-height: 300px; overflow-y: auto;"></div>
        `;
        
        document.body.appendChild(panel);
        
        // 绑定关闭按钮
        document.getElementById('debug-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        // 双击右上角显示/隐藏面板
        let clickCount = 0;
        document.addEventListener('click', (e) => {
            if (e.clientX > window.innerWidth - 100 && e.clientY < 100) {
                clickCount++;
                setTimeout(() => {
                    if (clickCount === 2) {
                        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    }
                    clickCount = 0;
                }, 300);
            }
        });
        
        this.debugPanel = panel;
        this.log('调试面板已创建，双击右上角显示/隐藏', 'success', 'debug');
    }
    
    updateDebugPanel() {
        if (!this.debugPanel) return;
        
        // 更新统计信息
        const errorCountEl = document.getElementById('error-count');
        const warningCountEl = document.getElementById('warning-count');
        const currentLangEl = document.getElementById('current-lang');
        
        if (errorCountEl) errorCountEl.textContent = this.errorCount;
        if (warningCountEl) warningCountEl.textContent = this.warningCount;
        if (currentLangEl) currentLangEl.textContent = window.currentLanguage || 'zh';
        
        // 更新日志
        const logsEl = document.getElementById('debug-logs');
        if (logsEl) {
            const recentLogs = this.logs.slice(-20); // 只显示最近20条
            logsEl.innerHTML = recentLogs.map(log => {
                const color = this.getColorForType(log.type);
                return `<div style="color: ${color}; margin: 2px 0; font-size: 10px;">
                    [${log.timestamp}] [${log.category}] ${log.message}
                </div>`;
            }).join('');
            logsEl.scrollTop = logsEl.scrollHeight;
        }
    }
    
    getColorForType(type) {
        const colorMap = {
            'error': '#ff4444',
            'warning': '#ffaa44',
            'success': '#44ff44',
            'info': '#4444ff',
            'debug': '#888888'
        };
        return colorMap[type] || '#ffffff';
    }
    
    showUserNotification(message, type = 'info') {
        // 创建用户友好的通知
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? '#ff4444' : '#44aa44';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10001;
            font-size: 14px;
            max-width: 300px;
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
    
    // 测试函数
    testLanguageSwitch(lang) {
        this.log(`测试语言切换到: ${lang}`, 'info', 'test');
        
        if (window.switchLanguage) {
            window.switchLanguage(lang);
            
            // 验证切换结果
            setTimeout(() => {
                const currentLang = window.currentLanguage;
                if (currentLang === lang) {
                    this.log(`语言切换测试成功: ${lang}`, 'success', 'test');
                } else {
                    this.log(`语言切换测试失败: 期望${lang}，实际${currentLang}`, 'error', 'test');
                }
            }, 1000);
        } else {
            this.log('switchLanguage函数未找到', 'error', 'test');
        }
    }
    
    // 获取调试报告
    getDebugReport() {
        return {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            errorCount: this.errorCount,
            warningCount: this.warningCount,
            currentLanguage: window.currentLanguage,
            logs: this.logs.slice(-50), // 最近50条日志
            localStorage: {
                profile_data: localStorage.getItem('profile_data') ? '存在' : '不存在',
                artworks_data: localStorage.getItem('artworks_data') ? '存在' : '不存在',
                i18n_data: localStorage.getItem('i18n_data') ? '存在' : '不存在',
                preferredLanguage: localStorage.getItem('preferredLanguage')
            }
        };
    }
    
    // 导出调试报告
    exportReport() {
        const report = this.getDebugReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-report-${new Date().toISOString().slice(0, 19)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.log('调试报告已导出', 'success', 'debug');
    }
}

// 创建全局调试监控实例
window.debugMonitor = new DebugMonitor();

// 添加全局快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+D 显示/隐藏调试面板
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    // Ctrl+Shift+E 导出调试报告
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        window.debugMonitor.exportReport();
    }
});

// 添加到页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    window.debugMonitor.log('页面DOM加载完成', 'success', 'init');
    
    // 验证关键组件是否加载
    setTimeout(() => {
        const checks = [
            { name: 'i18n系统', condition: typeof window.switchLanguage === 'function' },
            { name: '语言按钮', condition: document.querySelectorAll('.lang-btn').length > 0 },
            { name: '多语言元素', condition: document.querySelectorAll('[data-i18n]').length > 0 }
        ];
        
        checks.forEach(check => {
            window.debugMonitor.log(
                `${check.name}: ${check.condition ? '✓ 已加载' : '✗ 未找到'}`,
                check.condition ? 'success' : 'warning',
                'init'
            );
        });
    }, 1000);
});

console.log('🔍 [调试系统] debug-monitor.js 已加载完成');