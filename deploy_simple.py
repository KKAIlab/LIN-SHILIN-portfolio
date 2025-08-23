#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
艺术家网站简化一键部署工具
无需额外依赖，纯Python标准库实现

Author: Claude Code
Created: 2025-08-23
"""

import os
import sys
import subprocess
import urllib.request
import urllib.parse
import json

# 颜色和图标定义
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    PURPLE = '\033[0;35m'
    CYAN = '\033[0;36m'
    RESET = '\033[0m'

def print_colored(message, color=Colors.RESET, icon=""):
    """打印带颜色和图标的消息"""
    print(f"{color}{icon} {message}{Colors.RESET}")

def print_success(message):
    print_colored(message, Colors.GREEN, "✅")

def print_error(message):
    print_colored(message, Colors.RED, "❌")

def print_warning(message):
    print_colored(message, Colors.YELLOW, "⚠️")

def print_info(message):
    print_colored(message, Colors.BLUE, "ℹ️")

def print_question(message):
    print_colored(message, Colors.CYAN, "❓")

def print_title():
    """打印标题"""
    print()
    print_colored("=" * 50, Colors.PURPLE)
    print_colored("🚀 艺术家网站一键部署工具 🎨", Colors.PURPLE)
    print_colored("=" * 50, Colors.PURPLE)
    print()

def run_command(command, error_message="命令执行失败"):
    """执行命令"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode != 0:
            print_error(f"{error_message}: {result.stderr}")
            return False
        return True
    except Exception as e:
        print_error(f"{error_message}: {str(e)}")
        return False

def check_git():
    """检查Git是否可用"""
    try:
        subprocess.run(['git', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def get_user_input():
    """获取用户输入"""
    print_info("请提供部署信息：")
    
    github_username = input(f"{Colors.CYAN}❓ 请输入您的GitHub用户名: {Colors.RESET}")
    if not github_username.strip():
        print_error("GitHub用户名不能为空")
        return None
    
    repo_name = input(f"{Colors.CYAN}❓ 请输入仓库名称 [默认: artist-portfolio]: {Colors.RESET}")
    repo_name = repo_name.strip() or "artist-portfolio"
    
    return {
        'github_username': github_username,
        'repo_name': repo_name
    }

def confirm_deployment(config):
    """确认部署信息"""
    print()
    print_info("部署信息确认：")
    print(f"  {Colors.BLUE}GitHub用户名:{Colors.RESET} {config['github_username']}")
    print(f"  {Colors.BLUE}仓库名称:{Colors.RESET} {config['repo_name']}")
    print(f"  {Colors.BLUE}仓库地址:{Colors.RESET} https://github.com/{config['github_username']}/{config['repo_name']}")
    print(f"  {Colors.BLUE}网站地址:{Colors.RESET} https://{config['github_username']}.github.io/{config['repo_name']}/")
    print()
    
    confirm = input(f"{Colors.YELLOW}❓ 确认部署吗？ [y/N]: {Colors.RESET}")
    return confirm.lower() in ['y', 'yes']

def setup_git_repo():
    """设置Git仓库"""
    print_info("准备Git仓库...")
    
    # 初始化Git仓库（如果需要）
    if not os.path.exists('.git'):
        print_info("初始化Git仓库...")
        if not run_command("git init"):
            return False
    
    # 检查是否有未提交的更改
    result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
    if result.stdout.strip():
        print_info("提交最新更改...")
        if not run_command("git add ."):
            return False
        
        commit_message = """一键部署：更新网站内容

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"""
        
        if not run_command(f'git commit -m "{commit_message}"'):
            return False
    
    print_success("Git仓库准备完成")
    return True

def push_to_github(config):
    """推送到GitHub"""
    print_info("推送代码到GitHub...")
    
    repo_url = f"https://github.com/{config['github_username']}/{config['repo_name']}.git"
    
    # 设置远程仓库
    result = subprocess.run("git remote get-url origin", shell=True, capture_output=True)
    if result.returncode == 0:
        run_command(f"git remote set-url origin {repo_url}")
    else:
        run_command(f"git remote add origin {repo_url}")
    
    # 推送代码
    run_command("git branch -M main")
    
    print_info("正在推送代码到GitHub...")
    if not run_command("git push -u origin main"):
        print_error("推送失败！")
        print_info("可能的原因：")
        print("  1. 仓库不存在 - 请先在GitHub上创建仓库")
        print("  2. 认证失败 - 请检查GitHub登录状态")
        print("  3. 权限不足 - 请检查仓库权限")
        print()
        print_info(f"请手动创建仓库: https://github.com/new")
        print_info(f"仓库名称: {config['repo_name']}")
        return False
    
    print_success("代码推送成功！")
    return True

def show_next_steps(config):
    """显示后续步骤"""
    print()
    print_success("代码已成功推送到GitHub！")
    print()
    print_info("接下来请完成以下步骤启用GitHub Pages：")
    print()
    print(f"1. 🌐 访问仓库设置页面：")
    print(f"   {Colors.BLUE}https://github.com/{config['github_username']}/{config['repo_name']}/settings/pages{Colors.RESET}")
    print()
    print(f"2. ⚙️ 配置Pages设置：")
    print(f"   • 在 'Source' 下选择 'Deploy from a branch'")
    print(f"   • 选择 'main' 分支")
    print(f"   • 选择 '/ (root)' 文件夹")
    print(f"   • 点击 'Save' 按钮")
    print()
    print(f"3. ⏳ 等待部署完成（通常需要几分钟）")
    print()
    print(f"4. 🎉 访问您的网站：")
    print(f"   • {Colors.GREEN}主站: https://{config['github_username']}.github.io/{config['repo_name']}/{Colors.RESET}")
    print(f"   • {Colors.GREEN}后台: https://{config['github_username']}.github.io/{config['repo_name']}/admin/login.html{Colors.RESET}")
    print(f"   • {Colors.GREEN}默认密码: admin123{Colors.RESET}")
    print()
    print_colored("🎨 您的艺术家网站即将上线！", Colors.PURPLE)
    print()

def main():
    """主函数"""
    try:
        print_title()
        
        # 检查Git
        if not check_git():
            print_error("未找到Git，请先安装Git")
            print_info("下载地址: https://git-scm.com/downloads")
            sys.exit(1)
        
        print_success("环境检查通过")
        
        # 获取用户输入
        config = get_user_input()
        if not config:
            sys.exit(1)
        
        # 确认部署
        if not confirm_deployment(config):
            print_warning("部署已取消")
            sys.exit(0)
        
        print()
        print_info("🚀 开始自动部署...")
        print()
        
        # 设置Git仓库
        if not setup_git_repo():
            sys.exit(1)
        
        # 推送到GitHub
        if not push_to_github(config):
            sys.exit(1)
        
        # 显示后续步骤
        show_next_steps(config)
        
    except KeyboardInterrupt:
        print()
        print_warning("部署已中断")
        sys.exit(1)
    except Exception as e:
        print_error(f"意外错误: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()