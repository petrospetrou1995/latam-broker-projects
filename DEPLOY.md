# Deploy to Cloudflare Pages

## Quick Deployment

### Option 1: Using Wrangler CLI (Recommended)

1. **Authenticate with Cloudflare:**
   ```bash
   npx wrangler login
   ```
   This will open a browser window. Log in to your Cloudflare account and authorize Wrangler.

2. **Deploy:**
   ```bash
   npm run deploy
   ```
   Or manually:
   ```bash
   npm run build:static
   npx wrangler pages deploy dist --project-name=brokersconfiables
   ```

### Option 2: Using Cloudflare API Token

1. **Create API Token:**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Add "Cloudflare Pages" permissions
   - Copy the token

2. **Set environment variable:**
   ```bash
   export CLOUDFLARE_API_TOKEN=your-token-here
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 3: Git-based Deployment (Automatic)

1. **Initialize git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Connect to GitHub/GitLab:**
   - Push to your repository
   - Connect repository in Cloudflare Pages dashboard
   - Cloudflare will auto-deploy on every push

## Build Output

The build process creates a `dist/` folder with:
- All HTML pages (40 pages)
- Static assets (CSS, JS, images)
- Broker detail pages (6 brokers)
- Blog post pages (26 posts)
- Sitemap.xml
- _redirects file for URL routing

## Project Configuration

- **Project Name:** brokersconfiables
- **Build Command:** `npm run build:static`
- **Output Directory:** `dist`
- **Framework:** Static

## Verification

After deployment, verify:
- ✅ Site loads at your Cloudflare Pages URL
- ✅ All pages are accessible
- ✅ Images and assets load correctly
- ✅ Language switching works
- ✅ Broker detail pages work
- ✅ Blog posts load correctly

