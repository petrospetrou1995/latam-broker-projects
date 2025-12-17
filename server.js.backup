const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "https://i.ytimg.com", "https://i1.ytimg.com", "https://i2.ytimg.com", "https://i3.ytimg.com", "https://i4.ytimg.com", "https://logo.clearbit.com"],
            fontSrc: ["'self'", "https:", "data:"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
            mediaSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));
app.use(cors());

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static files and in development
    return req.path.startsWith('/css/') || 
           req.path.startsWith('/js/') || 
           req.path.startsWith('/images/') ||
           req.path.startsWith('/uploads/') ||
           process.env.NODE_ENV === 'development';
  }
});

// Apply rate limiting only to API routes
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'latam-broker-reviews-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latam-broker-reviews', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/brokers', require('./routes/brokers'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/ai', require('./routes/ai'));

// Serve brokers page
app.get('/brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'brokers.html'));
});

// Serve broker category pages
app.get('/brokers/forex', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forex-trading.html'));
});

app.get('/brokers/stocks', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stocks-trading.html'));
});

app.get('/brokers/crypto', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'crypto-trading.html'));
});

app.get('/brokers/cfd', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cfd-trading.html'));
});

app.get('/brokers/commodities', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'commodities-trading.html'));
});

// Serve reviews page
app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reviews.html'));
});

// Serve individual broker detail page
app.get('/broker/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'broker-detail.html'));
});

// Serve category-specific trading pages
app.get('/forex-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forex-trading.html'));
});

app.get('/stocks-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stocks-trading.html'));
});

app.get('/crypto-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'crypto-trading.html'));
});

app.get('/cfd-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cfd-trading.html'));
});

app.get('/commodities-trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'commodities-trading.html'));
});

app.get('/education-training', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'education-training.html'));
});

// Serve educational guide pages
app.get('/how-to-choose-broker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'how-to-choose-broker.html'));
});

app.get('/regulated-brokers-latam', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'regulated-brokers-latam.html'));
});

app.get('/trading-platforms-latam', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'trading-platforms-latam.html'));
});

// Payment method pages
app.get('/payment-methods-latam', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'payment-methods-latam.html'));
});

app.get('/brokers-spei', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'brokers-spei.html'));
});

app.get('/brokers-pse', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'brokers-pse.html'));
});

app.get('/brokers-cbu-alias', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'brokers-cbu-alias.html'));
});

app.get('/brokers-webpay', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'brokers-webpay.html'));
});

// Broker comparison pages
app.get('/compare-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'broker-comparison.html'));
});

app.get('/libertex-vs-etoro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'libertex-vs-etoro.html'));
});

app.get('/etoro-vs-xtb', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'etoro-vs-xtb.html'));
});

app.get('/interactive-brokers-vs-etoro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'interactive-brokers-vs-etoro.html'));
});

app.get('/avatrade-vs-xtb', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'avatrade-vs-xtb.html'));
});

app.get('/cmc-markets-vs-plus500', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cmc-markets-vs-plus500.html'));
});

app.get('/admirals-vs-ic-markets', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admirals-vs-ic-markets.html'));
});

// Category-based topic pages
app.get('/best-brokers-beginners', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-brokers-beginners.html'));
});

app.get('/best-brokers-advanced', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-brokers-advanced.html'));
});

app.get('/best-crypto-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-crypto-brokers.html'));
});

app.get('/best-day-trading-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-day-trading-brokers.html'));
});

app.get('/best-futures-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-futures-brokers.html'));
});

app.get('/best-low-fee-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-low-fee-brokers.html'));
});

app.get('/best-mobile-trading-apps', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-mobile-trading-apps.html'));
});

app.get('/best-no-minimum-deposit-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-no-minimum-deposit-brokers.html'));
});

app.get('/best-options-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-options-brokers.html'));
});

app.get('/best-scalping-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-scalping-brokers.html'));
});

app.get('/best-stock-trading-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-stock-trading-brokers.html'));
});

app.get('/best-swing-trading-brokers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'best-swing-trading-brokers.html'));
});

// Serve blog page
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog.html'));
});

// Serve broker comparison page
app.get('/broker-comparison', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'broker-comparison.html'));
});

// Serve individual blog post page
app.get('/blog/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog-post.html'));
});

// Main routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Favicon route (prevent 404)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Robots.txt route
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// Dynamic sitemap.xml generation
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Broker = require('./models/Broker');
    const baseUrl = 'https://latambrokerreviews.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/brokers', priority: '0.9', changefreq: 'daily' },
      { url: '/reviews', priority: '0.9', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/forex-trading', priority: '0.8', changefreq: 'weekly' },
      { url: '/stocks-trading', priority: '0.8', changefreq: 'weekly' },
      { url: '/crypto-trading', priority: '0.8', changefreq: 'weekly' },
      { url: '/cfd-trading', priority: '0.8', changefreq: 'weekly' },
      { url: '/commodities-trading', priority: '0.8', changefreq: 'weekly' },
      { url: '/education-training', priority: '0.8', changefreq: 'weekly' },
      { url: '/broker-comparison', priority: '0.9', changefreq: 'weekly' },
      { url: '/how-to-choose-broker', priority: '0.9', changefreq: 'monthly' },
      { url: '/regulated-brokers-latam', priority: '0.9', changefreq: 'monthly' },
      { url: '/trading-platforms-latam', priority: '0.9', changefreq: 'monthly' },
      { url: '/payment-methods-latam', priority: '0.9', changefreq: 'monthly' },
      { url: '/brokers-spei', priority: '0.8', changefreq: 'monthly' },
      { url: '/brokers-pse', priority: '0.8', changefreq: 'monthly' },
      { url: '/brokers-cbu-alias', priority: '0.8', changefreq: 'monthly' },
      { url: '/brokers-webpay', priority: '0.8', changefreq: 'monthly' },
      { url: '/compare-brokers', priority: '0.9', changefreq: 'weekly' },
      { url: '/libertex-vs-etoro', priority: '0.8', changefreq: 'monthly' },
      { url: '/etoro-vs-xtb', priority: '0.8', changefreq: 'monthly' },
      { url: '/interactive-brokers-vs-etoro', priority: '0.8', changefreq: 'monthly' },
      { url: '/avatrade-vs-xtb', priority: '0.8', changefreq: 'monthly' },
      { url: '/cmc-markets-vs-plus500', priority: '0.8', changefreq: 'monthly' },
      { url: '/admirals-vs-ic-markets', priority: '0.8', changefreq: 'monthly' },
      { url: '/best-brokers-beginners', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-brokers-advanced', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-crypto-brokers', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-day-trading-brokers', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-futures-brokers', priority: '0.8', changefreq: 'monthly' },
      { url: '/best-low-fee-brokers', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-mobile-trading-apps', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-no-minimum-deposit-brokers', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-options-brokers', priority: '0.8', changefreq: 'monthly' },
      { url: '/best-scalping-brokers', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-stock-trading-brokers', priority: '0.9', changefreq: 'monthly' },
      { url: '/best-swing-trading-brokers', priority: '0.9', changefreq: 'monthly' }
    ];
    
    // Get all active brokers
    const brokers = await Broker.find({ isActive: true }).select('slug updatedAt').lean();
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    // Add broker pages
    brokers.forEach(broker => {
      const lastmod = broker.updatedAt ? new Date(broker.updatedAt).toISOString().split('T')[0] : currentDate;
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/broker/${broker.slug}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler - should be last
app.use((req, res) => {
  // Check if request is for an API endpoint
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Endpoint not found' });
  } else {
    // For HTML pages, try to serve a 404 page or fallback
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #667eea; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Go to Home</a>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`LatamBrokerReviews server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
