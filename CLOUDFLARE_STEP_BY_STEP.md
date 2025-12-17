# Step-by-Step Cloudflare Pages Deployment

## Quick Start Guide

### Prerequisites
- Cloudflare account (free tier works)
- GitHub repository: `petrospetrou1995/latam-broker-projects`

---

## Step 1: Access Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Log in to your Cloudflare account
3. Click **Pages** in the left sidebar
4. Click **Create a project**

---

## Step 2: Connect GitHub Repository

1. Click **Connect to Git**
2. Authorize Cloudflare to access your GitHub account (if not already done)
3. Select repository: **latam-broker-projects**
4. Click **Begin setup**

---

## Step 3: Configure First Project (RankingBrokersLatam)

### Basic Settings:
- **Project name**: `rankingbrokerslatam`
- **Production branch**: `main`

### Build Settings:
- **Framework preset**: Select **None** or **Static**
- **Build command**: 
  ```
  cd rankingbrokerslatam && npm install && npm run build:static
  ```
- **Build output directory**: 
  ```
  rankingbrokerslatam/dist
  ```

### Advanced Settings:
- Click **Show advanced**
- **Root directory**: `rankingbrokerslatam`

### Deploy:
- Click **Save and Deploy**
- Wait for build to complete (2-5 minutes)

---

## Step 4: Repeat for Remaining 9 Projects

For each project, create a **new project** in Cloudflare Pages with these settings:

### Project 2: InversionistaDigital
- **Project name**: `inversionistadigital`
- **Root directory**: `inversionistadigital`
- **Build command**: `cd inversionistadigital && npm install && npm run build:static`
- **Build output**: `inversionistadigital/dist`

### Project 3: ZonaTradingLatam
- **Project name**: `zonatradinglatam`
- **Root directory**: `zonatradinglatam`
- **Build command**: `cd zonatradinglatam && npm install && npm run build:static`
- **Build output**: `zonatradinglatam/dist`

### Project 4: BrokersConfiables
- **Project name**: `brokersconfiables`
- **Root directory**: `brokersconfiables`
- **Build command**: `cd brokersconfiables && npm install && npm run build:static`
- **Build output**: `brokersconfiables/dist`

### Project 5: RutaDeTrading
- **Project name**: `rutadetrading`
- **Root directory**: `rutadetrading`
- **Build command**: `cd rutadetrading && npm install && npm run build:static`
- **Build output**: `rutadetrading/dist`

### Project 6: ComparativaForex
- **Project name**: `comparativaforex`
- **Root directory**: `comparativaforex`
- **Build command**: `cd comparativaforex && npm install && npm run build:static`
- **Build output**: `comparativaforex/dist`

### Project 7: PlataformasDeInversion
- **Project name**: `plataformasdeinversion`
- **Root directory**: `plataformasdeinversion`
- **Build command**: `cd plataformasdeinversion && npm install && npm run build:static`
- **Build output**: `plataformasdeinversion/dist`

### Project 8: GuiadeBrokersSudamerica
- **Project name**: `guiadebrokerssudamerica`
- **Root directory**: `guiadebrokerssudamerica`
- **Build command**: `cd guiadebrokerssudamerica && npm install && npm run build:static`
- **Build output**: `guiadebrokerssudamerica/dist`

### Project 9: TopBrokersMexicoYMas
- **Project name**: `topbrokersmexicoymas`
- **Root directory**: `topbrokersmexicoymas`
- **Build command**: `cd topbrokersmexicoymas && npm install && npm run build:static`
- **Build output**: `topbrokersmexicoymas/dist`

### Project 10: CapitalLatamReviews
- **Project name**: `capitallatamreviews`
- **Root directory**: `capitallatamreviews`
- **Build command**: `cd capitallatamreviews && npm install && npm run build:static`
- **Build output**: `capitallatamreviews/dist`

---

## Step 5: Verify Deployments

After each deployment:
1. Check build logs for errors
2. Visit the preview URL (e.g., `https://rankingbrokerslatam.pages.dev`)
3. Verify the site loads correctly
4. Check that theme colors are applied

---

## Step 6: Add Custom Domains (Optional)

For each project:
1. Go to project settings
2. Click **Custom domains**
3. Add your domain (e.g., `rankingbrokerslatam.com`)
4. Follow DNS setup instructions
5. Wait for DNS propagation (5-30 minutes)

---

## Important Configuration Notes

### Root Directory is Critical
The **Root directory** setting tells Cloudflare where to find:
- `package.json` (for npm install)
- Build scripts
- Source files

**Without this**, Cloudflare won't know which project to build!

### Build Command Format
Always use:
```
cd [project-folder] && npm install && npm run build:static
```

This ensures:
1. We change to the project directory
2. Install dependencies in that directory
3. Run the build script from that directory

### Build Output
Always set to:
```
[project-folder]/dist
```

This is where the built static files are located.

---

## Troubleshooting

### Build Fails: "Cannot find package.json"
- **Solution**: Check that **Root directory** is set to the project folder name

### Build Fails: "Command not found"
- **Solution**: Ensure build command includes `cd` to project directory

### Wrong Project Deployed
- **Solution**: Verify **Root directory** matches the project folder name

### 404 Errors on Pages
- **Solution**: Check that `_redirects` file exists in `dist` folder
- Verify `_headers` file is present

### Theme Not Applied
- **Solution**: Verify `public/css/theme.css` exists and is included in build
- Check that `index.html` includes theme.css link

---

## Quick Reference: All Projects

| Project | Root Dir | Build Output |
|---------|----------|--------------|
| RankingBrokersLatam | `rankingbrokerslatam` | `rankingbrokerslatam/dist` |
| InversionistaDigital | `inversionistadigital` | `inversionistadigital/dist` |
| ZonaTradingLatam | `zonatradinglatam` | `zonatradinglatam/dist` |
| BrokersConfiables | `brokersconfiables` | `brokersconfiables/dist` |
| RutaDeTrading | `rutadetrading` | `rutadetrading/dist` |
| ComparativaForex | `comparativaforex` | `comparativaforex/dist` |
| PlataformasDeInversion | `plataformasdeinversion` | `plataformasdeinversion/dist` |
| GuiadeBrokersSudamerica | `guiadebrokerssudamerica` | `guiadebrokerssudamerica/dist` |
| TopBrokersMexicoYMas | `topbrokersmexicoymas` | `topbrokersmexicoymas/dist` |
| CapitalLatamReviews | `capitallatamreviews` | `capitallatamreviews/dist` |

---

## After Deployment

Each project will have:
- ✅ Unique Cloudflare Pages URL
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Custom domain support
- ✅ SSL certificates (automatic)
- ✅ Global CDN distribution

---

## Need Help?

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Build Logs: Check in Cloudflare Dashboard → Pages → [Project] → Deployments
- Support: Cloudflare Community Forums

