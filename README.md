# 艺术家作品集网站

一个现代化、响应式的艺术家作品集网站，展示艺术作品和创作理念。

## 🎨 特性

- **响应式设计** - 适配各种设备和屏幕尺寸
- **现代化界面** - 简洁优雅的设计风格
- **作品展示** - 支持分类过滤的作品画廊
- **交互动画** - 流畅的页面动画和过渡效果
- **联系表单** - 方便访客与艺术家联系
- **SEO 优化** - 搜索引擎友好的结构

## 📁 项目结构

```
artist-portfolio/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── main.js         # JavaScript 交互
├── images/             # 图片资源
├── assets/             # 其他资源文件
└── README.md           # 项目说明
```

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone [仓库URL]
   cd artist-portfolio
   ```

2. **本地预览**
   - 使用任何静态服务器运行项目
   - 或直接在浏览器中打开 `index.html`

3. **自定义内容**
   - 修改 `index.html` 中的个人信息
   - 替换 `images/` 文件夹中的图片
   - 更新作品数据（在 `js/main.js` 中的 `artworks` 数组）

## 🛠️ 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **JavaScript (ES6+)** - 交互功能
- **Google Fonts** - 优美的字体
- **Unsplash API** - 示例图片（需替换为实际作品）

## 📝 自定义指南

### 1. 个人信息
在 `index.html` 中修改：
- 艺术家姓名
- 个人简介
- 联系信息
- 社交媒体链接

### 2. 作品数据
在 `js/main.js` 中的 `artworks` 数组中添加你的作品：

```javascript
{
    id: 1,
    title: "作品标题",
    category: "paintings", // paintings, digital, sketches
    image: "path/to/image.jpg",
    description: "作品描述",
    details: {
        medium: "创作媒介",
        size: "作品尺寸",
        year: "创作年份"
    }
}
```

### 3. 样式定制
在 `css/style.css` 中修改：
- 颜色主题（`:root` 变量）
- 字体选择
- 动画效果
- 布局样式

### 4. 联系表单
目前使用模拟提交，如需真实功能，可集成：
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://www.netlify.com/products/forms/)
- [EmailJS](https://www.emailjs.com/)

## 🌐 部署

### GitHub Pages
1. 创建 GitHub 仓库
2. 上传代码到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支作为源

### Netlify
1. 连接 GitHub 仓库到 Netlify
2. 自动部署和CDN加速

### Vercel
1. 导入 GitHub 仓库到 Vercel
2. 自动部署和全球CDN

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 🎯 性能优化

- 图片懒加载
- CSS/JS 代码优化
- 动画性能优化
- 响应式图片
- 预加载关键资源

## 📄 许可证

MIT License - 可自由使用和修改

## 💡 贡献

欢迎提交 Issues 和 Pull Requests！

## 📞 支持

如有问题，请通过以下方式联系：
- GitHub Issues
- 邮箱：[your-email@example.com]

---

⭐ 如果这个项目对你有帮助，请给个 Star！