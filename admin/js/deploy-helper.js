// 后台一键部署辅助功能
class DeployHelper {
    constructor() {
        this.initDeployButton();
    }
    
    // 初始化部署按钮
    initDeployButton() {
        // 在概览页面添加一键部署按钮
        const dashboardActions = document.querySelector('.action-card .action-buttons');
        if (dashboardActions) {
            const deployButton = document.createElement('button');
            deployButton.className = 'btn btn-primary';
            deployButton.innerHTML = '🚀 一键部署';
            deployButton.addEventListener('click', () => this.showDeployModal());
            
            dashboardActions.appendChild(deployButton);
        }
    }
    
    // 显示部署模态框
    showDeployModal() {
        const modal = this.createDeployModal();
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
    
    // 创建部署模态框
    createDeployModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'deploy-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚀 一键部署到GitHub Pages</h3>
                    <span class="close-btn" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="deploy-steps">
                        <div class="step-item">
                            <div class="step-icon">1</div>
                            <div class="step-content">
                                <h4>准备部署脚本</h4>
                                <p>下载并运行一键部署脚本</p>
                                <div class="deploy-options">
                                    <button class="btn btn-primary" onclick="deployHelper.downloadScript('bash')">
                                        下载Bash脚本 (Mac/Linux)
                                    </button>
                                    <button class="btn btn-primary" onclick="deployHelper.downloadScript('python')">
                                        下载Python脚本 (跨平台)
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="step-item">
                            <div class="step-icon">2</div>
                            <div class="step-content">
                                <h4>运行部署脚本</h4>
                                <p>在项目根目录运行以下命令：</p>
                                <div class="code-block">
                                    <code>./deploy.sh</code>
                                    <span>或者</span>
                                    <code>python3 deploy.py</code>
                                </div>
                                <button class="btn btn-secondary" onclick="deployHelper.copyToClipboard('./deploy.sh')">
                                    复制Bash命令
                                </button>
                                <button class="btn btn-secondary" onclick="deployHelper.copyToClipboard('python3 deploy.py')">
                                    复制Python命令
                                </button>
                            </div>
                        </div>
                        
                        <div class="step-item">
                            <div class="step-icon">3</div>
                            <div class="step-content">
                                <h4>完成部署</h4>
                                <p>脚本会自动：</p>
                                <ul>
                                    <li>✅ 检查环境依赖</li>
                                    <li>✅ 提交代码更改</li>
                                    <li>✅ 创建GitHub仓库（可选）</li>
                                    <li>✅ 推送代码到GitHub</li>
                                    <li>✅ 启用GitHub Pages</li>
                                    <li>✅ 提供访问链接</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="deploy-info">
                        <h4>📋 部署信息准备</h4>
                        <p>运行脚本前请准备以下信息：</p>
                        <ul>
                            <li><strong>GitHub用户名</strong>：您的GitHub用户名</li>
                            <li><strong>仓库名称</strong>：推荐使用 'artist-portfolio'</li>
                            <li><strong>GitHub Token</strong>（可选）：用于自动创建仓库</li>
                        </ul>
                        
                        <div class="info-box">
                            <h5>🔑 如何获取GitHub Token：</h5>
                            <ol>
                                <li>访问 <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings → Personal access tokens</a></li>
                                <li>点击 "Generate new token (classic)"</li>
                                <li>勾选 "repo" 权限</li>
                                <li>复制生成的token</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .deploy-steps {
                margin: 20px 0;
            }
            
            .step-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
                border-left: 4px solid #667eea;
            }
            
            .step-icon {
                background: #667eea;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 15px;
                flex-shrink: 0;
            }
            
            .step-content h4 {
                margin: 0 0 8px 0;
                color: #2d3748;
            }
            
            .step-content p {
                margin: 0 0 15px 0;
                color: #4a5568;
            }
            
            .deploy-options {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .code-block {
                background: #1a202c;
                color: #e2e8f0;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                margin: 10px 0;
            }
            
            .code-block code {
                background: transparent;
                color: #68d391;
                font-size: 14px;
            }
            
            .code-block span {
                color: #a0aec0;
                margin: 0 10px;
            }
            
            .deploy-info {
                background: #e6fffa;
                padding: 20px;
                border-radius: 12px;
                margin-top: 20px;
            }
            
            .info-box {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                border: 1px solid #b2f5ea;
            }
            
            .deploy-info ul, .info-box ol {
                padding-left: 20px;
            }
            
            .deploy-info li, .info-box li {
                margin-bottom: 5px;
            }
            
            .deploy-info a {
                color: #667eea;
                text-decoration: none;
            }
            
            .deploy-info a:hover {
                text-decoration: underline;
            }
        `;
        
        modal.appendChild(style);
        return modal;
    }
    
    // 下载部署脚本
    downloadScript(type) {
        const scripts = {
            bash: {
                filename: 'deploy.sh',
                content: this.getBashScript()
            },
            python: {
                filename: 'deploy.py',
                content: this.getPythonScript()
            }
        };
        
        const script = scripts[type];
        if (!script) return;
        
        const blob = new Blob([script.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = script.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        this.showNotification(`${script.filename} 下载成功！请在项目根目录运行。`);
    }
    
    // 复制到剪贴板
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('命令已复制到剪贴板！');
        }).catch(() => {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('命令已复制到剪贴板！');
        });
    }
    
    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease-in-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 获取Bash脚本内容（简化版，指向实际文件）
    getBashScript() {
        return `#!/bin/bash
# 请使用项目中的完整 deploy.sh 文件
echo "请下载完整的 deploy.sh 脚本文件"
echo "或访问项目仓库获取最新版本"`;
    }
    
    // 获取Python脚本内容（简化版，指向实际文件）
    getPythonScript() {
        return `#!/usr/bin/env python3
# 请使用项目中的完整 deploy.py 文件
print("请下载完整的 deploy.py 脚本文件")
print("或访问项目仓库获取最新版本")`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建全局部署助手实例
    window.deployHelper = new DeployHelper();
});