# Aashman Saini — Portfolio

A high-performance, dark-themed AI/ML engineering portfolio built with **Next.js**, **Three.js**, and **Framer Motion**.

## ✨ Features

- Interactive 3D neural-network background (Three.js) with mouse-repulsion
- Scroll-driven animations via Framer Motion
- Glassmorphism UI with magnetic buttons and glow effects
- Fully responsive — mobile, tablet, and desktop
- Accessible: skip-to-content link, semantic HTML, ARIA labels
- SEO-optimised: meta tags, OG tags, Twitter Card

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| UI Animations | Framer Motion 12 |
| 3D Background | Three.js |
| Styling | Vanilla CSS |
| Language | JavaScript (React 19) |

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20.9.0
- npm ≥ 10

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
├── components/
│   ├── AdvancedTimeline.js   # Scroll-driven experience timeline
│   ├── GlowCard.js           # Card with mouse-tracking glow effect
│   ├── MagneticButton.js     # Button with magnetic hover pull
│   ├── Navbar.js             # Fixed pill-style navigation bar
│   ├── ScrollReveal.js       # Viewport-triggered reveal wrapper
│   ├── SkillsGrid.js         # Skills categorised in a 4-column grid
│   └── ThreeDScene.js        # Three.js animated node network
├── pages/
│   ├── _app.js               # Global font & CSS provider
│   ├── _document.js          # HTML shell with SEO meta tags
│   └── index.js              # Single-page portfolio
├── public/
│   └── Aashman_Saini_Resume.pdf
└── styles/
    └── global.css            # Design system & all component styles
```

## 🌐 Deployment

This project is optimised for deployment on **Vercel**:

```bash
npx vercel --prod
```

Or connect the GitHub repository to your Vercel dashboard for automatic deployments.

## 📄 License

© 2026 Aashman Saini. All rights reserved.
