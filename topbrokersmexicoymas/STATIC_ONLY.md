# Static Website Only

This project has been converted to a **static website only**. All Express.js server code has been removed.

## What Was Removed

- ❌ `server.js` - Express server (backed up as `server.js.backup`)
- ❌ `routes/` - API routes folder
- ❌ Express dependencies (express, express-session, cors, helmet, etc.)
- ❌ Authentication dependencies (bcryptjs, jsonwebtoken)
- ❌ Server-related scripts (`start`, `dev`)

## What Remains

- ✅ `build-static.js` - Static site build script
- ✅ `models/` - Mongoose models (needed for build script)
- ✅ `views/` - HTML templates
- ✅ `public/` - Static assets (CSS, JS, images)
- ✅ `package.json` - Updated with only static build dependencies

## Dependencies

Only these dependencies remain (needed for the build script):
- `mongoose` - To connect to MongoDB and export data
- `dotenv` - To load environment variables

## Build Process

1. **Build static site:**
   ```bash
   npm run build:static
   ```

2. **Test locally:**
   ```bash
   npm run serve:static
   ```

3. **Deploy `dist/` folder** to static hosting

## Note

The build script (`build-static.js`) still needs MongoDB connection to generate broker/review JSON files. If you don't have MongoDB, you can manually create:
- `public/data/brokers.json`
- `public/data/reviews.json`

The build will still work without MongoDB, but won't include broker/review data.


