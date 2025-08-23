#!/bin/bash

# 艺术家网站一键部署脚本
# Author: Claude Code
# Created: 2025-08-23

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 图标定义
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"
QUESTION="❓"

# 打印带颜色的消息
print_message() {
    local color=$1
    local icon=$2
    local message=$3
    echo -e "${color}${icon} ${message}${NC}"
}

print_success() { print_message "$GREEN" "$SUCCESS" "$1"; }
print_error() { print_message "$RED" "$ERROR" "$1"; }
print_warning() { print_message "$YELLOW" "$WARNING" "$1"; }
print_info() { print_message "$BLUE" "$INFO" "$1"; }
print_question() { print_message "$CYAN" "$QUESTION" "$1"; }

# 打印标题
print_title() {
    echo
    echo -e "${PURPLE}=====================================${NC}"
    echo -e "${PURPLE}${ROCKET} 艺术家网站一键部署工具 ${ROCKET}${NC}"
    echo -e "${PURPLE}=====================================${NC}"
    echo
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "未找到命令: $1"
        return 1
    fi
    return 0
}

# 检查必要工具
check_requirements() {
    print_info "检查部署环境..."
    
    local missing_commands=()
    
    if ! check_command "git"; then
        missing_commands+=("git")
    fi
    
    if ! check_command "curl"; then
        missing_commands+=("curl")
    fi
    
    if [ ${#missing_commands[@]} -gt 0 ]; then
        print_error "缺少必要工具: ${missing_commands[*]}"
        print_info "请安装缺少的工具后重试"
        return 1
    fi
    
    print_success "环境检查通过"
    return 0
}

# 获取用户输入
get_user_input() {
    print_info "请提供部署信息："
    
    # 获取GitHub用户名
    read -p "$(echo -e ${CYAN}${QUESTION} 请输入您的GitHub用户名: ${NC})" GITHUB_USERNAME
    if [ -z "$GITHUB_USERNAME" ]; then
        print_error "GitHub用户名不能为空"
        return 1
    fi
    
    # 获取仓库名称
    read -p "$(echo -e ${CYAN}${QUESTION} 请输入仓库名称 [默认: artist-portfolio]: ${NC})" REPO_NAME
    REPO_NAME=${REPO_NAME:-"artist-portfolio"}
    
    # 获取GitHub Token（可选，用于私有仓库）
    read -p "$(echo -e ${CYAN}${QUESTION} GitHub Personal Access Token（可选，用于私有仓库）: ${NC})" GITHUB_TOKEN
    
    return 0
}

# 确认部署信息
confirm_deployment() {
    echo
    print_info "部署信息确认："
    echo -e "  ${BLUE}GitHub用户名:${NC} $GITHUB_USERNAME"
    echo -e "  ${BLUE}仓库名称:${NC} $REPO_NAME"
    echo -e "  ${BLUE}仓库地址:${NC} https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo -e "  ${BLUE}网站地址:${NC} https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
    echo
    
    read -p "$(echo -e ${YELLOW}${QUESTION} 确认部署吗？ [y/N]: ${NC})" CONFIRM
    
    case $CONFIRM in
        [yY]|[yY][eE][sS])
            return 0
            ;;
        *)
            print_warning "部署已取消"
            return 1
            ;;
    esac
}

# 检查Git仓库状态
check_git_status() {
    print_info "检查Git仓库状态..."
    
    # 检查是否在Git仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_warning "未检测到Git仓库，正在初始化..."
        git init
        print_success "Git仓库初始化完成"
    fi
    
    # 检查是否有未提交的更改
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        print_warning "检测到未提交的更改，正在提交..."
        git add .
        git commit -m "自动提交：准备部署到GitHub Pages

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        print_success "更改已提交"
    fi
    
    return 0
}

# 创建GitHub仓库
create_github_repo() {
    print_info "创建GitHub仓库..."
    
    # 构造API请求
    local api_url="https://api.github.com/user/repos"
    local repo_data="{
        \"name\": \"$REPO_NAME\",
        \"description\": \"艺术家作品集网站 - 包含后台管理系统\",
        \"private\": false,
        \"has_issues\": true,
        \"has_projects\": true,
        \"has_wiki\": true
    }"
    
    # 发送API请求
    local response
    if [ -n "$GITHUB_TOKEN" ]; then
        response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
                       -H "Accept: application/vnd.github.v3+json" \
                       -d "$repo_data" \
                       "$api_url")
    else
        print_warning "未提供GitHub Token，请手动创建仓库"
        print_info "请访问: https://github.com/new"
        print_info "仓库名称: $REPO_NAME"
        read -p "$(echo -e ${CYAN}${QUESTION} 创建完成后按Enter继续...${NC})"
        return 0
    fi
    
    # 检查响应
    if echo "$response" | grep -q "\"name\": \"$REPO_NAME\""; then
        print_success "GitHub仓库创建成功"
    elif echo "$response" | grep -q "already exists"; then
        print_warning "仓库已存在，继续使用现有仓库"
    else
        print_error "创建仓库失败，请手动创建"
        print_info "请访问: https://github.com/new"
        read -p "$(echo -e ${CYAN}${QUESTION} 创建完成后按Enter继续...${NC})"
    fi
    
    return 0
}

# 推送代码到GitHub
push_to_github() {
    print_info "推送代码到GitHub..."
    
    local repo_url="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
    # 添加远程仓库
    if git remote get-url origin > /dev/null 2>&1; then
        git remote set-url origin "$repo_url"
        print_info "远程仓库地址已更新"
    else
        git remote add origin "$repo_url"
        print_success "远程仓库已添加"
    fi
    
    # 设置主分支
    git branch -M main
    
    # 推送代码
    print_info "正在推送代码..."
    if git push -u origin main; then
        print_success "代码推送成功"
    else
        print_error "代码推送失败"
        print_info "请检查GitHub用户名和仓库权限"
        return 1
    fi
    
    return 0
}

# 启用GitHub Pages
enable_github_pages() {
    print_info "启用GitHub Pages..."
    
    if [ -n "$GITHUB_TOKEN" ]; then
        local api_url="https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME/pages"
        local pages_data="{
            \"source\": {
                \"branch\": \"main\",
                \"path\": \"/\"
            }
        }"
        
        local response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
                             -H "Accept: application/vnd.github.v3+json" \
                             -d "$pages_data" \
                             "$api_url")
        
        if echo "$response" | grep -q "\"status\": \"built\""; then
            print_success "GitHub Pages已启用"
        else
            print_warning "请手动启用GitHub Pages"
        fi
    else
        print_warning "需要手动启用GitHub Pages："
        print_info "1. 访问: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
        print_info "2. 在Source下选择'Deploy from a branch'"
        print_info "3. 选择'main'分支和'/ (root)'文件夹"
        print_info "4. 点击Save"
    fi
    
    return 0
}

# 显示部署结果
show_deployment_result() {
    echo
    print_success "部署完成！"
    echo
    echo -e "${BLUE}${ROCKET} 您的网站信息：${NC}"
    echo -e "  ${GREEN}主站地址:${NC} https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
    echo -e "  ${GREEN}后台管理:${NC} https://$GITHUB_USERNAME.github.io/$REPO_NAME/admin/login.html"
    echo -e "  ${GREEN}默认密码:${NC} admin123"
    echo -e "  ${GREEN}GitHub仓库:${NC} https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo
    echo -e "${YELLOW}${WARNING} 注意事项：${NC}"
    echo -e "  • 网站可能需要几分钟时间才能生效"
    echo -e "  • 建议登录后台后立即修改默认密码"
    echo -e "  • 定期备份后台数据"
    echo
    echo -e "${PURPLE}${SUCCESS} 感谢使用艺术家网站一键部署工具！${NC}"
    echo
}

# 主函数
main() {
    print_title
    
    # 检查部署环境
    if ! check_requirements; then
        exit 1
    fi
    
    # 获取用户输入
    if ! get_user_input; then
        exit 1
    fi
    
    # 确认部署信息
    if ! confirm_deployment; then
        exit 0
    fi
    
    print_info "开始自动部署..."
    echo
    
    # 检查Git状态
    if ! check_git_status; then
        print_error "Git检查失败"
        exit 1
    fi
    
    # 创建GitHub仓库
    if ! create_github_repo; then
        print_error "仓库创建失败"
        exit 1
    fi
    
    # 推送代码
    if ! push_to_github; then
        print_error "代码推送失败"
        exit 1
    fi
    
    # 启用GitHub Pages
    enable_github_pages
    
    # 显示结果
    show_deployment_result
}

# 捕获Ctrl+C信号
trap 'echo; print_warning "部署已中断"; exit 1' INT

# 运行主函数
main "$@"