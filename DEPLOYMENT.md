# 🚀 部署指南

## 方法一：GitHub Pages（推荐）

### 1. 创建 GitHub 仓库

1. 打开 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称建议：`artist-portfolio` 或 `your-name-portfolio`
4. 描述：`Personal artist portfolio website showcasing creative works`
5. 设置为 **Public**（GitHub Pages 免费版需要公开仓库）
6. ⚠️ **不要**勾选 "Add a README file"（我们已经有了）
7. 点击 "Create repository"

### 2. 推送代码到 GitHub

在终端中执行以下命令：

```bash
# 添加远程仓库（替换为你的用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings" 标签
2. 滚动到 "Pages" 部分
3. 在 "Source" 下，选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 文件夹选择 "/ (root)"
6. 点击 "Save"
7. 几分钟后，你的网站将在 `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME` 可访问

## 方法二：Netlify（更多功能）

### 1. 部署到 Netlify

1. 访问 [Netlify](https://netlify.com)
2. 注册/登录账户
3. 点击 "New site from Git"
4. 选择 "GitHub" 并授权
5. 选择你的 `artist-portfolio` 仓库
6. 部署设置：
   - Branch: `main`
   - Build command: 留空
   - Publish directory: 留空
7. 点击 "Deploy site"

### 2. 自定义域名（可选）

1. 在 Netlify 控制台，进入 "Domain settings"
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照指示配置 DNS 记录

## 方法三：Vercel

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "New Project"
4. 导入你的 `artist-portfolio` 仓库
5. 保持默认设置，点击 "Deploy"

## 📝 部署前的最终检查

### 1. 替换示例内容

- [ ] 修改 `index.html` 中的艺术家姓名
- [ ] 更新个人简介和联系信息
- [ ] 替换示例图片为你的真实作品
- [ ] 修改 `js/main.js` 中的作品数据
- [ ] 添加真实的社交媒体链接

### 2. 添加真实图片

将你的作品图片放入 `images/` 文件夹：

```
images/
├── artist-photo.jpg          # 艺术家照片
├── artwork-1.jpg            # 作品图片
├── artwork-2.jpg
├── artwork-3.jpg
├── ...
└── og-image.jpg             # 社交媒体分享图片
```

### 3. 更新作品数据

编辑 `js/main.js` 中的 `artworks` 数组：

```javascript
const artworks = [
    {
        id: 1,
        title: "你的作品标题",
        category: "paintings", // paintings, digital, sketches
        image: "./images/your-artwork.jpg", // 使用你的图片路径
        description: "作品描述",
        details: {
            medium: "创作媒介",
            size: "作品尺寸", 
            year: "创作年份"
        }
    },
    // 添加更多作品...
];
```

### 4. 配置联系表单（可选）

#### 使用 Formspree
1. 访问 [Formspree](https://formspree.io)
2. 注册免费账户
3. 创建新表单，获取表单 endpoint
4. 在 `js/main.js` 中的 `initContactForm` 函数中添加：

```javascript
// 替换表单提交逻辑
fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    alert('消息已发送！');
    form.reset();
});
```

#### 使用 Netlify Forms
如果部署到 Netlify，在 `index.html` 的表单标签中添加：

```html
<form id="contact-form" netlify>
```

### 5. SEO 优化

更新 `index.html` 中的 meta 标签：

```html
<title>你的名字 - 艺术家作品集</title>
<meta name="description" content="你的艺术简介和特色">
<meta property="og:title" content="你的名字 - 艺术家作品集">
<meta property="og:description" content="探索我的艺术作品">
<meta property="og:image" content="./images/og-image.jpg">
```

## 🔧 故障排除

### 常见问题

**1. 图片不显示**
- 检查图片路径是否正确
- 确保图片文件已上传到 GitHub
- 检查文件名大小写是否匹配

**2. CSS/JS 文件加载失败**
- 确保路径使用相对路径（`./css/style.css`）
- 检查文件是否已正确提交到 Git

**3. GitHub Pages 部署失败**
- 检查仓库是否为 public
- 确认 Pages 设置中选择了正确的分支
- 等待几分钟让部署完成

**4. 联系表单不工作**
- 默认为模拟提交，需要集成第三方服务
- 参考上面的 Formspree 或 Netlify Forms 配置

### 性能优化

**1. 图片优化**
```bash
# 推荐工具压缩图片
# 在线工具：TinyPNG, Squoosh
# 命令行工具：imagemin, sharp
```

**2. 缓存策略**
- GitHub Pages 自动启用缓存
- Netlify/Vercel 有更高级的缓存控制

## 📊 网站分析（可选）

### 添加 Google Analytics

1. 创建 Google Analytics 账户
2. 获取跟踪 ID
3. 在 `index.html` 的 `<head>` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎯 下一步

1. **定期更新作品** - 添加新作品到网站
2. **SEO 优化** - 提交网站地图到搜索引擎
3. **社交媒体推广** - 分享你的网站链接
4. **性能监控** - 使用 PageSpeed Insights 检查性能
5. **用户反馈** - 收集访客意见并改进

## 📞 需要帮助？

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 参考 GitHub Pages 文档
3. 查看仓库的 Issues 页面
4. 联系技术支持

祝你的艺术作品集网站顺利上线！🎨✨