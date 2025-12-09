#!/bin/bash

# Script to deploy all projects to Cloudflare Pages
# Requires: wrangler CLI installed and logged in

GITHUB_REPO="petrospetrou1995/latam-broker-projects"
BASE_DIR="/Users/petrospetrou/latam-projects-combined"

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

echo "🚀 Deploying all projects to Cloudflare Pages..."
echo ""

cd "$BASE_DIR" || exit 1

for project in "${projects[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Deploying: $project"
    echo ""
    
    if [ ! -d "$project" ]; then
        echo "⚠️  Project directory not found: $project"
        continue
    fi
    
    cd "$project" || continue
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install --silent
    
    # Build project
    echo "🔨 Building project..."
    if npm run build:static; then
        echo "✅ Build successful"
        
        # Deploy to Cloudflare Pages
        echo "🚀 Deploying to Cloudflare Pages..."
        if wrangler pages deploy dist --project-name="$project" 2>/dev/null; then
            echo "✅ Successfully deployed: $project"
        else
            echo "⚠️  Deployment failed or project doesn't exist in Cloudflare"
            echo "   Create project in Cloudflare Dashboard first:"
            echo "   https://dash.cloudflare.com/"
            echo "   Project name: $project"
            echo "   Root directory: $project"
        fi
    else
        echo "❌ Build failed for: $project"
    fi
    
    cd "$BASE_DIR" || exit 1
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Deployment process completed!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Cloudflare Dashboard: https://dash.cloudflare.com/"
echo "2. Navigate to Pages"
echo "3. Create projects for any that failed"
echo "4. Configure root directory for each project"
echo ""

