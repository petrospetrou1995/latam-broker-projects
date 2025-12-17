# Cloudflare Pages Deployment Guide

## Deploy Each Project Separately to Cloudflare Pages

This guide explains how to deploy all 10 projects from the same GitHub repository to separate Cloudflare Pages sites.

## Method 1: Using Cloudflare Dashboard (Recommended)

### Step 1: Access Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project**

### Step 2: Connect GitHub Repository

1. Select **Connect to Git**
2. Authorize Cloudflare to access your GitHub account
3. Select repository: `petrospetrou1995/latam-broker-projects`

### Step 3: Configure Each Project

For **each of the 10 projects**, repeat these steps:

#### Project Configuration:

**Project name**: `[project-name]` (e.g., `rankingbrokerslatam`)

**Production branch**: `main`

**Build settings**:
- **Framework preset**: None (or Static)
- **Build command**: `cd [project-folder] && npm install && npm run build:static`
- **Build output directory**: `[project-folder]/dist`

**Root directory**: `[project-folder]` (e.g., `rankingbrokerslatam`)

### Step 4: Environment Variables (if needed)

Add any environment variables your project needs in the **Environment variables** section.

### Step 5: Deploy

Click **Save and Deploy**. Cloudflare will build and deploy your project.

---

## Method 2: Using Wrangler CLI (Advanced)

### Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

### Deploy Each Project

For each project, create a deployment script:

```bash
# Example for rankingbrokerslatam
cd rankingbrokerslatam
npm install
npm run build:static
wrangler pages deploy dist --project-name=rankingbrokerslatam
```

---

## Detailed Configuration for Each Project

### 1. RankingBrokersLatam

- **Project name**: `rankingbrokerslatam`
- **Root directory**: `rankingbrokerslatam`
- **Build command**: `cd rankingbrokerslatam && npm install && npm run build:static`
- **Build output**: `rankingbrokerslatam/dist`
- **Custom domain**: `rankingbrokerslatam.com` (optional)

### 2. InversionistaDigital

- **Project name**: `inversionistadigital`
- **Root directory**: `inversionistadigital`
- **Build command**: `cd inversionistadigital && npm install && npm run build:static`
- **Build output**: `inversionistadigital/dist`
- **Custom domain**: `inversionistadigital.net` (optional)

### 3. ZonaTradingLatam

- **Project name**: `zonatradinglatam`
- **Root directory**: `zonatradinglatam`
- **Build command**: `cd zonatradinglatam && npm install && npm run build:static`
- **Build output**: `zonatradinglatam/dist`
- **Custom domain**: `zonatradinglatam.com` (optional)

### 4. BrokersConfiables

- **Project name**: `brokersconfiables`
- **Root directory**: `brokersconfiables`
- **Build command**: `cd brokersconfiables && npm install && npm run build:static`
- **Build output**: `brokersconfiables/dist`
- **Custom domain**: `brokersconfiables.com` (optional)

### 5. RutaDeTrading

- **Project name**: `rutadetrading`
- **Root directory**: `rutadetrading`
- **Build command**: `cd rutadetrading && npm install && npm run build:static`
- **Build output**: `rutadetrading/dist`
- **Custom domain**: `rutadetrading.com` (optional)

### 6. ComparativaForex

- **Project name**: `comparativaforex`
- **Root directory**: `comparativaforex`
- **Build command**: `cd comparativaforex && npm install && npm run build:static`
- **Build output**: `comparativaforex/dist`
- **Custom domain**: `comparativaforex.com` (optional)

### 7. PlataformasDeInversion

- **Project name**: `plataformasdeinversion`
- **Root directory**: `plataformasdeinversion`
- **Build command**: `cd plataformasdeinversion && npm install && npm run build:static`
- **Build output**: `plataformasdeinversion/dist`
- **Custom domain**: `plataformasdeinversion.com` (optional)

### 8. GuiadeBrokersSudamerica

- **Project name**: `guiadebrokerssudamerica`
- **Root directory**: `guiadebrokerssudamerica`
- **Build command**: `cd guiadebrokerssudamerica && npm install && npm run build:static`
- **Build output**: `guiadebrokerssudamerica/dist`
- **Custom domain**: `guiadebrokerssudamerica.com` (optional)

### 9. TopBrokersMexicoYMas

- **Project name**: `topbrokersmexicoymas`
- **Root directory**: `topbrokersmexicoymas`
- **Build command**: `cd topbrokersmexicoymas && npm install && npm run build:static`
- **Build output**: `topbrokersmexicoymas/dist`
- **Custom domain**: `topbrokersmexicoymas.com` (optional)

### 10. CapitalLatamReviews

- **Project name**: `capitallatamreviews`
- **Root directory**: `capitallatamreviews`
- **Build command**: `cd capitallatamreviews && npm install && npm run build:static`
- **Build output**: `capitallatamreviews/dist`
- **Custom domain**: `capitallatamreviews.com` (optional)

---

## Quick Setup Script

Create a script to deploy all projects:

```bash
#!/bin/bash

projects=(
    "rankingbrokerslatam"
    "inversionistadigital"
    "zonatradinglatam"
    "brokersconfiables"
    "rutadetrading"
    "comparativaforex"
    "plataformasdeinversion"
    "guiadebrokerssudamerica"
    "topbrokersmexicoymas"
    "capitallatamreviews"
)

for project in "${projects[@]}"; do
    echo "Deploying $project..."
    cd "$project"
    npm install
    npm run build:static
    wrangler pages deploy dist --project-name="$project"
    cd ..
done
```

---

## Important Notes

### Build Configuration

Each project's `cloudflare-pages.json` should be configured correctly. If not present, Cloudflare will use the build settings you configure in the dashboard.

### Root Directory Setting

**Critical**: Set the **Root directory** to the project folder name. This tells Cloudflare where to find the `package.json` and build files for each project.

### Build Output

All projects use `npm run build:static` which outputs to the `dist` folder within each project directory.

### Custom Domains

After deployment, you can add custom domains:
1. Go to your project in Cloudflare Pages
2. Navigate to **Custom domains**
3. Add your domain (e.g., `rankingbrokerslatam.com`)
4. Follow DNS setup instructions

### Environment Variables

If your projects need environment variables:
1. Go to project settings
2. Navigate to **Environment variables**
3. Add variables for Production, Preview, and Development environments

---

## Troubleshooting

### Build Fails

- Check that `package.json` exists in the project folder
- Verify `npm run build:static` works locally
- Check build logs in Cloudflare dashboard

### Wrong Files Deployed

- Verify **Root directory** is set correctly
- Ensure **Build output directory** points to `dist` folder
- Check that build command changes to project directory first

### 404 Errors

- Verify `_redirects` file exists in `dist` folder
- Check `_headers` file configuration
- Ensure all static files are in `dist` folder

---

## Deployment URLs

After deployment, each project will have a URL like:
- `https://rankingbrokerslatam.pages.dev`
- `https://inversionistadigital.pages.dev`
- `https://zonatradinglatam.pages.dev`
- etc.

You can customize these in project settings.

