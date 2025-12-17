# Quick Deploy to Cloudflare Pages

## ✅ Build Complete!

Your static site has been built successfully in the `dist/` folder:
- ✅ 40 HTML pages
- ✅ 6 broker detail pages  
- ✅ 26 blog post pages
- ✅ All static assets (CSS, JS, images)
- ✅ Sitemap.xml
- ✅ _redirects file

## 🚀 Deploy Now (3 Steps)

### Step 1: Get Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Click **"Edit Cloudflare Workers"** template (or create custom token with these permissions):
   - Account: Cloudflare Pages:Edit
   - Zone: (optional, if using custom domain)
4. Click **"Continue to summary"** → **"Create Token"**
5. **Copy the token** (you won't see it again!)

### Step 2: Set Token and Deploy

Run these commands:

```bash
export CLOUDFLARE_API_TOKEN=your-token-here
npm run deploy
```

Or in one line:
```bash
CLOUDFLARE_API_TOKEN=your-token-here npm run deploy
```

### Step 3: Verify Deployment

After deployment, wrangler will show you:
- ✅ Deployment URL (e.g., `https://brokersconfiables.pages.dev`)
- ✅ Deployment status

Visit the URL to verify everything works!

## 🔄 Future Deployments

Once deployed, you can deploy updates anytime:

```bash
npm run deploy
```

Or if you need to set the token again:
```bash
CLOUDFLARE_API_TOKEN=your-token-here npm run deploy
```

## 📝 Alternative: Git-based Auto-Deploy

For automatic deployments on every push:

1. Initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub/GitLab

3. In Cloudflare Dashboard:
   - Go to Pages → Create Project
   - Connect your repository
   - Set build command: `npm run build:static`
   - Set output directory: `dist`
   - Deploy!

## 🎯 Current Status

- ✅ Site built: `dist/` folder ready
- ✅ Wrangler installed: Ready to deploy
- ⏳ Waiting for: Cloudflare API token

**Next:** Get your API token and run `npm run deploy`

