# Cloudflare Pages Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Choose **GitHub** and authorize Cloudflare
5. Select repository: `petrospetrou1995/LatamBrokerReviewes`
6. Click **Begin setup**

### 2. Configure Build Settings

**Project name:** `latam-broker-reviews` (or your preferred name)

**Build settings:**
- **Framework preset:** None (or Static)
- **Build command:** `npm run build:static`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty)
- **Node version:** `18` (or latest)

### 3. Environment Variables

Add these environment variables in Cloudflare Pages settings:

```
MONGODB_URI=your-mongodb-connection-string
```

**Note:** The MongoDB connection is only needed during the build process to generate broker and review data. The final site is fully static.

### 4. Deploy

1. Click **Save and Deploy**
2. Cloudflare will automatically:
   - Install dependencies (`npm install`)
   - Run build command (`npm run build:static`)
   - Deploy the `dist` folder
   - Set up automatic deployments on every push to `main` branch

### 5. Custom Domain (Optional)

1. Go to **Custom domains** in your Pages project
2. Add your domain
3. Follow DNS configuration instructions
4. Cloudflare will automatically set up SSL

## 📋 Build Process

The build process:
1. Connects to MongoDB to fetch broker and review data
2. Generates static JSON files (`brokers.json`, `reviews.json`)
3. Copies all HTML files from `views/` to `dist/`
4. Copies all static assets (CSS, JS, images) to `dist/public/`
5. Generates `sitemap.xml`
6. Creates individual broker detail pages
7. Copies `_redirects` file for URL routing

## 🔄 Automatic Deployments

Cloudflare Pages automatically deploys on:
- Every push to `main` branch
- Every pull request (creates preview deployment)

## 📁 File Structure After Build

```
dist/
├── index.html
├── brokers.html
├── reviews.html
├── broker/
│   ├── libertex.html
│   ├── xm-group.html
│   └── ...
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── data/
│       ├── brokers.json
│       └── reviews.json
├── sitemap.xml
└── _redirects
```

## 🔗 URL Routing

The `_redirects` file handles:
- `/broker/:slug` → `/broker/:slug.html`
- `/blog/:slug` → `/blog/:slug.html`
- Root redirects to `/index.html`

## ✨ Features Deployed

- ✅ 48 hardcoded reviews with Spanish/English translations
- ✅ 6 brokers with full details
- ✅ Mobile-responsive design
- ✅ Language switching (ES/EN)
- ✅ SEO optimized (meta tags, structured data, sitemap)
- ✅ Fast static site (no server needed)

## 🐛 Troubleshooting

### Build Fails

1. Check build logs in Cloudflare Dashboard
2. Verify MongoDB connection string is correct
3. Ensure Node.js version is 18 or higher
4. Check that all dependencies are in `package.json`

### Pages Not Loading

1. Verify `_redirects` file is in `dist/` folder
2. Check that HTML files have `.html` extension
3. Verify build output directory is `dist`

### Reviews Not Showing

1. Check browser console for errors
2. Verify `languages.js` is loaded correctly
3. Check that reviews data structure is correct

## 📊 Performance

Cloudflare Pages provides:
- Global CDN distribution
- Automatic SSL certificates
- DDoS protection
- Fast page loads worldwide
- Free tier includes 500 builds/month

## 🔐 Security

- All static files are served securely
- No server-side code execution
- Content Security Policy headers
- HTTPS enforced

---

**Deployment Status:** ✅ Ready for Cloudflare Pages

**Last Updated:** After converting reviews to hardcoded format with translations


