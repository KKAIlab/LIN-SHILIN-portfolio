// 数据管理器
class DataManager {
    constructor() {
        this.storageKeys = {
            artworks: 'artworks_data',
            profile: 'profile_data',
            i18n: 'i18n_data',
            siteConfig: 'site_config'
        };
        
        this.initializeData();
    }
    
    // 初始化数据（从现有代码迁移数据）
    initializeData() {
        // 初始化作品数据
        if (!this.getArtworks().length) {
            this.initializeArtworks();
        }
        
        // 初始化个人信息
        if (!this.getProfile()) {
            this.initializeProfile();
        }
        
        // 初始化多语言数据
        if (!this.getI18nData()) {
            this.initializeI18n();
        }
        
        // 初始化网站配置
        if (!this.getSiteConfig()) {
            this.initializeSiteConfig();
        }
    }
    
    // 初始化作品数据（从main.js移植）
    initializeArtworks() {
        const defaultArtworks = [
            {
                id: 1,
                titleKey: "artwork-1-title",
                descriptionKey: "artwork-1-desc",
                category: "paintings",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
                details: {
                    medium: "油画",
                    size: "80cm × 100cm",
                    year: "2024"
                }
            },
            {
                id: 2,
                titleKey: "artwork-2-title",
                descriptionKey: "artwork-2-desc",
                category: "digital",
                image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=600&fit=crop",
                details: {
                    medium: "数字艺术",
                    size: "3000px × 4000px",
                    year: "2024"
                }
            },
            {
                id: 3,
                titleKey: "artwork-3-title",
                descriptionKey: "artwork-3-desc",
                category: "sketches",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
                details: {
                    medium: "炭笔素描",
                    size: "40cm × 50cm",
                    year: "2023"
                }
            },
            {
                id: 4,
                titleKey: "artwork-4-title",
                descriptionKey: "artwork-4-desc",
                category: "paintings",
                image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=600&fit=crop",
                details: {
                    medium: "水彩",
                    size: "60cm × 80cm",
                    year: "2023"
                }
            },
            {
                id: 5,
                titleKey: "artwork-5-title",
                descriptionKey: "artwork-5-desc",
                category: "digital",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=600&fit=crop",
                details: {
                    medium: "数字绘画",
                    size: "4000px × 3000px",
                    year: "2024"
                }
            },
            {
                id: 6,
                titleKey: "artwork-6-title",
                descriptionKey: "artwork-6-desc",
                category: "sketches",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
                details: {
                    medium: "铅笔素描",
                    size: "35cm × 45cm",
                    year: "2023"
                }
            }
        ];
        
        this.setArtworks(defaultArtworks);
    }
    
    // 初始化个人信息
    initializeProfile() {
        const defaultProfile = {
            name: "林士林",
            bio: "我是一位专注于当代艺术创作的艺术家，致力于通过多样化的媒介探索人性、自然与社会的深层联系。我的作品融合了传统技法与现代理念，希望通过独特的视觉语言与观众产生共鸣。",
            email: "linshilin.art@gmail.com",
            stats: {
                artworks: 50,
                exhibitions: 5,
                experience: 3
            }
        };
        
        this.setProfile(defaultProfile);
    }
    
    // 初始化多语言数据（从i18n.js移植）
    initializeI18n() {
        const defaultI18n = {
            zh: {
                'artist-name': '林士林',
                'nav-home': '首页',
                'nav-about': '关于',
                'nav-gallery': '作品',
                'nav-process': '创作',
                'nav-contact': '联系',
                'hero-line1': '创造',
                'hero-line2': '独特',
                'hero-line3': '艺术',
                'hero-subtitle': '探索色彩与形态的无限可能',
                'cta-button': '查看作品',
                'about-title': '关于艺术家',
                'about-subtitle': '艺术是连接有形世界与无形世界的桥梁',
                'about-intro': '我是一位专注于当代艺术创作的艺术家，致力于通过多样化的媒介探索人性、自然与社会的深层联系。我的作品融合了传统技法与现代理念，希望通过独特的视觉语言与观众产生共鸣。',
                'stat-artworks': '作品',
                'stat-exhibitions': '展览',
                'stat-experience': '年经验',
                'gallery-title': '作品集',
                'gallery-subtitle': '每一幅作品都是内心世界的投射',
                'filter-all': '全部',
                'filter-paintings': '绘画',
                'filter-digital': '数字艺术',
                'filter-sketches': '素描',
                'process-title': '创作过程',
                'process-subtitle': '从概念到成品的艺术之旅',
                'step1-title': '灵感捕捉',
                'step1-desc': '观察生活中的细节，收集色彩和形态的灵感',
                'step2-title': '概念构思',
                'step2-desc': '将抽象的想法转化为具体的视觉概念',
                'step3-title': '创作实现',
                'step3-desc': '运用各种技法和媒介将概念变为现实',
                'step4-title': '完善细节',
                'step4-desc': '精雕细琢，让每个细节都完美呈现',
                'contact-title': '联系我',
                'contact-subtitle': '让我们一起探讨艺术的无限可能',
                'contact-email': '邮箱',
                'contact-social': '社交媒体',
                'form-name': '您的姓名',
                'form-email': '邮箱地址',
                'form-message': '想说的话...',
                'form-submit': '发送消息',
                'copyright': '版权所有',
                'artwork-1-title': '抽象印象',
                'artwork-1-desc': '探索色彩与情感的深层连接，通过抽象的形式表达内心的感受。',
                'artwork-2-title': '数字梦境',
                'artwork-2-desc': '运用数字技术创造的超现实主义作品，展现梦境与现实的边界。',
                'artwork-3-title': '人物素描',
                'artwork-3-desc': '通过细腻的线条捕捉人物的神韵和情感表达。',
                'artwork-4-title': '风景写生',
                'artwork-4-desc': '自然风光的真实记录，展现大自然的美丽与宁静。',
                'artwork-5-title': '未来城市',
                'artwork-5-desc': '对未来城市景观的想象，融合科技与人文元素。',
                'artwork-6-title': '静物组合',
                'artwork-6-desc': '日常物品的艺术化表达，探索光影与形态的关系。',
                'modal-medium': '媒介',
                'modal-size': '尺寸',
                'modal-year': '年份'
            },
            en: {
                'artist-name': 'LIN SHILIN',
                'nav-home': 'Home',
                'nav-about': 'About',
                'nav-gallery': 'Gallery',
                'nav-process': 'Process',
                'nav-contact': 'Contact',
                'hero-line1': 'CREATE',
                'hero-line2': 'UNIQUE',
                'hero-line3': 'ART',
                'hero-subtitle': 'Exploring infinite possibilities of color and form',
                'cta-button': 'View Works',
                'about-title': 'About the Artist',
                'about-subtitle': 'Art is the bridge between the visible and invisible worlds',
                'about-intro': 'I am an artist dedicated to contemporary art creation, committed to exploring the deep connections between humanity, nature, and society through diverse media. My works blend traditional techniques with modern concepts, hoping to resonate with audiences through unique visual language.',
                'stat-artworks': 'Artworks',
                'stat-exhibitions': 'Exhibitions',
                'stat-experience': 'Years Experience',
                'gallery-title': 'Gallery',
                'gallery-subtitle': 'Every artwork is a projection of the inner world',
                'filter-all': 'All',
                'filter-paintings': 'Paintings',
                'filter-digital': 'Digital Art',
                'filter-sketches': 'Sketches',
                'process-title': 'Creative Process',
                'process-subtitle': 'The artistic journey from concept to completion',
                'step1-title': 'Inspiration Capture',
                'step1-desc': 'Observing details in life, collecting inspiration from colors and forms',
                'step2-title': 'Concept Development',
                'step2-desc': 'Transforming abstract ideas into concrete visual concepts',
                'step3-title': 'Creative Realization',
                'step3-desc': 'Using various techniques and media to bring concepts to reality',
                'step4-title': 'Detail Refinement',
                'step4-desc': 'Fine-tuning every detail to achieve perfect presentation',
                'contact-title': 'Contact Me',
                'contact-subtitle': 'Let\'s explore the infinite possibilities of art together',
                'contact-email': 'Email',
                'contact-social': 'Social Media',
                'form-name': 'Your Name',
                'form-email': 'Email Address',
                'form-message': 'Your Message...',
                'form-submit': 'Send Message',
                'copyright': 'All rights reserved',
                'artwork-1-title': 'Abstract Impression',
                'artwork-1-desc': 'Exploring the deep connection between color and emotion, expressing inner feelings through abstract forms.',
                'artwork-2-title': 'Digital Dreams',
                'artwork-2-desc': 'Surrealist works created using digital technology, revealing the boundaries between dreams and reality.',
                'artwork-3-title': 'Portrait Sketches',
                'artwork-3-desc': 'Capturing the spirit and emotional expression of characters through delicate lines.',
                'artwork-4-title': 'Landscape Painting',
                'artwork-4-desc': 'True records of natural scenery, showing the beauty and tranquility of nature.',
                'artwork-5-title': 'Future City',
                'artwork-5-desc': 'Imagination of future urban landscapes, integrating technology and humanistic elements.',
                'artwork-6-title': 'Still Life',
                'artwork-6-desc': 'Artistic expression of everyday objects, exploring the relationship between light and form.',
                'modal-medium': 'Medium',
                'modal-size': 'Size',
                'modal-year': 'Year'
            },
            ja: {
                'artist-name': 'リンシリン',
                'nav-home': 'ホーム',
                'nav-about': '紹介',
                'nav-gallery': '作品',
                'nav-process': '制作',
                'nav-contact': '連絡',
                'hero-line1': '創造',
                'hero-line2': 'ユニーク',
                'hero-line3': 'アート',
                'hero-subtitle': '色と形の無限の可能性を探求',
                'cta-button': '作品を見る',
                'about-title': 'アーティストについて',
                'about-subtitle': '芸術は見える世界と見えない世界を結ぶ橋です',
                'about-intro': '私は現代アート創作に専念するアーティストで、多様なメディアを通じて人間性、自然、社会の深いつながりを探求することに取り組んでいます。私の作品は伝統的な技法と現代的な概念を融合し、独特な視覚言語で観客との共鳴を希望しています。',
                'stat-artworks': '作品',
                'stat-exhibitions': '展示',
                'stat-experience': '年の経験',
                'gallery-title': 'ギャラリー',
                'gallery-subtitle': 'すべての作品は内面世界の投影です',
                'filter-all': 'すべて',
                'filter-paintings': '絵画',
                'filter-digital': 'デジタルアート',
                'filter-sketches': 'スケッチ',
                'process-title': '制作過程',
                'process-subtitle': 'コンセプトから完成品までのアートの旅',
                'step1-title': 'インスピレーション捕捉',
                'step1-desc': '生活の細部を観察し、色と形からインスピレーションを収集',
                'step2-title': 'コンセプト構想',
                'step2-desc': '抽象的なアイデアを具体的な視覚コンセプトに変換',
                'step3-title': '創作実現',
                'step3-desc': '様々な技法とメディアを使用してコンセプトを現実化',
                'step4-title': '詳細完善',
                'step4-desc': '細部まで磨き上げ、完璧な表現を実現',
                'contact-title': 'お問い合わせ',
                'contact-subtitle': '一緒にアートの無限の可能性を探求しましょう',
                'contact-email': 'メール',
                'contact-social': 'ソーシャルメディア',
                'form-name': 'お名前',
                'form-email': 'メールアドレス',
                'form-message': 'メッセージ...',
                'form-submit': 'メッセージを送る',
                'copyright': '全著作権所有',
                'artwork-1-title': '抽象印象',
                'artwork-1-desc': '色と感情の深いつながりを探求し、抽象的な形で内面の感情を表現。',
                'artwork-2-title': 'デジタル夢境',
                'artwork-2-desc': 'デジタル技術で創造したシュールレアリズム作品、夢と現実の境界を表現。',
                'artwork-3-title': '人物スケッチ',
                'artwork-3-desc': '繊細な線で人物の神韻と感情表現を捉える。',
                'artwork-4-title': '風景写生',
                'artwork-4-desc': '自然風光の真実な記録、自然の美しさと静寂を表現。',
                'artwork-5-title': '未来都市',
                'artwork-5-desc': '未来都市景観への想像、科学技術と人文要素の融合。',
                'artwork-6-title': '静物組合',
                'artwork-6-desc': '日常物品の芸術的表現、光と影と形の関係を探求。',
                'modal-medium': '媒体',
                'modal-size': 'サイズ',
                'modal-year': '年'
            }
        };
        
        this.setI18nData(defaultI18n);
    }
    
    // 初始化网站配置
    initializeSiteConfig() {
        const defaultConfig = {
            title: "林士林作品集 | LIN SHILIN Portfolio",
            description: "艺术家作品集 - 展示原创艺术作品与创作理念",
            lastUpdated: new Date().toISOString()
        };
        
        this.setSiteConfig(defaultConfig);
    }
    
    // 作品数据操作
    getArtworks() {
        const data = localStorage.getItem(this.storageKeys.artworks);
        return data ? JSON.parse(data) : [];
    }
    
    setArtworks(artworks) {
        localStorage.setItem(this.storageKeys.artworks, JSON.stringify(artworks));
        this.updateLastModified();
    }
    
    addArtwork(artwork) {
        const artworks = this.getArtworks();
        const maxId = artworks.reduce((max, item) => Math.max(max, item.id), 0);
        artwork.id = maxId + 1;
        artworks.push(artwork);
        this.setArtworks(artworks);
        return artwork;
    }
    
    updateArtwork(id, updatedArtwork) {
        const artworks = this.getArtworks();
        const index = artworks.findIndex(item => item.id === id);
        if (index !== -1) {
            artworks[index] = { ...artworks[index], ...updatedArtwork, id };
            this.setArtworks(artworks);
            return artworks[index];
        }
        return null;
    }
    
    deleteArtwork(id) {
        const artworks = this.getArtworks();
        const filteredArtworks = artworks.filter(item => item.id !== id);
        this.setArtworks(filteredArtworks);
        return filteredArtworks.length < artworks.length;
    }
    
    getArtworkById(id) {
        const artworks = this.getArtworks();
        return artworks.find(item => item.id === id);
    }
    
    // 个人信息操作
    getProfile() {
        const data = localStorage.getItem(this.storageKeys.profile);
        return data ? JSON.parse(data) : null;
    }
    
    setProfile(profile) {
        localStorage.setItem(this.storageKeys.profile, JSON.stringify(profile));
        this.updateLastModified();
    }
    
    updateProfile(updates) {
        const profile = this.getProfile();
        const updatedProfile = { ...profile, ...updates };
        this.setProfile(updatedProfile);
        return updatedProfile;
    }
    
    // 多语言数据操作
    getI18nData() {
        const data = localStorage.getItem(this.storageKeys.i18n);
        return data ? JSON.parse(data) : null;
    }
    
    setI18nData(i18nData) {
        localStorage.setItem(this.storageKeys.i18n, JSON.stringify(i18nData));
        this.updateLastModified();
    }
    
    updateI18nData(lang, key, value) {
        const i18nData = this.getI18nData();
        if (!i18nData[lang]) {
            i18nData[lang] = {};
        }
        i18nData[lang][key] = value;
        this.setI18nData(i18nData);
        return i18nData;
    }
    
    // 网站配置操作
    getSiteConfig() {
        const data = localStorage.getItem(this.storageKeys.siteConfig);
        return data ? JSON.parse(data) : null;
    }
    
    setSiteConfig(config) {
        localStorage.setItem(this.storageKeys.siteConfig, JSON.stringify(config));
        this.updateLastModified();
    }
    
    updateSiteConfig(updates) {
        const config = this.getSiteConfig();
        const updatedConfig = { ...config, ...updates };
        this.setSiteConfig(updatedConfig);
        return updatedConfig;
    }
    
    // 更新最后修改时间
    updateLastModified() {
        this.updateSiteConfig({ lastUpdated: new Date().toISOString() });
    }
    
    // 数据导出
    exportAllData() {
        const data = {
            artworks: this.getArtworks(),
            profile: this.getProfile(),
            i18n: this.getI18nData(),
            siteConfig: this.getSiteConfig(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    // 数据导入
    importAllData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.artworks) this.setArtworks(data.artworks);
            if (data.profile) this.setProfile(data.profile);
            if (data.i18n) this.setI18nData(data.i18n);
            if (data.siteConfig) this.setSiteConfig(data.siteConfig);
            
            this.updateLastModified();
            return true;
        } catch (error) {
            console.error('数据导入失败:', error);
            return false;
        }
    }
    
    // 重置所有数据
    resetAllData() {
        localStorage.removeItem(this.storageKeys.artworks);
        localStorage.removeItem(this.storageKeys.profile);
        localStorage.removeItem(this.storageKeys.i18n);
        localStorage.removeItem(this.storageKeys.siteConfig);
        
        this.initializeData();
    }
    
    // 获取统计信息
    getStatistics() {
        const artworks = this.getArtworks();
        const stats = {
            totalArtworks: artworks.length,
            paintings: artworks.filter(a => a.category === 'paintings').length,
            digital: artworks.filter(a => a.category === 'digital').length,
            sketches: artworks.filter(a => a.category === 'sketches').length,
            lastUpdated: this.getSiteConfig()?.lastUpdated || '未知'
        };
        
        return stats;
    }
}

// 创建全局数据管理器实例
const dataManager = new DataManager();