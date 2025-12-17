# Static Website Deployment

Your website can now be deployed as a **static website** without requiring Node.js or MongoDB!

## 🚀 Quick Start

### Build Static Site
```bash
npm run build:static
```

This creates a `dist/` folder with all static files ready for deployment.

### Test Locally
```bash
npm run serve:static
```

Then visit `http://localhost:3000` (or the port shown)

## 📦 What's Included

The static build includes:
- ✅ All HTML pages
- ✅ All CSS, JavaScript, and images
- ✅ Broker data as JSON (`public/data/brokers.json`)
- ✅ Reviews data as JSON (`public/data/reviews.json`)
- ✅ Static sitemap.xml
- ✅ Broker detail pages
- ✅ Routing configuration files

## 🌐 Deployment Options

### Cloudflare Pages
1. Go to Cloudflare Pages dashboard
2. Connect your GitHub repository
3. **Build command:** `npm run build:static`
4. **Output directory:** `dist`
5. **Root directory:** `/` (leave empty)
6. Deploy!

### Netlify
1. Connect your GitHub repository
2. **Build command:** `npm run build:static`
3. **Publish directory:** `dist`
4. Deploy!

### GitHub Pages
1. Run `npm run build:static`
2. Copy contents of `dist/` to `docs/` folder
3. Enable GitHub Pages in repository settings
4. Set source to `docs/` folder

### Vercel
1. Import your repository
2. **Build command:** `npm run build:static`
3. **Output directory:** `dist`
4. **Framework preset:** Other
5. Deploy!

## ⚙️ How It Works

### Dynamic → Static Conversion

**Before (Dynamic):**
- Brokers loaded from MongoDB via `/api/brokers`
- Reviews loaded from MongoDB via `/api/reviews`
- Requires Node.js server

**After (Static):**
- Brokers loaded from `/public/data/brokers.json`
- Reviews loaded from `/public/data/reviews.json`
- No server required!

### JavaScript Changes

The build process:
1. Generates JSON files from your MongoDB database
2. Updates HTML files to use static paths
3. Includes `static-brokers.js` which loads data from JSON instead of API

## 📝 Updating Content

To update broker/review data:
1. Update your MongoDB database
2. Run `npm run build:static` again
3. Redeploy the `dist` folder

## ⚠️ Limitations

Static version does NOT include:
- ❌ Admin panel (requires server)
- ❌ User authentication
- ❌ Real-time updates
- ❌ API endpoints

Everything else works exactly the same!

## 🔧 Troubleshooting

### Build fails without database
The build will still work but won't include broker/review data. Set `MONGODB_URI` in `.env` file.

### JavaScript errors
Make sure `static-brokers.js` is loaded before `brokers.js` in your HTML files.

### Path issues
All paths are automatically updated during build. If you see 404s, check that paths start with `/public/`.


