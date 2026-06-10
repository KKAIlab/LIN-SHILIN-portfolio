// ============================================================
// 发布器：通过 GitHub API 把草稿发布到仓库
// - 草稿中的本地图片（data: URL）上传为仓库文件 images/artworks/*
// - 草稿数据写入 data/site-data.js
// - GitHub Pages 自动重新部署（约1-2分钟），之后全网生效
//
// 需要一个 GitHub Token（仅保存在当前浏览器，不会上传到任何地方）：
// GitHub → Settings → Developer settings → Fine-grained tokens →
// 选择本仓库，授予 Contents: Read and write 权限
// ============================================================
class Publisher {
    constructor() {
        this.configKey = 'publish_config';
        this.apiBase = 'https://api.github.com';
    }

    getConfig() {
        const defaults = {
            owner: 'KKAIlab',
            repo: 'LIN-SHILIN-portfolio',
            branch: 'main',
            token: ''
        };
        try {
            const stored = localStorage.getItem(this.configKey);
            return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
        } catch (error) {
            return defaults;
        }
    }

    setConfig(config) {
        localStorage.setItem(this.configKey, JSON.stringify(config));
    }

    headers(token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }

    // 测试连接和权限
    async testConnection() {
        const cfg = this.getConfig();
        if (!cfg.token) {
            throw new Error('请先填写 GitHub Token');
        }
        const res = await fetch(`${this.apiBase}/repos/${cfg.owner}/${cfg.repo}`, {
            headers: this.headers(cfg.token)
        });
        if (res.status === 401) throw new Error('Token 无效或已过期');
        if (res.status === 404) throw new Error(`找不到仓库 ${cfg.owner}/${cfg.repo}，请检查仓库名或 Token 权限`);
        if (!res.ok) throw new Error(`GitHub API 错误（${res.status}）`);
        const repo = await res.json();
        if (!repo.permissions || !repo.permissions.push) {
            throw new Error('Token 没有此仓库的写入权限，请确认授予了 Contents: Read and write');
        }
        return repo;
    }

    // 获取仓库中文件的sha（不存在返回null）
    async getFileSha(path) {
        const cfg = this.getConfig();
        const url = `${this.apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`;
        const res = await fetch(url, { headers: this.headers(cfg.token) });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`读取文件 ${path} 失败（${res.status}）`);
        const data = await res.json();
        return data.sha || null;
    }

    // 创建或更新仓库文件（content为base64字符串）
    async uploadFile(path, base64Content, message) {
        const cfg = this.getConfig();
        const sha = await this.getFileSha(path);
        const url = `${this.apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
        const body = {
            message: message,
            content: base64Content,
            branch: cfg.branch
        };
        if (sha) body.sha = sha;

        const res = await fetch(url, {
            method: 'PUT',
            headers: { ...this.headers(cfg.token), 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.status === 401) throw new Error('Token 无效或已过期');
        if (res.status === 403) throw new Error('权限不足：Token 需要此仓库的 Contents 写入权限');
        if (res.status === 409) throw new Error('提交冲突，请稍后重试');
        if (!res.ok) {
            let detail = '';
            try { detail = (await res.json()).message || ''; } catch (e) { /* 忽略 */ }
            throw new Error(`上传 ${path} 失败（${res.status}）${detail ? '：' + detail : ''}`);
        }
        return res.json();
    }

    // UTF-8字符串转base64
    encodeText(text) {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }

    // 从data URL提取base64内容和扩展名
    parseDataUrl(dataUrl) {
        const match = /^data:image\/(\w+);base64,(.+)$/s.exec(dataUrl);
        if (!match) throw new Error('图片数据格式无效');
        let ext = match[1].toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        return { ext, base64: match[2] };
    }

    // 序列化网站数据文件
    serializeSiteData(data) {
        const header = [
            '// ============================================================',
            '// 网站数据文件（唯一数据源）',
            '// 此文件由后台管理面板自动生成和更新，请勿手动编辑格式。',
            '// ============================================================'
        ].join('\n');
        return `${header}\nwindow.SITE_DATA = ${JSON.stringify(data, null, 2)};\n`;
    }

    // 发布草稿：上传新图片 + 更新数据文件
    // onProgress(message) 用于显示进度
    async publish(draft, onProgress) {
        const progress = onProgress || (() => {});
        const cfg = this.getConfig();
        if (!cfg.token) {
            const err = new Error('尚未配置 GitHub Token，请到"网站设置 → 发布设置"中填写');
            err.needsConfig = true;
            throw err;
        }

        // 深拷贝，避免发布中途失败污染草稿
        const data = JSON.parse(JSON.stringify(draft));
        delete data.exportDate;

        // 1. 上传作品中的本地图片
        const pendingImages = data.artworks.filter(a => a.image && a.image.startsWith('data:'));
        let uploaded = 0;
        for (const artwork of data.artworks) {
            if (artwork.image && artwork.image.startsWith('data:')) {
                uploaded++;
                progress(`正在上传图片 ${uploaded}/${pendingImages.length}...`);
                const { ext, base64 } = this.parseDataUrl(artwork.image);
                const path = `images/artworks/artwork-${artwork.id}-${Date.now()}.${ext}`;
                await this.uploadFile(path, base64, `上传作品图片：${path}`);
                artwork.image = path;
            }
        }

        // 2. 上传艺术家照片（如果是本地图片）
        if (data.profile && data.profile.photo && data.profile.photo.startsWith('data:')) {
            progress('正在上传艺术家照片...');
            const { ext, base64 } = this.parseDataUrl(data.profile.photo);
            const path = `images/artist-photo-${Date.now()}.${ext}`;
            await this.uploadFile(path, base64, `更新艺术家照片：${path}`);
            data.profile.photo = path;
        }

        // 3. 更新数据文件
        progress('正在更新网站数据...');
        data.version = (data.version || 1);
        data.updatedAt = new Date().toISOString();
        const content = this.serializeSiteData(data);
        await this.uploadFile('data/site-data.js', this.encodeText(content), '发布网站内容更新');

        progress('发布完成');
        return data;
    }
}

const publisher = new Publisher();
window.publisher = publisher;

console.log('✅ 发布器已就绪');
