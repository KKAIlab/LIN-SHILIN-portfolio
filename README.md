# 林士林作品集 | LIN SHILIN Portfolio

艺术家个人作品集网站，支持中/英/日三语，内置可视化后台管理，可直接发布更新到正式网站。

**🌐 正式网站：[https://kkailab.github.io/LIN-SHILIN-portfolio/](https://kkailab.github.io/LIN-SHILIN-portfolio/)**

## 网站架构

- 纯静态网站，托管在 GitHub Pages 上，无需服务器
- 所有内容（作品、图片、个人信息）存储在仓库中：
  - `data/site-data.js` —— 网站数据（作品列表、个人信息、多语言文本）
  - `images/artworks/` —— 作品图片
- 后台管理面板通过 GitHub API 直接更新仓库，GitHub Pages 自动重新部署

```
├── index.html            # 网站首页
├── data/site-data.js     # 网站数据（唯一数据源，后台自动维护）
├── images/artworks/      # 作品图片（后台发布时自动上传）
├── css/ 与 js/           # 前台样式和脚本
└── admin/                # 后台管理面板
    ├── login.html        # 登录页（默认密码 admin123，登录后请修改）
    └── dashboard.html    # 管理面板
```

## 如何更新网站内容（艺术家操作指南）

### 第一次使用：配置发布权限（只需一次）

1. 打开 GitHub → 右上角头像 → **Settings** → **Developer settings** →
   **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Repository access 选择 **Only select repositories**，选中本仓库
3. Permissions → Repository permissions → **Contents** 设为 **Read and write**
4. 生成后复制 Token（`github_pat_` 开头）
5. 打开网站底部的「🔒 管理后台」登录，进入「网站设置」，
   粘贴 Token，点「测试连接」确认显示 ✅，再点「保存发布设置」

> Token 只保存在你自己的浏览器里，不会上传到任何地方。

### 日常更新流程

1. **登录后台**：网站底部「🔒 管理后台」
2. **编辑内容**：
   - 「作品管理」→ 添加新作品 / 批量上传图片 / 编辑 / 删除
   - 「个人信息」→ 修改姓名、简介、照片、联系方式、统计数字
   - 所有修改先保存为**本地草稿**，不会立即影响正式网站
3. **预览草稿**：点右上角「预览草稿」，确认效果
4. **发布**：点「🚀 发布到网站」，等待提示发布成功
5. 约 1-2 分钟后 GitHub Pages 部署完成，所有访客即可看到新内容

### 注意事项

- 图片上传时会自动压缩（最长边 1600px），无需提前处理
- 「放弃未发布的修改」可以把草稿恢复成正式网站当前的内容
- 「导出备份」会下载一份包含全部内容的 JSON 文件，建议定期备份
- 后台登录密码默认为 `admin123`，请在「网站设置」中尽快修改
  （登录密码只是防止误操作的前台屏障，真正的发布权限由 GitHub Token 控制）

## 本地开发

```bash
git clone https://github.com/KKAIlab/LIN-SHILIN-portfolio.git
cd LIN-SHILIN-portfolio
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 技术说明

- 前台：原生 HTML/CSS/JavaScript，无构建步骤
- 多语言：界面文本在 `js/i18n.js`，作品/个人信息的多语言文本在 `data/site-data.js`
- 后台发布：浏览器直接调用 GitHub Contents API（`admin/js/publisher.js`），
  上传图片到 `images/artworks/`，更新 `data/site-data.js`
- 深色模式、响应式布局、作品全屏查看等功能开箱即用

## License

MIT License
