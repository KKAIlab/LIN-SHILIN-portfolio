// 登录页面功能
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const errorMessage = document.getElementById('error-message');
    
    // 监听表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 监听回车键
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // 处理登录
    function handleLogin() {
        const password = passwordInput.value.trim();
        const remember = rememberCheckbox.checked;
        
        // 清除之前的错误信息
        hideError();
        
        // 验证输入
        if (!password) {
            showError('请输入密码');
            return;
        }
        
        // 尝试登录
        if (authManager.login(password, remember)) {
            // 登录成功
            showSuccess('登录成功，正在跳转...');
            
            // 延迟跳转以显示成功信息
            setTimeout(() => {
                authManager.redirectToDashboard();
            }, 1000);
        } else {
            // 登录失败
            showError('密码错误，请重试');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    // 显示错误信息
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.className = 'error-message';
        errorMessage.style.display = 'block';
        
        // 添加震动效果
        errorMessage.style.animation = 'shake 0.5s ease-in-out';
    }
    
    // 显示成功信息
    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.className = 'success-message';
        errorMessage.style.display = 'block';
        errorMessage.style.background = '#c6f6d5';
        errorMessage.style.color = '#22543d';
    }
    
    // 隐藏消息
    function hideError() {
        errorMessage.style.display = 'none';
        errorMessage.style.animation = '';
    }
    
    // 重置密码功能
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function() {
            if (confirm('确定要重置密码为默认密码 "admin123" 吗？')) {
                // 创建认证管理器实例并重置密码
                const authManager = new AuthManager();
                authManager.resetPassword();
                
                // 显示成功消息
                showSuccess('密码已重置为默认密码：admin123');
                
                // 清空输入框并聚焦
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }
    
    // 自动聚焦密码输入框
    passwordInput.focus();
});

// 添加震动动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .success-message {
        background: #c6f6d5 !important;
        color: #22543d !important;
    }
`;
document.head.appendChild(style);