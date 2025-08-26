# 🚀 林士林陶艺作品集部署指南

## 📍 网站访问地址
- **主站地址**: https://kkailab.github.io/LIN-SHILIN-portfolio/
- **管理后台**: https://kkailab.github.io/LIN-SHILIN-portfolio/admin/login.html

## 🔧 解决访问旧版本问题

### 1. GitHub Pages 部署延迟
- GitHub Pages 通常需要 **5-10分钟** 更新部署
- 查看部署状态: https://github.com/KKAIlab/LIN-SHILIN-portfolio/actions

### 2. 浏览器缓存清除方法
用户看到旧版本通常是缓存问题，请按以下方法清除：

#### Chrome/Edge:
- **Windows**: `Ctrl + Shift + R` 或 `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

#### Firefox:
- **Windows**: `Ctrl + F5` 或 `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

#### Safari (Mac):
- `Cmd + Option + R` 或在开发者菜单中选择"清空缓存"

#### 手动清除缓存:
1. 打开浏览器设置
2. 找到"隐私与安全"或"清除浏览数据"
3. 选择"缓存的图片和文件"
4. 时间范围选择"最近1小时"
5. 点击清除

## 📤 后台数据同步机制

### 问题说明
- **后台修改的数据存储在浏览器 localStorage 中**
- **不会自动同步到 GitHub 仓库**
- **其他用户无法看到后台修改的内容**

### 解决方案: 数据导出功能
1. **在前台页面底部点击 "📤 导出数据" 按钮**
2. **系统会下载包含所有修改的 JSON 文件**
3. **将该文件发送给开发者进行手动同步**

### 导出数据包含:
- ✅ 新增/修改的作品信息
- ✅ 个人资料修改
- ✅ 多语言文本修改
- ✅ 网站配置更改

## 🔄 更新流程

### 开发者流程:
1. 接收导出的 JSON 数据文件
2. 将数据整合到代码文件中
3. 测试功能正常性
4. 推送到 GitHub
5. 等待 GitHub Pages 自动部署

### 用户查看更新:
1. 等待开发者通知更新完成
2. 清除浏览器缓存 (`Ctrl+Shift+R`)
3. 刷新网站查看最新版本

## 📱 移动端缓存清除

### iOS Safari:
1. 设置 → Safari → 清除历史记录与网站数据

### Android Chrome:
1. Chrome菜单 → 设置 → 隐私和安全 → 清除浏览数据
2. 选择"缓存的图片和文件"

## ⚡ 快速解决方案

**如果用户反映看不到最新版本:**

1. **首先检查**: 访问 GitHub Actions 确认部署完成
2. **指导用户**: 使用 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 强制刷新
3. **如果仍有问题**: 指导用户手动清除浏览器缓存
4. **最后方案**: 建议用户使用隐私/无痕模式访问网站

## 📞 技术支持

如遇到部署问题，请提供以下信息:
- 浏览器类型和版本
- 操作系统
- 具体错误信息或截图
- 是否已尝试清除缓存

---
*更新时间: 2025年1月*