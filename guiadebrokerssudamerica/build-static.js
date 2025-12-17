const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');
const VIEWS_DIR = path.join(__dirname, 'views');

async function buildStatic() {
  console.log('🚀 Starting static site build...\n');

  // Create output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('✅ Created output directory\n');

  // Copy public assets
  console.log('📁 Copying public assets...');
  copyDirectory(PUBLIC_DIR, path.join(OUTPUT_DIR, 'public'));
  console.log('✅ Public assets copied\n');
  
  // Copy _redirects file for Cloudflare Pages
  const redirectsFile = path.join(__dirname, '_redirects');
  if (fs.existsSync(redirectsFile)) {
    fs.copyFileSync(redirectsFile, path.join(OUTPUT_DIR, '_redirects'));
    console.log('✅ Copied _redirects file for Cloudflare Pages\n');
  }
  
  // Copy _headers file for Cloudflare Pages (MIME types)
  const headersFile = path.join(__dirname, '_headers');
  if (fs.existsSync(headersFile)) {
    fs.copyFileSync(headersFile, path.join(OUTPUT_DIR, '_headers'));
    console.log('✅ Copied _headers file for Cloudflare Pages (MIME types)\n');
  }

  // Copy all HTML files from views (excluding admin/login pages)
  console.log('📄 Copying HTML pages...');
  const htmlFiles = fs.readdirSync(VIEWS_DIR).filter(file => 
    file.endsWith('.html') && 
    !file.includes('.backup') && 
    file !== 'admin.html' && 
    file !== 'login.html'
  );
  
  htmlFiles.forEach(file => {
    const source = path.join(VIEWS_DIR, file);
    let content = fs.readFileSync(source, 'utf8');
    
    // Update script paths for static deployment
    // Replace /js/ with /public/js/ for JavaScript files
    content = content.replace(/src="\/js\//g, 'src="/public/js/');
    // Replace /css/ with /public/css/ for CSS files
    content = content.replace(/href="\/css\//g, 'href="/public/css/');
    // Replace /images/ with /public/images/ for image files
    content = content.replace(/href="\/images\//g, 'href="/public/images/');
    // Also handle src="/public/js/..." if already converted (ensure no double conversion)
    content = content.replace(/src="\/public\/public\//g, 'src="/public/');
    content = content.replace(/href="\/public\/public\//g, 'href="/public/');
    
    // Fix broker detail page links to use .html extension
    content = content.replace(/href="\/broker\/([^"]+)"/g, 'href="/broker/$1.html"');
    
    // Fix blog post links
    content = content.replace(/href="\/blog\/([^"]+)"/g, 'href="/blog/$1.html"');
    
    // Add static brokers loader if brokers.js is included
    if (content.includes('brokers.js') && !content.includes('static-brokers.js')) {
      content = content.replace(
        /(<script src="[^"]*brokers\.js"><\/script>)/,
        '<script src="/public/js/static-brokers.js"></script>\n    $1'
      );
    }
    
    // Add FAQ chatbot to all pages (except admin/login)
    if (file !== 'admin.html' && file !== 'login.html') {
      // Add chatbot CSS before </head> or before </body>
      if (content.includes('</head>') && !content.includes('faq-bot.css')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="/public/css/faq-bot.css">\n</head>');
      } else if (content.includes('</body>') && !content.includes('faq-bot.css')) {
        // If no </head>, add before </body>
        const bodyMatch = content.match(/(<\/body>)/);
        if (bodyMatch) {
          content = content.replace('</body>', '    <link rel="stylesheet" href="/public/css/faq-bot.css">\n</body>');
        }
      }
      
      // Add chatbot JS before </body>
      if (content.includes('</body>') && !content.includes('faq-bot.js')) {
        content = content.replace('</body>', '    <script src="/public/js/faq-bot.js"></script>\n</body>');
      }
    }
    
    const dest = path.join(OUTPUT_DIR, file);
    fs.writeFileSync(dest, content);
    console.log(`  ✓ ${file}`);
  });
  console.log(`✅ Copied ${htmlFiles.length} HTML files\n`);

  // Load broker data from static JSON file
  console.log('📊 Loading broker data...');
  const brokersJsonPath = path.join(__dirname, 'public', 'data', 'brokers.json');
  let brokers = [];
  
  if (fs.existsSync(brokersJsonPath)) {
    try {
      const brokersData = JSON.parse(fs.readFileSync(brokersJsonPath, 'utf8'));
      brokers = brokersData.brokers || [];
      console.log(`✅ Loaded ${brokers.length} brokers from static file\n`);
      
      // Copy brokers.json to dist
      const distBrokersJsonPath = path.join(OUTPUT_DIR, 'public', 'data', 'brokers.json');
      fs.mkdirSync(path.dirname(distBrokersJsonPath), { recursive: true });
      fs.writeFileSync(distBrokersJsonPath, JSON.stringify(brokersData, null, 2));
      console.log('✅ Copied brokers.json to dist\n');
    } catch (error) {
      console.error('❌ Error loading brokers.json:', error.message);
      brokers = [];
    }
  } else {
    console.log('⚠️  brokers.json not found, creating empty file\n');
    brokers = [];
  }
  
  // Create empty reviews.json (reviews are loaded from languages.js)
  console.log('📝 Creating reviews.json...');
  const reviewsJsonPath = path.join(OUTPUT_DIR, 'public', 'data', 'reviews.json');
  fs.mkdirSync(path.dirname(reviewsJsonPath), { recursive: true });
  fs.writeFileSync(reviewsJsonPath, JSON.stringify({ reviews: [], generatedAt: new Date().toISOString() }));
  console.log('✅ Created reviews.json (reviews loaded from languages.js)\n');

  // Generate static sitemap.xml
  console.log('🗺️  Generating sitemap.xml...');
  generateSitemap(brokers);
  console.log('✅ Generated sitemap.xml\n');

  // Generate broker detail pages
  console.log('📄 Generating broker detail pages...');
  generateBrokerPages(brokers);
  console.log(`✅ Generated ${brokers.length} broker detail pages\n`);

  // Generate blog post pages (always, regardless of database connection)
  console.log('📝 Generating blog post pages...');
  const blogPostSlugs = await generateBlogPostPages();
  console.log('✅ Blog post pages generated\n');
  
  // Update sitemap with blog posts
  if (blogPostSlugs && blogPostSlugs.length > 0) {
    console.log('🗺️  Updating sitemap with blog posts...');
    updateSitemapWithBlogPosts(blogPostSlugs);
    console.log('✅ Sitemap updated\n');
  }

  // Create index.html redirect (if needed)
  const indexPath = path.join(OUTPUT_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    // Copy from views if it exists
    const viewsIndex = path.join(VIEWS_DIR, 'index.html');
    if (fs.existsSync(viewsIndex)) {
      fs.copyFileSync(viewsIndex, indexPath);
    }
  }

  // Create _redirects file for SPA routing (if using Netlify/Cloudflare Pages)
  const redirectsPath = path.join(OUTPUT_DIR, '_redirects');
  fs.writeFileSync(redirectsPath, `/*    /index.html   200\n`);

  // Create .htaccess for Apache (if needed)
  const htaccessPath = path.join(OUTPUT_DIR, '.htaccess');
  const htaccessContent = `RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`;
  fs.writeFileSync(htaccessPath, htaccessContent);

  console.log('✨ Static site build complete!');
  console.log(`📦 Output directory: ${OUTPUT_DIR}`);
  console.log('\n📋 Next steps:');
  console.log('   1. Deploy the "dist" folder to your static hosting');
  console.log('   2. Brokers loaded from /public/data/brokers.json');
  console.log('   3. Reviews loaded from languages.js');
  console.log('   4. Test the site locally by serving the dist folder\n');
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function generateSitemap(brokers) {
  const baseUrl = 'https://latambrokerreviews.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
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
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
}

function generateBrokerPages(brokers) {
  let brokerDetailTemplate = fs.readFileSync(path.join(VIEWS_DIR, 'broker-detail.html'), 'utf8');
  
  // Update script paths for static deployment (same as main HTML processing)
  brokerDetailTemplate = brokerDetailTemplate.replace(/src="\/js\//g, 'src="/public/js/');
  brokerDetailTemplate = brokerDetailTemplate.replace(/href="\/css\//g, 'href="/public/css/');
  brokerDetailTemplate = brokerDetailTemplate.replace(/href="\/images\//g, 'href="/public/images/');
  // Fix broker detail page links to use .html extension
  brokerDetailTemplate = brokerDetailTemplate.replace(/href="\/broker\/([^"]+)"/g, 'href="/broker/$1.html"');
  // Fix blog post links
  brokerDetailTemplate = brokerDetailTemplate.replace(/href="\/blog\/([^"]+)"/g, 'href="/blog/$1.html"');
  
  for (const broker of brokers) {
    // Create broker directory
    const brokerDir = path.join(OUTPUT_DIR, 'broker');
    if (!fs.existsSync(brokerDir)) {
      fs.mkdirSync(brokerDir, { recursive: true });
    }
    
    // For static site, we'll use the same template
    // The JavaScript will load broker data from JSON and reviews from languages.js
    fs.writeFileSync(path.join(brokerDir, `${broker.slug}.html`), brokerDetailTemplate);
  }
}

async function generateBlogPostPages() {
  const blogPostTemplate = fs.readFileSync(path.join(VIEWS_DIR, 'blog-post.html'), 'utf8');
  
  // Read languages.js to extract blog post slugs
  const languagesPath = path.join(PUBLIC_DIR, 'js', 'languages.js');
  if (!fs.existsSync(languagesPath)) {
    console.log('⚠️  languages.js not found, skipping blog post generation');
    return [];
  }
  
  const languagesContent = fs.readFileSync(languagesPath, 'utf8');
  
  // Extract blog post slugs using regex
  // Match pattern: 'slug-name': { ... slug: 'slug-name', ...
  const blogPostRegex = /'([^']+)':\s*\{[\s\S]*?slug:\s*'([^']+)'/g;
  const blogPostSlugs = [];
  let match;
  
  while ((match = blogPostRegex.exec(languagesContent)) !== null) {
    const slug = match[2] || match[1]; // Use slug property if available, otherwise use key
    if (!blogPostSlugs.includes(slug)) {
      blogPostSlugs.push(slug);
    }
  }
  
  if (blogPostSlugs.length === 0) {
    console.log('⚠️  No blog posts found in languages.js');
    return [];
  }
  
  // Create blog directory
  const blogDir = path.join(OUTPUT_DIR, 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }
  
  // Generate HTML file for each blog post
  for (const slug of blogPostSlugs) {
    let content = blogPostTemplate;
    
    // Update script paths for static deployment
    content = content.replace(/src="\/js\//g, 'src="/public/js/');
    content = content.replace(/href="\/css\//g, 'href="/public/css/');
    content = content.replace(/href="\/images\//g, 'href="/public/images/');
    
    // Fix internal links to use .html extension
    content = content.replace(/href="\/blog\/([^"]+)"/g, 'href="/blog/$1.html"');
    content = content.replace(/href="\/broker\/([^"]+)"/g, 'href="/broker/$1.html"');
    
    // Write the blog post HTML file
    fs.writeFileSync(path.join(blogDir, `${slug}.html`), content);
    console.log(`  ✓ blog/${slug}.html`);
  }
  
  console.log(`  Generated ${blogPostSlugs.length} blog post pages`);
  return blogPostSlugs;
}

function updateSitemapWithBlogPosts(blogPostSlugs) {
  const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.log('⚠️  Sitemap not found, skipping blog post update');
    return;
  }
  
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const baseUrl = 'https://latambrokerreviews.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Find the closing </urlset> tag and insert blog posts before it
  const closingTag = '</urlset>';
  const blogPostEntries = blogPostSlugs.map(slug => {
    return `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');
  
  sitemap = sitemap.replace(closingTag, blogPostEntries + '\n' + closingTag);
  fs.writeFileSync(sitemapPath, sitemap);
}

// Run build
buildStatic().catch(console.error);

