# Static Website Build Guide

This guide explains how to build and deploy your website as a static site (no Node.js server required).

## Quick Start

1. **Build the static site:**
   ```bash
   npm run build:static
   ```

2. **Test locally:**
   ```bash
   npm run serve:static
   ```

3. **Deploy the `dist` folder** to any static hosting:
   - Cloudflare Pages
   - Netlify
   - GitHub Pages
   - Vercel (static mode)
   - Any web server

## What Gets Built

The build process:
- ✅ Copies all HTML files from `views/` to `dist/`
- ✅ Copies all static assets (CSS, JS, images) to `dist/public/`
- ✅ Generates `brokers.json` and `reviews.json` from MongoDB
- ✅ Creates static `sitemap.xml`
- ✅ Generates broker detail pages
- ✅ Creates `_redirects` and `.htaccess` for routing

## Build Output

```
dist/
├── index.html
├── brokers.html
├── blog.html
├── ... (all HTML pages)
├── broker/
│   ├── libertex.html
│   ├── etoro.html
│   └── ... (broker detail pages)
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── data/
│       ├── brokers.json
│       └── reviews.json
├── sitemap.xml
├── _redirects
└── .htaccess
```

## Deployment Options

### Cloudflare Pages
- **Build command:** `npm run build:static`
- **Output directory:** `dist`
- **Root directory:** `/` (leave empty)

### Netlify
- **Build command:** `npm run build:static`
- **Publish directory:** `dist`
- **Redirects:** Already included in `_redirects`

### GitHub Pages
1. Build: `npm run build:static`
2. Copy `dist` contents to `docs/` folder
3. Enable GitHub Pages in repo settings
4. Set source to `docs/` folder

### Vercel
- **Build command:** `npm run build:static`
- **Output directory:** `dist`
- **Framework preset:** Other

## Important Notes

### Dynamic Features Removed
- ❌ Admin panel (requires server)
- ❌ API endpoints (replaced with JSON files)
- ❌ Real-time broker/review updates
- ❌ User authentication

### Static Features Work
- ✅ All HTML pages
- ✅ Blog posts
- ✅ Language switching
- ✅ Broker listings (from JSON)
- ✅ Reviews (from JSON)
- ✅ All navigation

## Updating Content

To update broker/review data:
1. Update MongoDB database
2. Run `npm run build:static` again
3. Redeploy the `dist` folder

## Troubleshooting

### Build fails without database
The build will still work but won't include broker/review data. You can:
- Set `MONGODB_URI` in `.env` file
- Or manually create `public/data/brokers.json` and `reviews.json`

### JavaScript errors
Make sure to include `static-brokers.js` in your HTML files when using static mode:
```html
<script src="/public/js/static-brokers.js"></script>
```

### Routing issues
The build includes `_redirects` (Netlify) and `.htaccess` (Apache) files for client-side routing.


