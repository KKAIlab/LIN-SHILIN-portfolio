// 认证系统
class AuthManager {
    constructor() {
        this.defaultPassword = 'admin123';
        this.sessionKey = 'admin_session';
        this.passwordKey = 'admin_password';
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24小时
        
        this.initializePassword();
    }
    
    // 初始化密码（首次使用时设置默认密码）
    initializePassword() {
        if (!localStorage.getItem(this.passwordKey)) {
            this.setPassword(this.defaultPassword);
        }
    }
    
    // 密码哈希（简单哈希，实际应用中应使用更安全的方法）
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString(16);
    }
    
    // 设置新密码
    setPassword(newPassword) {
        const hashedPassword = this.hashPassword(newPassword);
        localStorage.setItem(this.passwordKey, hashedPassword);
    }
    
    // 验证密码
    verifyPassword(password) {
        const storedPassword = localStorage.getItem(this.passwordKey);
        const hashedPassword = this.hashPassword(password);
        return storedPassword === hashedPassword;
    }
    
    // 登录
    login(password, remember = false) {
        if (this.verifyPassword(password)) {
            const session = {
                timestamp: Date.now(),
                remember: remember
            };
            
            if (remember) {
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
            } else {
                sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
            }
            
            return true;
        }
        return false;
    }
    
    // 检查是否已登录
    isLoggedIn() {
        const session = this.getSession();
        
        if (!session) {
            return false;
        }
        
        // 检查会话是否过期
        if (Date.now() - session.timestamp > this.sessionTimeout) {
            this.logout();
            return false;
        }
        
        return true;
    }
    
    // 获取会话信息
    getSession() {
        let sessionStr = localStorage.getItem(this.sessionKey) || sessionStorage.getItem(this.sessionKey);
        
        if (!sessionStr) {
            return null;
        }
        
        try {
            return JSON.parse(sessionStr);
        } catch (e) {
            return null;
        }
    }
    
    // 登出
    logout() {
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
    }
    
    // 更新会话时间
    refreshSession() {
        const session = this.getSession();
        if (session) {
            session.timestamp = Date.now();
            if (session.remember) {
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
            } else {
                sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
            }
        }
    }
    
    // 重定向到登录页面
    redirectToLogin() {
        window.location.href = './login.html';
    }
    
    // 重定向到管理页面
    redirectToDashboard() {
        window.location.href = './dashboard.html';
    }
    
    // 页面加载时检查认证状态
    checkAuthOnLoad() {
        if (window.location.pathname.includes('dashboard.html')) {
            // 管理页面：检查是否已登录
            if (!this.isLoggedIn()) {
                this.redirectToLogin();
                return false;
            }
            this.refreshSession();
        } else if (window.location.pathname.includes('login.html')) {
            // 登录页面：如果已登录则跳转到管理页面
            if (this.isLoggedIn()) {
                this.redirectToDashboard();
                return false;
            }
        }
        return true;
    }
}

// 创建全局认证管理器实例
const authManager = new AuthManager();

// 页面加载时检查认证状态
document.addEventListener('DOMContentLoaded', function() {
    authManager.checkAuthOnLoad();
});