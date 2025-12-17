# Broker Logos Directory

This directory is for storing broker logo images.

## Logo Requirements

- **Format**: PNG, SVG, or JPG
- **Size**: Recommended 64x64px to 128x128px
- **Naming**: Use broker slug (e.g., `libertex.png`, `xm-group.png`)

## How to Add Logos

1. Save logo image files in this directory using the broker's slug as the filename
2. Update the broker's `logo` field in the database to the filename (e.g., `libertex.png`)
3. Or use absolute URLs in the `logo` field (e.g., `https://example.com/logo.png`)

## Fallback Behavior

If no logo is found:
- The system will try to fetch favicon.ico from the broker's website
- If that fails, it will display a category-based icon
- Icons are automatically assigned based on broker category (Forex, Crypto, Stocks, etc.)



