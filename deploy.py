#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
艺术家网站一键部署工具 (Python版本)
支持跨平台使用，包含用户友好的交互界面

Author: Claude Code
Created: 2025-08-23
"""

import os
import sys
import json
import subprocess
import requests
import time
from pathlib import Path

# 颜色和图标定义
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    PURPLE = '\033[0;35m'
    CYAN = '\033[0;36m'
    RESET = '\033[0m'

class Icons:
    SUCCESS = "✅"
    ERROR = "❌"
    WARNING = "⚠️"
    INFO = "ℹ️"
    ROCKET = "🚀"
    GEAR = "⚙️"
    QUESTION = "❓"
    ARTIST = "🎨"

def print_colored(message, color=Colors.RESET, icon=""):
    """打印带颜色和图标的消息"""
    print(f"{color}{icon} {message}{Colors.RESET}")

def print_success(message):
    print_colored(message, Colors.GREEN, Icons.SUCCESS)

def print_error(message):
    print_colored(message, Colors.RED, Icons.ERROR)

def print_warning(message):
    print_colored(message, Colors.YELLOW, Icons.WARNING)

def print_info(message):
    print_colored(message, Colors.BLUE, Icons.INFO)

def print_question(message):
    print_colored(message, Colors.CYAN, Icons.QUESTION)

def print_title():
    """打印标题"""
    print()
    print_colored("=" * 50, Colors.PURPLE)
    print_colored(f"{Icons.ROCKET} 艺术家网站一键部署工具 {Icons.ARTIST}", Colors.PURPLE)
    print_colored("=" * 50, Colors.PURPLE)
    print()

def check_command(command):
    """检查命令是否存在"""
    try:
        subprocess.run([command, '--version'], 
                      capture_output=True, 
                      check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_requirements():
    """检查部署环境"""
    print_info("检查部署环境...")
    
    missing_commands = []
    
    if not check_command('git'):
        missing_commands.append('git')
    
    if missing_commands:
        print_error(f"缺少必要工具: {', '.join(missing_commands)}")
        print_info("请安装缺少的工具后重试")
        return False
    
    print_success("环境检查通过")
    return True

def get_user_input():
    """获取用户输入"""
    print_info("请提供部署信息：")
    
    # 获取GitHub用户名
    github_username = input(f"{Colors.CYAN}{Icons.QUESTION} 请输入您的GitHub用户名: {Colors.RESET}")
    if not github_username.strip():
        print_error("GitHub用户名不能为空")
        return None
    
    # 获取仓库名称
    repo_name = input(f"{Colors.CYAN}{Icons.QUESTION} 请输入仓库名称 [默认: artist-portfolio]: {Colors.RESET}")
    repo_name = repo_name.strip() or "artist-portfolio"
    
    # 获取GitHub Token（可选）
    github_token = input(f"{Colors.CYAN}{Icons.QUESTION} GitHub Personal Access Token（可选，用于自动创建仓库）: {Colors.RESET}")
    
    return {
        'github_username': github_username,
        'repo_name': repo_name,
        'github_token': github_token.strip() if github_token else None
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
    
    confirm = input(f"{Colors.YELLOW}{Icons.QUESTION} 确认部署吗？ [y/N]: {Colors.RESET}")
    
    return confirm.lower() in ['y', 'yes']

def run_git_command(command, error_message="Git命令执行失败"):
    """执行Git命令"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode != 0:
            print_error(f"{error_message}: {result.stderr}")
            return False
        return True
    except Exception as e:
        print_error(f"{error_message}: {str(e)}")
        return False

def check_git_status():
    """检查Git仓库状态"""
    print_info("检查Git仓库状态...")
    
    # 检查是否在Git仓库中
    if not os.path.exists('.git'):
        print_warning("未检测到Git仓库，正在初始化...")
        if not run_git_command("git init"):
            return False
        print_success("Git仓库初始化完成")
    
    # 检查是否有未提交的更改
    result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
    if result.stdout.strip():
        print_warning("检测到未提交的更改，正在提交...")
        if not run_git_command("git add ."):
            return False
        
        commit_message = """自动提交：准备部署到GitHub Pages

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"""
        
        if not run_git_command(f'git commit -m "{commit_message}"'):
            return False
        print_success("更改已提交")
    
    return True

def create_github_repo(config):
    """创建GitHub仓库"""
    print_info("准备GitHub仓库...")
    
    if not config['github_token']:
        print_warning("未提供GitHub Token，请手动创建仓库")
        print_info(f"请访问: https://github.com/new")
        print_info(f"仓库名称: {config['repo_name']}")
        input(f"{Colors.CYAN}{Icons.QUESTION} 创建完成后按Enter继续...{Colors.RESET}")
        return True
    
    # 使用API创建仓库
    api_url = "https://api.github.com/user/repos"
    headers = {
        "Authorization": f"token {config['github_token']}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "name": config['repo_name'],
        "description": "艺术家作品集网站 - 包含后台管理系统",
        "private": False,
        "has_issues": True,
        "has_projects": True,
        "has_wiki": True
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=data)
        
        if response.status_code == 201:
            print_success("GitHub仓库创建成功")
        elif response.status_code == 422:
            print_warning("仓库已存在，继续使用现有仓库")
        else:
            print_error(f"创建仓库失败: {response.status_code}")
            print_info(f"请手动访问: https://github.com/new")
            input(f"{Colors.CYAN}{Icons.QUESTION} 创建完成后按Enter继续...{Colors.RESET}")
    except Exception as e:
        print_error(f"API请求失败: {str(e)}")
        print_info(f"请手动访问: https://github.com/new")
        input(f"{Colors.CYAN}{Icons.QUESTION} 创建完成后按Enter继续...{Colors.RESET}")
    
    return True

def push_to_github(config):
    """推送代码到GitHub"""
    print_info("推送代码到GitHub...")
    
    repo_url = f"https://github.com/{config['github_username']}/{config['repo_name']}.git"
    
    # 添加或更新远程仓库
    result = subprocess.run("git remote get-url origin", shell=True, capture_output=True)
    if result.returncode == 0:
        if not run_git_command(f"git remote set-url origin {repo_url}"):
            return False
        print_info("远程仓库地址已更新")
    else:
        if not run_git_command(f"git remote add origin {repo_url}"):
            return False
        print_success("远程仓库已添加")
    
    # 设置主分支
    if not run_git_command("git branch -M main"):
        return False
    
    # 推送代码
    print_info("正在推送代码...")
    if not run_git_command("git push -u origin main", "代码推送失败"):
        print_info("请检查GitHub用户名和仓库权限")
        return False
    
    print_success("代码推送成功")
    return True

def enable_github_pages(config):
    """启用GitHub Pages"""
    print_info("启用GitHub Pages...")
    
    if not config['github_token']:
        print_warning("需要手动启用GitHub Pages：")
        print_info(f"1. 访问: https://github.com/{config['github_username']}/{config['repo_name']}/settings/pages")
        print_info("2. 在Source下选择'Deploy from a branch'")
        print_info("3. 选择'main'分支和'/ (root)'文件夹")
        print_info("4. 点击Save")
        return True
    
    # 使用API启用Pages
    api_url = f"https://api.github.com/repos/{config['github_username']}/{config['repo_name']}/pages"
    headers = {
        "Authorization": f"token {config['github_token']}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "source": {
            "branch": "main",
            "path": "/"
        }
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=data)
        
        if response.status_code in [201, 200]:
            print_success("GitHub Pages已启用")
        else:
            print_warning("请手动启用GitHub Pages")
            print_info(f"访问: https://github.com/{config['github_username']}/{config['repo_name']}/settings/pages")
    except Exception as e:
        print_warning(f"Pages启用失败: {str(e)}")
        print_info("请手动启用GitHub Pages")
    
    return True

def show_deployment_result(config):
    """显示部署结果"""
    print()
    print_success("部署完成！")
    print()
    print_colored(f"{Icons.ROCKET} 您的网站信息：", Colors.BLUE)
    print(f"  {Colors.GREEN}主站地址:{Colors.RESET} https://{config['github_username']}.github.io/{config['repo_name']}/")
    print(f"  {Colors.GREEN}后台管理:{Colors.RESET} https://{config['github_username']}.github.io/{config['repo_name']}/admin/login.html")
    print(f"  {Colors.GREEN}默认密码:{Colors.RESET} admin123")
    print(f"  {Colors.GREEN}GitHub仓库:{Colors.RESET} https://github.com/{config['github_username']}/{config['repo_name']}")
    print()
    print_colored(f"{Icons.WARNING} 注意事项：", Colors.YELLOW)
    print("  • 网站可能需要几分钟时间才能生效")
    print("  • 建议登录后台后立即修改默认密码")
    print("  • 定期备份后台数据")
    print()
    print_colored(f"{Icons.SUCCESS} 感谢使用艺术家网站一键部署工具！", Colors.PURPLE)
    print()

def main():
    """主函数"""
    try:
        print_title()
        
        # 检查部署环境
        if not check_requirements():
            sys.exit(1)
        
        # 获取用户输入
        config = get_user_input()
        if not config:
            sys.exit(1)
        
        # 确认部署信息
        if not confirm_deployment(config):
            print_warning("部署已取消")
            sys.exit(0)
        
        print_info("开始自动部署...")
        print()
        
        # 检查Git状态
        if not check_git_status():
            print_error("Git检查失败")
            sys.exit(1)
        
        # 准备GitHub仓库
        if not create_github_repo(config):
            print_error("仓库准备失败")
            sys.exit(1)
        
        # 推送代码
        if not push_to_github(config):
            print_error("代码推送失败")
            sys.exit(1)
        
        # 启用GitHub Pages
        enable_github_pages(config)
        
        # 显示结果
        show_deployment_result(config)
        
    except KeyboardInterrupt:
        print()
        print_warning("部署已中断")
        sys.exit(1)
    except Exception as e:
        print_error(f"意外错误: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()