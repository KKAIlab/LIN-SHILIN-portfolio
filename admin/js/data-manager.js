// ============================================================
// 数据管理器（草稿模式）
// - 已发布数据：仓库中的 data/site-data.js（window.SITE_DATA）
// - 草稿数据：localStorage 'draft_site_data'，编辑先存草稿
// - 点击"发布到网站"后，由 publisher.js 通过 GitHub API
//   把草稿写回仓库，GitHub Pages 重新部署后全网生效
// ============================================================
class DataManager {
    constructor() {
        this.draftKey = 'draft_site_data';
        this.publishedSnapshotKey = 'published_site_data_snapshot';
        this.cleanupLegacyKeys();
        this.ensureDraft();
    }

    // 清理旧版本遗留的localStorage数据（已废弃的同步机制）
    cleanupLegacyKeys() {
        ['artworks_data', 'profile_data', 'i18n_data', 'site_config',
         'sync_timestamp', 'last_admin_update'].forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (error) { /* 忽略 */ }
        });
    }

    // 获取已发布的数据（深拷贝）
    getPublishedData() {
        if (window.SITE_DATA) {
            return JSON.parse(JSON.stringify(window.SITE_DATA));
        }
        return { version: 1, updatedAt: null, profile: this.defaultProfile(), artworks: [] };
    }

    defaultProfile() {
        return {
            name: { zh: '', en: '', ja: '' },
            bio: { zh: '', en: '', ja: '' },
            email: '',
            photo: '',
            social: { instagram: '', weibo: '' },
            stats: { artworks: 0, exhibitions: 0, experience: 0 }
        };
    }

    // 确保草稿存在（首次进入后台时从已发布数据初始化）
    ensureDraft() {
        if (!localStorage.getItem(this.draftKey)) {
            const published = this.getPublishedData();
            this.saveDraft(published);
            localStorage.setItem(this.publishedSnapshotKey, JSON.stringify(published));
        }
    }

    // 获取草稿
    getDraft() {
        try {
            const data = localStorage.getItem(this.draftKey);
            if (data) return JSON.parse(data);
        } catch (error) {
            console.error('❌ 草稿数据解析失败，重置为已发布数据:', error);
        }
        return this.getPublishedData();
    }

    // 保存草稿（捕获存储配额溢出）
    saveDraft(draft) {
        draft.updatedAt = new Date().toISOString();
        try {
            localStorage.setItem(this.draftKey, JSON.stringify(draft));
        } catch (error) {
            const isQuota = error && (
                error.name === 'QuotaExceededError' ||
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
                error.code === 22
            );
            console.error(`❌ 草稿保存失败${isQuota ? '（存储空间不足）' : ''}:`, error);
            if (isQuota) {
                const quotaError = new Error('浏览器存储空间不足，请先发布草稿（发布后图片会转存到仓库，释放本地空间）');
                quotaError.isQuotaError = true;
                throw quotaError;
            }
            throw error;
        }
    }

    // 是否有未发布的修改
    hasUnpublishedChanges() {
        const draft = localStorage.getItem(this.draftKey);
        const snapshot = localStorage.getItem(this.publishedSnapshotKey)
            || JSON.stringify(this.getPublishedData());
        if (!draft) return false;
        try {
            // 比较时忽略updatedAt时间戳
            const normalize = (json) => {
                const obj = JSON.parse(json);
                delete obj.updatedAt;
                return JSON.stringify(obj);
            };
            return normalize(draft) !== normalize(snapshot);
        } catch (error) {
            return true;
        }
    }

    // 发布成功后记录快照
    markPublished(publishedDraft) {
        this.saveDraft(publishedDraft);
        localStorage.setItem(this.publishedSnapshotKey, JSON.stringify(publishedDraft));
    }

    // 放弃草稿，恢复为已发布版本
    resetDraft() {
        const published = this.getPublishedData();
        this.saveDraft(published);
        localStorage.setItem(this.publishedSnapshotKey, JSON.stringify(published));
        return published;
    }

    // ---------- 作品操作 ----------
    getArtworks() {
        return this.getDraft().artworks || [];
    }

    getArtworkById(id) {
        return this.getArtworks().find(item => item.id === id);
    }

    addArtwork(artwork) {
        const draft = this.getDraft();
        const maxId = (draft.artworks || []).reduce((max, item) => Math.max(max, item.id), 0);
        artwork.id = maxId + 1;
        draft.artworks.push(artwork);
        this.saveDraft(draft);
        return artwork;
    }

    updateArtwork(id, updatedArtwork) {
        const draft = this.getDraft();
        const index = draft.artworks.findIndex(item => item.id === id);
        if (index !== -1) {
            draft.artworks[index] = { ...draft.artworks[index], ...updatedArtwork, id };
            this.saveDraft(draft);
            return draft.artworks[index];
        }
        return null;
    }

    deleteArtwork(id) {
        const draft = this.getDraft();
        const before = draft.artworks.length;
        draft.artworks = draft.artworks.filter(item => item.id !== id);
        this.saveDraft(draft);
        return draft.artworks.length < before;
    }

    // ---------- 个人信息操作 ----------
    getProfile() {
        return this.getDraft().profile || this.defaultProfile();
    }

    setProfile(profile) {
        const draft = this.getDraft();
        draft.profile = profile;
        this.saveDraft(draft);
    }

    // ---------- 备份/恢复 ----------
    exportAllData() {
        return JSON.stringify({
            ...this.getDraft(),
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    importAllData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!Array.isArray(data.artworks)) {
                throw new Error('数据格式不正确：缺少作品列表');
            }
            const draft = {
                version: data.version || 1,
                profile: data.profile || this.defaultProfile(),
                artworks: data.artworks
            };
            this.saveDraft(draft);
            return true;
        } catch (error) {
            console.error('数据导入失败:', error);
            return false;
        }
    }

    // ---------- 统计 ----------
    getStatistics() {
        const draft = this.getDraft();
        const artworks = draft.artworks || [];
        return {
            totalArtworks: artworks.length,
            paintings: artworks.filter(a => a.category === 'paintings').length,
            digital: artworks.filter(a => a.category === 'digital').length,
            sketches: artworks.filter(a => a.category === 'sketches').length,
            lastUpdated: draft.updatedAt || '未知'
        };
    }
}

// 创建全局数据管理器实例
const dataManager = new DataManager();
window.dataManager = dataManager;

console.log('✅ 数据管理器（草稿模式）已就绪');
