# Artist Portfolio Website

A modern, responsive artist portfolio website showcasing artwork and creative philosophy.

## 🌐 Live Demo

**[View Portfolio](https://kkailab.github.io/LIN-SHILIN-portfolio/)**

## 🎨 Features

- **Responsive Design** - Adapts to all devices and screen sizes
- **Modern Interface** - Clean and elegant design aesthetic
- **Artwork Gallery** - Portfolio with category filtering
- **Interactive Animations** - Smooth page transitions and effects
- **Contact Form** - Easy way for visitors to reach out
- **SEO Optimized** - Search engine friendly structure

## 📁 Project Structure

```
artist-portfolio/
├── index.html          # Main page
├── css/
│   └── style.css       # Stylesheet
├── js/
│   └── main.js         # JavaScript interactions
├── images/             # Image assets
├── assets/             # Other resource files
└── README.md           # Project documentation
```

## 🚀 Quick Start

1. **Clone the Project**
   ```bash
   git clone https://github.com/KKAIlab/LIN-SHILIN-portfolio.git
   cd LIN-SHILIN-portfolio
   ```

2. **Local Preview**
   - Run with any static server
   - Or simply open `index.html` in your browser

3. **Customize Content**
   - Modify personal information in `index.html`
   - Replace images in the `images/` folder
   - Update artwork data (in the `artworks` array in `js/main.js`)

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Google Fonts** - Beautiful typography
- **Unsplash API** - Sample images (replace with actual artwork)

## 📝 Customization Guide

### 1. Personal Information
Edit in `index.html`:
- Artist name
- Bio/About section
- Contact information
- Social media links

### 2. Artwork Data
Add your artworks in the `artworks` array in `js/main.js`:

```javascript
{
    id: 1,
    title: "Artwork Title",
    category: "paintings", // paintings, digital, sketches
    image: "path/to/image.jpg",
    description: "Artwork description",
    details: {
        medium: "Medium used",
        size: "Dimensions",
        year: "Year created"
    }
}
```

### 3. Style Customization
Modify in `css/style.css`:
- Color theme (`:root` variables)
- Font selection
- Animation effects
- Layout styles

### 4. Contact Form
Currently uses simulated submission. For real functionality, integrate:
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://www.netlify.com/products/forms/)
- [EmailJS](https://www.emailjs.com/)

## 🌐 Deployment

### GitHub Pages
1. Create a GitHub repository
2. Push code to the repository
3. Enable GitHub Pages in repository settings
4. Select `main` branch as source

### Netlify
1. Connect GitHub repository to Netlify
2. Automatic deployment with CDN acceleration

### Vercel
1. Import GitHub repository to Vercel
2. Automatic deployment with global CDN

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🎯 Performance Optimization

- Image lazy loading
- CSS/JS code optimization
- Animation performance tuning
- Responsive images
- Critical resource preloading

## 📄 License

MIT License - Free to use and modify

## 💡 Contributing

Issues and Pull Requests are welcome!

## 📞 Support

For questions, contact via:
- GitHub Issues: https://github.com/KKAIlab/LIN-SHILIN-portfolio/issues
- Website: https://kkailab.github.io/LIN-SHILIN-portfolio/

---

⭐ If this project helps you, please give it a Star!
