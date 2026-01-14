const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Broker = require('./models/Broker');
const Category = require('./models/Category');
const Review = require('./models/Review');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brokersconfiables', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Broker.deleteMany({});
        await Category.deleteMany({});
        await Review.deleteMany({});

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@brokersconfiables.com',
            password: 'admin123',
            role: 'admin'
        });
        await adminUser.save();
        console.log('✅ Admin user created');

        // Create categories
        const categories = [
            {
                name: 'Seguridad',
                slug: 'seguridad',
                description: 'Brokers confiables y seguros con regulación adecuada y protección de fondos',
                icon: 'fas fa-shield-alt',
                color: '#28a745',
                sortOrder: 1
            },
            {
                name: 'Forex',
                slug: 'forex',
                description: 'Brokers especializados en trading de divisas',
                icon: 'fas fa-exchange-alt',
                color: '#3498db',
                sortOrder: 2
            },
            {
                name: 'Acciones',
                slug: 'stocks',
                description: 'Brokers para trading de acciones y mercados bursátiles',
                icon: 'fas fa-chart-line',
                color: '#27ae60',
                sortOrder: 3
            },
            {
                name: 'Criptomonedas',
                slug: 'crypto',
                description: 'Brokers que ofrecen trading de criptomonedas',
                icon: 'fab fa-bitcoin',
                color: '#f39c12',
                sortOrder: 4
            },
            {
                name: 'CFDs',
                slug: 'cfd',
                description: 'Brokers especializados en contratos por diferencia',
                icon: 'fas fa-chart-bar',
                color: '#e74c3c',
                sortOrder: 5
            },
            {
                name: 'Commodities',
                slug: 'commodities',
                description: 'Brokers para trading de materias primas',
                icon: 'fas fa-seedling',
                color: '#9b59b6',
                sortOrder: 6
            }
        ];

        for (const categoryData of categories) {
            const category = new Category(categoryData);
            await category.save();
        }
        console.log('✅ Categories created');

        // Create brokers
        const brokers = [
            {
                name: 'Libertex',
                slug: 'libertex',
                description: 'Libertex es uno de los brokers más confiables para trading en América Latina, ofreciendo acceso a más de 300 instrumentos financieros incluyendo Forex, CFDs, acciones y criptomonedas. Con más de 20 años de experiencia, Libertex proporciona una plataforma de trading intuitiva y herramientas avanzadas para traders de todos los niveles.',
                website: 'https://libertex.com',
                category: 'seguridad',
                rating: 4.8,
                totalReviews: 1250,
                isFeatured: true,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Trading 24/7', description: 'Acceso al mercado las 24 horas', icon: 'fas fa-clock' },
                    { name: 'Más de 300 instrumentos', description: 'Amplia gama de activos', icon: 'fas fa-chart-line' },
                    { name: 'Plataforma intuitiva', description: 'Fácil de usar para principiantes', icon: 'fas fa-mobile-alt' },
                    { name: 'Soporte en español', description: 'Atención al cliente en español', icon: 'fas fa-headset' }
                ],
                tradingPlatforms: [
                    { name: 'Libertex Web', description: 'Plataforma web', supported: true },
                    { name: 'Libertex Mobile', description: 'App móvil', supported: true },
                    { name: 'MetaTrader 4', description: 'MT4 disponible', supported: true }
                ],
                accountTypes: [
                    { name: 'Demo', minDeposit: 0, currency: 'USD', description: 'Cuenta de práctica gratuita' },
                    { name: 'Real', minDeposit: 100, currency: 'USD', description: 'Cuenta real con depósito mínimo' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: 'CIF' },
                    { country: 'Europa', regulator: 'MiFID', license: 'EU' }
                ],
                pros: [
                    'Más de 20 años de experiencia',
                    'Plataforma fácil de usar',
                    'Soporte en español',
                    'Más de 300 instrumentos',
                    'Cuenta demo gratuita',
                    'Depósito mínimo bajo'
                ],
                cons: [
                    'Spreads variables',
                    'Limitado en algunos países'
                ],
                customerSupport: {
                    email: 'support@libertex.com',
                    phone: '+1-800-LIBERTEX',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés']
                },
                socialMedia: {
                    facebook: 'https://facebook.com/libertex',
                    twitter: 'https://twitter.com/libertex',
                    linkedin: 'https://linkedin.com/company/libertex',
                    youtube: 'https://youtube.com/libertex'
                }
            },
            {
                name: 'XM Group',
                slug: 'xm-group',
                description: 'XM es un broker global con presencia en más de 190 países, ofreciendo trading en Forex, CFDs, acciones y commodities. Con regulación en múltiples jurisdicciones, XM proporciona acceso a más de 1000 instrumentos financieros con spreads competitivos y ejecución rápida.',
                website: 'https://xm.com',
                category: 'seguridad',
                rating: 4.6,
                totalReviews: 980,
                isFeatured: true,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú', 'Venezuela'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 1000 instrumentos', description: 'Amplia selección de activos', icon: 'fas fa-chart-line' },
                    { name: 'Spreads bajos', description: 'Costos de trading competitivos', icon: 'fas fa-dollar-sign' },
                    { name: 'Educación gratuita', description: 'Seminarios y webinars', icon: 'fas fa-graduation-cap' },
                    { name: 'Bonos de bienvenida', description: 'Incentivos para nuevos clientes', icon: 'fas fa-gift' }
                ],
                tradingPlatforms: [
                    { name: 'XM WebTrader', description: 'Plataforma web', supported: true },
                    { name: 'XM Mobile', description: 'App móvil', supported: true },
                    { name: 'MetaTrader 4', description: 'MT4', supported: true },
                    { name: 'MetaTrader 5', description: 'MT5', supported: true }
                ],
                accountTypes: [
                    { name: 'Micro', minDeposit: 5, currency: 'USD', description: 'Cuenta micro con lotes pequeños' },
                    { name: 'Standard', minDeposit: 100, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'XM Ultra Low', minDeposit: 50, currency: 'USD', description: 'Spreads ultra bajos' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: '120/10' },
                    { country: 'Reino Unido', regulator: 'FCA', license: '705428' },
                    { country: 'Australia', regulator: 'ASIC', license: '443670' }
                ],
                pros: [
                    'Regulado en múltiples jurisdicciones',
                    'Más de 1000 instrumentos',
                    'Spreads competitivos',
                    'Educación gratuita',
                    'Bonos de bienvenida',
                    'Soporte 24/5'
                ],
                cons: [
                    'No disponible en algunos países',
                    'Comisiones en algunas cuentas'
                ],
                customerSupport: {
                    email: 'support@xm.com',
                    phone: '+1-800-XM-GROUP',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés', 'Árabe']
                }
            },
            {
                name: 'eToro',
                slug: 'etoro',
                description: 'eToro es una plataforma de trading social líder que permite a los usuarios copiar las estrategias de traders exitosos. Con más de 20 millones de usuarios en todo el mundo, eToro ofrece trading en criptomonedas, acciones, ETFs y más.',
                website: 'https://etoro.com',
                category: 'seguridad',
                rating: 4.4,
                totalReviews: 2100,
                isFeatured: true,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Trading social', description: 'Copia a traders exitosos', icon: 'fas fa-users' },
                    { name: 'Criptomonedas', description: 'Trading de crypto', icon: 'fab fa-bitcoin' },
                    { name: 'Sin comisiones', description: 'Trading sin comisiones en acciones', icon: 'fas fa-percentage' },
                    { name: 'Plataforma intuitiva', description: 'Fácil de usar', icon: 'fas fa-mobile-alt' }
                ],
                tradingPlatforms: [
                    { name: 'eToro Web', description: 'Plataforma web', supported: true },
                    { name: 'eToro Mobile', description: 'App móvil', supported: true }
                ],
                accountTypes: [
                    { name: 'Retail', minDeposit: 200, currency: 'USD', description: 'Cuenta retail estándar' },
                    { name: 'Professional', minDeposit: 1000, currency: 'USD', description: 'Cuenta profesional' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: '109/10' },
                    { country: 'Reino Unido', regulator: 'FCA', license: '583263' },
                    { country: 'Australia', regulator: 'ASIC', license: '491139' }
                ],
                pros: [
                    'Trading social innovador',
                    'Sin comisiones en acciones',
                    'Amplia selección de criptomonedas',
                    'Plataforma fácil de usar',
                    'Comunidad activa',
                    'Herramientas de análisis'
                ],
                cons: [
                    'Spreads altos en Forex',
                    'Limitado en algunos países',
                    'Retiros pueden tardar'
                ],
                customerSupport: {
                    email: 'support@etoro.com',
                    phone: '+1-800-ETORO',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés', 'Francés', 'Alemán']
                }
            },
            {
                name: 'Plus500',
                slug: 'plus500',
                description: 'Plus500 es un broker líder en CFDs con más de 15 años de experiencia. Ofrece trading en más de 2000 instrumentos incluyendo Forex, acciones, índices, commodities y criptomonedas. Con regulación en múltiples jurisdicciones, Plus500 es una opción confiable para traders latinoamericanos.',
                website: 'https://plus500.com',
                category: 'seguridad',
                rating: 4.3,
                totalReviews: 1800,
                isFeatured: false,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 2000 instrumentos', description: 'Amplia gama de CFDs', icon: 'fas fa-chart-line' },
                    { name: 'Sin comisiones', description: 'Trading sin comisiones', icon: 'fas fa-percentage' },
                    { name: 'Plataforma web', description: 'Trading desde el navegador', icon: 'fas fa-globe' },
                    { name: 'Stop loss garantizado', description: 'Protección contra pérdidas', icon: 'fas fa-shield-alt' }
                ],
                tradingPlatforms: [
                    { name: 'Plus500 Web', description: 'Plataforma web', supported: true },
                    { name: 'Plus500 Mobile', description: 'App móvil', supported: true }
                ],
                accountTypes: [
                    { name: 'Demo', minDeposit: 0, currency: 'USD', description: 'Cuenta demo gratuita' },
                    { name: 'Real', minDeposit: 100, currency: 'USD', description: 'Cuenta real' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: '250/14' },
                    { country: 'Reino Unido', regulator: 'FCA', license: '509909' },
                    { country: 'Australia', regulator: 'ASIC', license: '417727' }
                ],
                pros: [
                    'Sin comisiones',
                    'Más de 2000 instrumentos',
                    'Plataforma fácil de usar',
                    'Stop loss garantizado',
                    'Regulación múltiple',
                    'Spreads competitivos'
                ],
                cons: [
                    'Limitado en algunos países',
                    'Pocas herramientas de análisis',
                    'Soporte al cliente limitado'
                ],
                customerSupport: {
                    email: 'support@plus500.com',
                    phone: '+357-25-030-405',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés']
                }
            },
            {
                name: 'AvaTrade',
                slug: 'avatrade',
                description: 'AvaTrade es un broker global con más de 15 años de experiencia, ofreciendo trading en Forex, CFDs, acciones y criptomonedas. Con regulación en múltiples jurisdicciones y soporte en más de 20 idiomas, AvaTrade es una excelente opción para traders latinoamericanos.',
                website: 'https://avatrade.com',
                category: 'seguridad',
                rating: 4.5,
                totalReviews: 1600,
                isFeatured: false,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 1000 instrumentos', description: 'Amplia gama de activos', icon: 'fas fa-chart-line' },
                    { name: 'MetaTrader 4/5', description: 'Plataformas MT4 y MT5', icon: 'fas fa-desktop' },
                    { name: 'Spreads bajos', description: 'Spreads desde 0.9 pips', icon: 'fas fa-percentage' },
                    { name: 'Soporte 24/5', description: 'Atención al cliente 24/5', icon: 'fas fa-headset' }
                ],
                tradingPlatforms: [
                    { name: 'MetaTrader 4', description: 'MT4', supported: true },
                    { name: 'MetaTrader 5', description: 'MT5', supported: true },
                    { name: 'AvaTrade WebTrader', description: 'Plataforma web', supported: true }
                ],
                accountTypes: [
                    { name: 'Standard', minDeposit: 100, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'Professional', minDeposit: 1000, currency: 'USD', description: 'Cuenta profesional' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: '347/17' },
                    { country: 'Reino Unido', regulator: 'FCA', license: '12613' },
                    { country: 'Australia', regulator: 'ASIC', license: '406684' }
                ],
                pros: [
                    'Spreads competitivos',
                    'Plataformas MT4 y MT5',
                    'Soporte profesional',
                    'Más de 1000 instrumentos',
                    'Regulación múltiple',
                    'Educación gratuita'
                ],
                cons: [
                    'Depósito mínimo alto',
                    'No disponible en todos los países',
                    'Comisiones en algunas cuentas'
                ],
                customerSupport: {
                    email: 'support@avatrade.com',
                    phone: '+357-25-030-405',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés', 'Francés', 'Alemán']
                }
            },
            {
                name: 'IG Markets',
                slug: 'ig-markets',
                description: 'IG Markets es uno de los brokers más antiguos y establecidos del mundo, con más de 45 años de experiencia. Ofrece trading en más de 17,000 instrumentos incluyendo Forex, CFDs, acciones e índices. Con regulación en múltiples jurisdicciones, IG es una opción premium para traders experimentados.',
                website: 'https://ig.com',
                category: 'seguridad',
                rating: 4.7,
                totalReviews: 2200,
                isFeatured: false,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 17,000 instrumentos', description: 'La mayor gama de activos', icon: 'fas fa-chart-line' },
                    { name: 'Plataforma profesional', description: 'Herramientas avanzadas', icon: 'fas fa-desktop' },
                    { name: 'Spreads bajos', description: 'Spreads desde 0.6 pips', icon: 'fas fa-percentage' },
                    { name: 'Educación premium', description: 'Recursos educativos avanzados', icon: 'fas fa-graduation-cap' }
                ],
                tradingPlatforms: [
                    { name: 'IG Web', description: 'Plataforma web', supported: true },
                    { name: 'IG Mobile', description: 'App móvil', supported: true },
                    { name: 'MetaTrader 4', description: 'MT4', supported: true }
                ],
                accountTypes: [
                    { name: 'Standard', minDeposit: 250, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'Professional', minDeposit: 1000, currency: 'USD', description: 'Cuenta profesional' }
                ],
                regulations: [
                    { country: 'Reino Unido', regulator: 'FCA', license: '195355' },
                    { country: 'Australia', regulator: 'ASIC', license: '220440' },
                    { country: 'Singapur', regulator: 'MAS', license: 'SFA' }
                ],
                pros: [
                    'Más de 17,000 instrumentos',
                    'Plataforma profesional',
                    'Spreads muy competitivos',
                    'Educación premium',
                    'Regulación sólida',
                    'Herramientas avanzadas'
                ],
                cons: [
                    'Depósito mínimo alto',
                    'Complejo para principiantes',
                    'No disponible en todos los países'
                ],
                customerSupport: {
                    email: 'support@ig.com',
                    phone: '+44-20-7633-5678',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés', 'Francés', 'Alemán']
                }
            },
            {
                name: 'Xlence',
                slug: 'xlence',
                description: 'Xlence es el mejor broker de Forex para Latinoamérica en 2025, destacando por su amplia gama de tipos de activos, transparencia en comisiones, experiencia fácil de usar, cursos de trading extensos, promociones generosas para LATAM y soporte multilingüe 24/5. Con más de 300 instrumentos disponibles, Xlence ofrece spreads competitivos y ejecución rápida.',
                website: 'https://xlence.com',
                category: 'forex',
                rating: 4.65,
                totalReviews: 1450,
                isFeatured: true,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú', 'Ecuador', 'Venezuela'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Amplia gama de activos', description: 'Más de 300 instrumentos', icon: 'fas fa-chart-line' },
                    { name: 'Transparencia de comisiones', description: 'Sin costos ocultos', icon: 'fas fa-dollar-sign' },
                    { name: 'Experiencia fácil de usar', description: 'Plataforma intuitiva', icon: 'fas fa-mobile-alt' },
                    { name: 'Cursos extensos', description: 'Educación completa', icon: 'fas fa-graduation-cap' },
                    { name: 'Promociones LATAM', description: 'Bonos especiales para la región', icon: 'fas fa-gift' },
                    { name: 'Soporte 24/5', description: 'Atención multilingüe', icon: 'fas fa-headset' }
                ],
                tradingPlatforms: [
                    { name: 'Xlence Web', description: 'Plataforma web', supported: true },
                    { name: 'Xlence Mobile', description: 'App móvil', supported: true },
                    { name: 'MetaTrader 4', description: 'MT4', supported: true },
                    { name: 'MetaTrader 5', description: 'MT5', supported: true }
                ],
                accountTypes: [
                    { name: 'Standard', minDeposit: 100, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'Premium', minDeposit: 500, currency: 'USD', description: 'Cuenta premium con spreads reducidos' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: 'CIF' },
                    { country: 'Europa', regulator: 'MiFID', license: 'EU' }
                ],
                pros: [
                    'Amplia gama de tipos de activos',
                    'Transparencia total de comisiones',
                    'Experiencia de usuario excepcional',
                    'Cursos de trading extensos',
                    'Promociones generosas para LATAM',
                    'Soporte multilingüe 24/5'
                ],
                cons: [
                    'Spreads variables según mercado',
                    'Limitado en algunos países'
                ],
                customerSupport: {
                    email: 'support@xlence.com',
                    phone: '+1-800-XLENCE',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés']
                },
                socialMedia: {
                    facebook: 'https://facebook.com/xlence',
                    twitter: 'https://twitter.com/xlence',
                    linkedin: 'https://linkedin.com/company/xlence',
                    youtube: 'https://youtube.com/xlence'
                }
            },
            {
                name: 'EC Markets',
                slug: 'ec-markets',
                description: 'EC Markets es un broker multi-regulado con presencia local en México y Latinoamérica. Ofrece más de 1,000 instrumentos con spreads competitivos y ejecución rápida. Con opciones de pago locales para LATAM y soporte al cliente 24/7, EC Markets se destaca como una de las opciones más confiables para traders latinoamericanos.',
                website: 'https://ecmarkets.com',
                category: 'forex',
                rating: 4.6,
                totalReviews: 1320,
                isFeatured: true,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 1,000 instrumentos', description: 'Amplia selección de activos', icon: 'fas fa-chart-line' },
                    { name: 'Multi-regulado', description: 'Regulación en múltiples jurisdicciones', icon: 'fas fa-shield-alt' },
                    { name: 'Presencia local en México', description: 'Oficina en Latinoamérica', icon: 'fas fa-map-marker-alt' },
                    { name: 'Spreads competitivos', description: 'Costos bajos de trading', icon: 'fas fa-dollar-sign' },
                    { name: 'Ejecución rápida', description: 'Velocidad de ejecución superior', icon: 'fas fa-bolt' },
                    { name: 'Pagos locales LATAM', description: 'Métodos de pago regionales', icon: 'fas fa-credit-card' },
                    { name: 'Soporte 24/7', description: 'Atención al cliente continua', icon: 'fas fa-headset' }
                ],
                tradingPlatforms: [
                    { name: 'MetaTrader 4', description: 'MT4', supported: true },
                    { name: 'MetaTrader 5', description: 'MT5', supported: true },
                    { name: 'EC Markets Web', description: 'Plataforma web', supported: true }
                ],
                accountTypes: [
                    { name: 'Standard', minDeposit: 100, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'ECN', minDeposit: 500, currency: 'USD', description: 'Cuenta ECN con spreads desde 0 pips' }
                ],
                regulations: [
                    { country: 'Chipre', regulator: 'CySEC', license: 'CIF' },
                    { country: 'Reino Unido', regulator: 'FCA', license: 'FCA' },
                    { country: 'Australia', regulator: 'ASIC', license: 'ASIC' }
                ],
                pros: [
                    'Más de 1,000 instrumentos',
                    'Multi-regulado',
                    'Presencia local en México',
                    'Spreads competitivos y ejecución rápida',
                    'Opciones de pago locales para LATAM',
                    'Soporte al cliente 24/7'
                ],
                cons: [
                    'Depósito mínimo puede ser alto para algunos',
                    'No disponible en todos los países'
                ],
                customerSupport: {
                    email: 'support@ecmarkets.com',
                    phone: '+52-55-ECMARKETS',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés']
                },
                socialMedia: {
                    facebook: 'https://facebook.com/ecmarkets',
                    twitter: 'https://twitter.com/ecmarkets',
                    linkedin: 'https://linkedin.com/company/ecmarkets',
                    youtube: 'https://youtube.com/ecmarkets'
                }
            },
            {
                name: 'Eightcap',
                slug: 'eightcap',
                description: 'Eightcap es un broker con múltiples licencias Tier 1 que ofrece más de 800 instrumentos para trading. Con canal de YouTube dedicado para LATAM, sección educativa sólida y charting de TradingView, Eightcap es una excelente opción para traders que buscan herramientas profesionales y educación de calidad.',
                website: 'https://eightcap.com',
                category: 'forex',
                rating: 4.4,
                totalReviews: 1180,
                isFeatured: true,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 800 instrumentos', description: 'Amplia gama de activos', icon: 'fas fa-chart-line' },
                    { name: 'Múltiples licencias Tier 1', description: 'Regulación de primer nivel', icon: 'fas fa-shield-alt' },
                    { name: 'Canal YouTube LATAM', description: 'Contenido educativo regional', icon: 'fab fa-youtube' },
                    { name: 'Sección educativa sólida', description: 'Recursos de aprendizaje', icon: 'fas fa-graduation-cap' },
                    { name: 'Charting TradingView', description: 'Herramientas profesionales', icon: 'fas fa-chart-bar' }
                ],
                tradingPlatforms: [
                    { name: 'MetaTrader 4', description: 'MT4', supported: true },
                    { name: 'MetaTrader 5', description: 'MT5', supported: true },
                    { name: 'TradingView', description: 'Charting avanzado', supported: true }
                ],
                accountTypes: [
                    { name: 'Standard', minDeposit: 100, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'Raw', minDeposit: 100, currency: 'USD', description: 'Cuenta Raw con spreads desde 0 pips' }
                ],
                regulations: [
                    { country: 'Australia', regulator: 'ASIC', license: '391441' },
                    { country: 'Reino Unido', regulator: 'FCA', license: 'FCA' },
                    { country: 'Bahamas', regulator: 'SCB', license: 'SCB' }
                ],
                pros: [
                    'Más de 800 instrumentos',
                    'Múltiples licencias Tier 1',
                    'Canal YouTube para LATAM',
                    'Sección educativa sólida',
                    'Charting de TradingView',
                    'Spreads competitivos'
                ],
                cons: [
                    'Menos instrumentos que algunos competidores',
                    'No disponible en todos los países'
                ],
                customerSupport: {
                    email: 'support@eightcap.com',
                    phone: '+61-3-8376-3600',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés']
                },
                socialMedia: {
                    facebook: 'https://facebook.com/eightcap',
                    twitter: 'https://twitter.com/eightcap',
                    linkedin: 'https://linkedin.com/company/eightcap',
                    youtube: 'https://youtube.com/eightcap'
                }
            },
            {
                name: 'Deriv',
                slug: 'deriv',
                description: 'Deriv ofrece más de 500 instrumentos con una amplia elección de plataformas. Especializado en trading de CFDs y opciones, Deriv proporciona soporte al cliente 24/7 y una plataforma intuitiva adecuada para traders de todos los niveles en Latinoamérica.',
                website: 'https://deriv.com',
                category: 'cfd',
                rating: 4.1,
                totalReviews: 950,
                isFeatured: false,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'],
                languages: ['Español', 'Portugués', 'Inglés'],
                features: [
                    { name: 'Más de 500 instrumentos', description: 'Amplia selección', icon: 'fas fa-chart-line' },
                    { name: 'Amplia elección de plataformas', description: 'Múltiples opciones', icon: 'fas fa-desktop' },
                    { name: 'Trading de CFDs y opciones', description: 'Especializado', icon: 'fas fa-chart-bar' },
                    { name: 'Soporte 24/7', description: 'Atención continua', icon: 'fas fa-headset' }
                ],
                tradingPlatforms: [
                    { name: 'Deriv Web', description: 'Plataforma web', supported: true },
                    { name: 'Deriv Mobile', description: 'App móvil', supported: true },
                    { name: 'Deriv MT5', description: 'MT5', supported: true },
                    { name: 'Deriv X', description: 'Plataforma avanzada', supported: true }
                ],
                accountTypes: [
                    { name: 'Demo', minDeposit: 0, currency: 'USD', description: 'Cuenta demo gratuita' },
                    { name: 'Real', minDeposit: 5, currency: 'USD', description: 'Depósito mínimo muy bajo' }
                ],
                regulations: [
                    { country: 'Malta', regulator: 'MFSA', license: 'MFSA' },
                    { country: 'Malasia', regulator: 'Labuan FSA', license: 'Labuan' }
                ],
                pros: [
                    'Más de 500 instrumentos',
                    'Amplia elección de plataformas',
                    'Trading de CFDs y opciones',
                    'Soporte al cliente 24/7',
                    'Depósito mínimo muy bajo',
                    'Plataforma intuitiva'
                ],
                cons: [
                    'Menos instrumentos que competidores',
                    'Regulación limitada en algunos países'
                ],
                customerSupport: {
                    email: 'support@deriv.com',
                    phone: '+356-2776-1666',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés']
                },
                socialMedia: {
                    facebook: 'https://facebook.com/deriv',
                    twitter: 'https://twitter.com/deriv',
                    linkedin: 'https://linkedin.com/company/deriv',
                    youtube: 'https://youtube.com/deriv'
                }
            },
            {
                name: 'TMGM',
                slug: 'tmgm',
                description: 'TMGM es un broker global con fuerte presencia en Asia-Pacífico que se está expandiendo en Latinoamérica. Ofrece trading en Forex, CFDs, acciones y commodities con spreads competitivos, plataformas MetaTrader y soporte multilingüe. Con regulación ASIC y FSA, TMGM es una opción confiable para traders latinoamericanos.',
                website: 'https://tmgm.com',
                category: 'forex',
                rating: 4.3,
                totalReviews: 1100,
                isFeatured: false,
                isActive: true,
                countries: ['México', 'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'],
                languages: ['Español', 'Portugués', 'Inglés', 'Chino'],
                features: [
                    { name: 'Trading global', description: 'Acceso a mercados internacionales', icon: 'fas fa-globe' },
                    { name: 'Spreads competitivos', description: 'Costos bajos', icon: 'fas fa-dollar-sign' },
                    { name: 'MetaTrader 4/5', description: 'Plataformas profesionales', icon: 'fas fa-desktop' },
                    { name: 'Soporte multilingüe', description: 'Atención en varios idiomas', icon: 'fas fa-headset' },
                    { name: 'Regulación sólida', description: 'ASIC y FSA', icon: 'fas fa-shield-alt' }
                ],
                tradingPlatforms: [
                    { name: 'MetaTrader 4', description: 'MT4', supported: true },
                    { name: 'MetaTrader 5', description: 'MT5', supported: true },
                    { name: 'TMGM Web', description: 'Plataforma web', supported: true }
                ],
                accountTypes: [
                    { name: 'Standard', minDeposit: 100, currency: 'USD', description: 'Cuenta estándar' },
                    { name: 'ECN', minDeposit: 500, currency: 'USD', description: 'Cuenta ECN' }
                ],
                regulations: [
                    { country: 'Australia', regulator: 'ASIC', license: '436416' },
                    { country: 'Vanuatu', regulator: 'FSA', license: 'FSA' }
                ],
                pros: [
                    'Regulación ASIC y FSA',
                    'Spreads competitivos',
                    'Plataformas MetaTrader',
                    'Soporte multilingüe',
                    'Presencia global',
                    'Ejecución rápida'
                ],
                cons: [
                    'Menos conocido en LATAM',
                    'Opciones de pago locales limitadas'
                ],
                customerSupport: {
                    email: 'support@tmgm.com',
                    phone: '+61-2-8039-7366',
                    liveChat: true,
                    languages: ['Español', 'Portugués', 'Inglés', 'Chino']
                },
                socialMedia: {
                    facebook: 'https://facebook.com/tmgm',
                    twitter: 'https://twitter.com/tmgm',
                    linkedin: 'https://linkedin.com/company/tmgm',
                    youtube: 'https://youtube.com/tmgm'
                }
            }
        ];

        for (const brokerData of brokers) {
            const broker = new Broker(brokerData);
            await broker.save();
        }
        console.log('✅ Brokers created');

        // Create sample reviews
        const libertexBroker = await Broker.findOne({ name: 'Libertex' });
        const xmBroker = await Broker.findOne({ name: 'XM Group' });
        const etoroBroker = await Broker.findOne({ name: 'eToro' });
        const plus500Broker = await Broker.findOne({ name: 'Plus500' });
        const avatradeBroker = await Broker.findOne({ name: 'AvaTrade' });
        const igMarketsBroker = await Broker.findOne({ name: 'IG Markets' });
        const xlenceBroker = await Broker.findOne({ name: 'Xlence' });
        const ecMarketsBroker = await Broker.findOne({ name: 'EC Markets' });
        const eightcapBroker = await Broker.findOne({ name: 'Eightcap' });
        const derivBroker = await Broker.findOne({ name: 'Deriv' });
        const tmgmBroker = await Broker.findOne({ name: 'TMGM' });

        const reviews = [
            // Libertex Reviews (8 reviews)
            {
                broker: libertexBroker._id,
                user: { name: 'María González', email: 'maria.gonzalez@email.com', country: 'México' },
                rating: 5,
                title: 'Excelente plataforma para trading',
                content: 'He estado usando Libertex por más de 2 años y la experiencia ha sido excelente. La plataforma es muy intuitiva y el soporte al cliente es excepcional. Los spreads son competitivos y la ejecución es rápida. Lo recomiendo totalmente.',
                pros: ['Plataforma fácil de usar', 'Soporte en español', 'Spreads competitivos'],
                cons: ['Limitado en algunos países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 15,
                notHelpful: 2
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Buena opción para principiantes',
                content: 'Como principiante en el trading, Libertex me ha ayudado mucho. La cuenta demo es perfecta para aprender y la plataforma es muy fácil de usar. El soporte al cliente responde rápido y en español.',
                pros: ['Cuenta demo gratuita', 'Fácil de usar', 'Soporte en español'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 8,
                notHelpful: 1
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Roberto Fernández', email: 'roberto.fernandez@email.com', country: 'Argentina' },
                rating: 5,
                title: 'Sobresaliente en todos los aspectos',
                content: 'Llevo 3 años con Libertex y no puedo estar más contento. La plataforma móvil funciona perfectamente, los depósitos y retiros son rápidos, y el soporte técnico siempre está disponible. Los spreads en Forex son muy competitivos.',
                pros: ['App móvil excelente', 'Retiros rápidos', 'Spreads bajos'],
                cons: ['Limitado en algunos países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 24,
                notHelpful: 1
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Laura Sánchez', email: 'laura.sanchez@email.com', country: 'Chile' },
                rating: 4,
                title: 'Muy buena experiencia general',
                content: 'Empecé con Libertex hace 6 meses y la experiencia ha sido muy positiva. La plataforma es estable, los spreads son razonables y el soporte en español es excelente. Recomendado para traders de nivel intermedio.',
                pros: ['Plataforma estable', 'Soporte en español', 'Buenos spreads'],
                cons: ['Pocas herramientas avanzadas'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 12,
                notHelpful: 3
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Fernando López', email: 'fernando.lopez@email.com', country: 'Perú' },
                rating: 5,
                title: 'Perfecto para trading de criptomonedas',
                content: 'Uso Libertex principalmente para trading de criptomonedas y la experiencia es excelente. La ejecución es rápida, los spreads son competitivos y la plataforma es muy intuitiva. El soporte siempre responde rápido.',
                pros: ['Excelente para crypto', 'Ejecución rápida', 'Soporte eficiente'],
                cons: ['Limitado en algunos países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 19,
                notHelpful: 2
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Patricia Ramírez', email: 'patricia.ramirez@email.com', country: 'México' },
                rating: 4,
                title: 'Buena plataforma con algunas limitaciones',
                content: 'Libertex es una buena plataforma para principiantes. La cuenta demo es muy útil y la plataforma es fácil de usar. Sin embargo, me gustaría que tuvieran más herramientas de análisis técnico.',
                pros: ['Fácil de usar', 'Cuenta demo', 'Buen soporte'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 7,
                notHelpful: 4
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Andrés Torres', email: 'andres.torres@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente broker para Latinoamérica',
                content: 'Como trader latinoamericano, Libertex es perfecto. El soporte en español es excelente, los depósitos son fáciles de hacer y la plataforma funciona muy bien. Los spreads son competitivos y la ejecución es rápida.',
                pros: ['Soporte en español', 'Depósitos fáciles', 'Spreads competitivos'],
                cons: ['Limitado en algunos países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 21,
                notHelpful: 1
            },
            {
                broker: libertexBroker._id,
                user: { name: 'Carmen Vega', email: 'carmen.vega@email.com', country: 'Brasil' },
                rating: 4,
                title: 'Muy satisfecha con el servicio',
                content: 'Llevo usando Libertex desde hace un año y estoy muy satisfecha. La plataforma es estable, el soporte al cliente es excelente y los spreads son razonables. Recomendado para traders que buscan una plataforma confiable.',
                pros: ['Plataforma estable', 'Buen soporte', 'Spreads razonables'],
                cons: ['Limitado en algunos países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 2
            },
            
            // XM Group Reviews (8 reviews)
            {
                broker: xmBroker._id,
                user: { name: 'Ana Silva', email: 'ana.silva@email.com', country: 'Brasil' },
                rating: 5,
                title: 'Muy confiable y profesional',
                content: 'XM es un broker muy profesional y confiable. La variedad de instrumentos es impresionante y los spreads son muy competitivos. La educación que ofrecen es excelente y me ha ayudado mucho a mejorar mi trading.',
                pros: ['Muchos instrumentos', 'Spreads bajos', 'Educación gratuita'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 22,
                notHelpful: 3
            },
            {
                broker: xmBroker._id,
                user: { name: 'Juan Pérez', email: 'juan.perez@email.com', country: 'México' },
                rating: 5,
                title: 'Excelente broker con muchos instrumentos',
                content: 'XM Group es uno de los mejores brokers que he usado. Tienen más de 1000 instrumentos, spreads muy competitivos y la plataforma funciona perfectamente. El soporte al cliente es excelente y siempre están disponibles.',
                pros: ['Más de 1000 instrumentos', 'Spreads competitivos', 'Buen soporte'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 28,
                notHelpful: 2
            },
            {
                broker: xmBroker._id,
                user: { name: 'Sofia Martínez', email: 'sofia.martinez@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Muy buena plataforma educativa',
                content: 'Lo que más me gusta de XM es la educación que ofrecen. Los webinars son excelentes y me han ayudado mucho a mejorar mi trading. La plataforma es estable y los spreads son razonables. Recomendado.',
                pros: ['Excelente educación', 'Webinars útiles', 'Plataforma estable'],
                cons: ['No disponible en todos los países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 3
            },
            {
                broker: xmBroker._id,
                user: { name: 'Ricardo Gómez', email: 'ricardo.gomez@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Broker profesional con excelente servicio',
                content: 'He estado con XM por más de 4 años y la experiencia ha sido excelente. Los spreads son muy competitivos, la ejecución es rápida y el soporte al cliente es profesional. Los bonos de bienvenida son un plus.',
                pros: ['Spreads competitivos', 'Ejecución rápida', 'Bonos disponibles'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 31,
                notHelpful: 1
            },
            {
                broker: xmBroker._id,
                user: { name: 'Isabel Castro', email: 'isabel.castro@email.com', country: 'Chile' },
                rating: 4,
                title: 'Buena opción para traders experimentados',
                content: 'XM es un broker sólido para traders con experiencia. Tienen muchos instrumentos y spreads competitivos. La plataforma es estable y el soporte es bueno. Sin embargo, puede ser un poco complejo para principiantes.',
                pros: ['Muchos instrumentos', 'Spreads competitivos', 'Plataforma estable'],
                cons: ['Complejo para principiantes'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 13,
                notHelpful: 4
            },
            {
                broker: xmBroker._id,
                user: { name: 'Miguel Herrera', email: 'miguel.herrera@email.com', country: 'Perú' },
                rating: 5,
                title: 'Excelente para trading de Forex',
                content: 'XM es excelente para trading de Forex. Los spreads son muy competitivos, la ejecución es rápida y la plataforma funciona perfectamente. El soporte en español es excelente y siempre están disponibles.',
                pros: ['Spreads competitivos en Forex', 'Ejecución rápida', 'Soporte en español'],
                cons: ['No disponible en todos los países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 20,
                notHelpful: 2
            },
            {
                broker: xmBroker._id,
                user: { name: 'Lucía Morales', email: 'lucia.morales@email.com', country: 'Venezuela' },
                rating: 4,
                title: 'Broker confiable con buena educación',
                content: 'He usado XM durante un año y estoy satisfecha. La educación que ofrecen es excelente, los webinars son muy útiles y la plataforma es estable. Los spreads son razonables y el soporte es bueno.',
                pros: ['Buena educación', 'Webinars útiles', 'Plataforma estable'],
                cons: ['No disponible en todos los países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 11,
                notHelpful: 3
            },
            {
                broker: xmBroker._id,
                user: { name: 'Daniel Ruiz', email: 'daniel.ruiz@email.com', country: 'México' },
                rating: 5,
                title: 'Uno de los mejores brokers',
                content: 'XM Group es uno de los mejores brokers que he usado. Tienen más de 1000 instrumentos, spreads muy competitivos, excelente educación y soporte profesional. La plataforma funciona perfectamente y los retiros son rápidos.',
                pros: ['Más de 1000 instrumentos', 'Spreads competitivos', 'Excelente educación'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 35,
                notHelpful: 1
            },
            
            // eToro Reviews (8 reviews)
            {
                broker: etoroBroker._id,
                user: { name: 'Diego Martínez', email: 'diego.martinez@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Innovador y fácil de usar',
                content: 'eToro es una plataforma muy innovadora. El trading social es una excelente idea y me ha permitido aprender de traders exitosos. La plataforma es muy fácil de usar y las criptomonedas están bien integradas.',
                pros: ['Trading social', 'Fácil de usar', 'Criptomonedas'],
                cons: ['Spreads altos en Forex'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 18,
                notHelpful: 5
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Valentina Rojas', email: 'valentina.rojas@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente para trading social',
                content: 'eToro es perfecto para trading social. La función de copiar traders es genial y me ha permitido aprender mucho. La plataforma es muy intuitiva y las criptomonedas están bien integradas. Recomendado.',
                pros: ['Trading social', 'Copiar traders', 'Plataforma intuitiva'],
                cons: ['Spreads altos en Forex'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 22,
                notHelpful: 4
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Gabriel Nuñez', email: 'gabriel.nunez@email.com', country: 'Brasil' },
                rating: 4,
                title: 'Buena plataforma para principiantes',
                content: 'eToro es una excelente opción para principiantes. La plataforma es muy fácil de usar, el trading social es una gran idea y las criptomonedas están bien integradas. Sin embargo, los spreads en Forex son altos.',
                pros: ['Fácil de usar', 'Trading social', 'Criptomonedas'],
                cons: ['Spreads altos en Forex'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 15,
                notHelpful: 6
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Camila Díaz', email: 'camila.diaz@email.com', country: 'Chile' },
                rating: 5,
                title: 'Perfecto para trading de criptomonedas',
                content: 'Uso eToro principalmente para trading de criptomonedas y la experiencia es excelente. La plataforma es muy intuitiva, las criptomonedas están bien integradas y el trading social es una gran idea.',
                pros: ['Excelente para crypto', 'Trading social', 'Plataforma intuitiva'],
                cons: ['Spreads altos en Forex'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 19,
                notHelpful: 3
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Alejandro Vega', email: 'alejandro.vega@email.com', country: 'México' },
                rating: 4,
                title: 'Innovadora pero con algunas limitaciones',
                content: 'eToro es una plataforma muy innovadora con el trading social. La plataforma es fácil de usar y las criptomonedas están bien integradas. Sin embargo, los spreads en Forex son altos y los retiros pueden tardar.',
                pros: ['Trading social', 'Fácil de usar', 'Criptomonedas'],
                cons: ['Spreads altos en Forex', 'Retiros lentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 7
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Natalia Cruz', email: 'natalia.cruz@email.com', country: 'Argentina' },
                rating: 5,
                title: 'Excelente plataforma social',
                content: 'eToro es excelente para trading social. La función de copiar traders es genial y me ha permitido aprender mucho. La plataforma es muy intuitiva y las criptomonedas están bien integradas.',
                pros: ['Trading social', 'Copiar traders', 'Plataforma intuitiva'],
                cons: ['Spreads altos en Forex'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 4
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Sebastián Mendoza', email: 'sebastian.mendoza@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Buena opción para aprender',
                content: 'eToro es una buena opción para aprender trading. El trading social es una excelente idea y me ha permitido aprender de traders exitosos. La plataforma es fácil de usar y las criptomonedas están bien integradas.',
                pros: ['Trading social', 'Aprender de otros', 'Fácil de usar'],
                cons: ['Spreads altos en Forex'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 13,
                notHelpful: 5
            },
            {
                broker: etoroBroker._id,
                user: { name: 'Andrea Jiménez', email: 'andrea.jimenez@email.com', country: 'Brasil' },
                rating: 5,
                title: 'Excelente para trading de criptomonedas y acciones',
                content: 'Uso eToro para trading de criptomonedas y acciones sin comisiones. La plataforma es muy intuitiva, el trading social es una gran idea y las criptomonedas están bien integradas. Recomendado.',
                pros: ['Sin comisiones en acciones', 'Trading social', 'Criptomonedas'],
                cons: ['Spreads altos en Forex'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 21,
                notHelpful: 3
            },
            
            // Plus500 Reviews (8 reviews)
            {
                broker: plus500Broker._id,
                user: { name: 'Carlos Mendoza', email: 'carlos.mendoza@email.com', country: 'México' },
                rating: 4,
                title: 'Buena plataforma para CFDs',
                content: 'Plus500 es una buena plataforma para trading de CFDs. Tienen más de 2000 instrumentos, no hay comisiones y la plataforma es fácil de usar. El stop loss garantizado es un plus importante.',
                pros: ['Más de 2000 instrumentos', 'Sin comisiones', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 4
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Mariana Soto', email: 'mariana.soto@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente para principiantes',
                content: 'Plus500 es excelente para principiantes. La plataforma es muy fácil de usar, no hay comisiones y tienen más de 2000 instrumentos. El stop loss garantizado me da mucha tranquilidad.',
                pros: ['Fácil de usar', 'Sin comisiones', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 19,
                notHelpful: 2
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Roberto Hernández', email: 'roberto.hernandez@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Plataforma sólida con muchas opciones',
                content: 'Plus500 es una plataforma sólida con más de 2000 instrumentos. No hay comisiones y la plataforma es fácil de usar. El stop loss garantizado es un plus importante. Sin embargo, me gustaría más herramientas de análisis.',
                pros: ['Más de 2000 instrumentos', 'Sin comisiones', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 5
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Paula Gutiérrez', email: 'paula.gutierrez@email.com', country: 'Chile' },
                rating: 5,
                title: 'Muy satisfecha con Plus500',
                content: 'Llevo usando Plus500 desde hace un año y estoy muy satisfecha. La plataforma es estable, no hay comisiones y tienen más de 2000 instrumentos. El stop loss garantizado es un plus importante.',
                pros: ['Plataforma estable', 'Sin comisiones', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 18,
                notHelpful: 3
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Javier Ramírez', email: 'javier.ramirez@email.com', country: 'Perú' },
                rating: 4,
                title: 'Buena opción para CFDs',
                content: 'Plus500 es una buena opción para trading de CFDs. Tienen más de 2000 instrumentos, no hay comisiones y la plataforma es fácil de usar. Sin embargo, me gustaría más herramientas de análisis técnico.',
                pros: ['Más de 2000 instrumentos', 'Sin comisiones', 'Fácil de usar'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 12,
                notHelpful: 6
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Elena Torres', email: 'elena.torres@email.com', country: 'México' },
                rating: 5,
                title: 'Excelente para trading sin comisiones',
                content: 'Plus500 es excelente para trading sin comisiones. Tienen más de 2000 instrumentos, la plataforma es fácil de usar y el stop loss garantizado es un plus importante. Recomendado para traders que buscan una plataforma simple.',
                pros: ['Sin comisiones', 'Más de 2000 instrumentos', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 3
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Luis Castro', email: 'luis.castro@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Plataforma simple y efectiva',
                content: 'Plus500 es una plataforma simple y efectiva. Tienen más de 2000 instrumentos, no hay comisiones y la plataforma es fácil de usar. El stop loss garantizado es un plus importante. Sin embargo, me gustaría más herramientas de análisis.',
                pros: ['Simple y efectiva', 'Sin comisiones', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 13,
                notHelpful: 5
            },
            {
                broker: plus500Broker._id,
                user: { name: 'Monica Vargas', email: 'monica.vargas@email.com', country: 'Brasil' },
                rating: 5,
                title: 'Perfecto para principiantes',
                content: 'Plus500 es perfecto para principiantes. La plataforma es muy fácil de usar, no hay comisiones y tienen más de 2000 instrumentos. El stop loss garantizado me da mucha tranquilidad. Recomendado.',
                pros: ['Fácil de usar', 'Sin comisiones', 'Stop loss garantizado'],
                cons: ['Pocas herramientas de análisis'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 20,
                notHelpful: 2
            },
            
            // AvaTrade Reviews (8 reviews)
            {
                broker: avatradeBroker._id,
                user: { name: 'Francisco Morales', email: 'francisco.morales@email.com', country: 'México' },
                rating: 5,
                title: 'Excelente broker con MT4 y MT5',
                content: 'AvaTrade es excelente. Tienen MetaTrader 4 y MetaTrader 5, spreads competitivos y más de 1000 instrumentos. El soporte al cliente es profesional y siempre están disponibles. Recomendado para traders experimentados.',
                pros: ['MT4 y MT5', 'Spreads competitivos', 'Buen soporte'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 25,
                notHelpful: 2
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Daniela Ruiz', email: 'daniela.ruiz@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Muy buena plataforma profesional',
                content: 'AvaTrade es una muy buena plataforma profesional. Tienen MT4 y MT5, spreads competitivos y más de 1000 instrumentos. El soporte es bueno y la plataforma es estable. Sin embargo, el depósito mínimo es alto.',
                pros: ['MT4 y MT5', 'Spreads competitivos', 'Plataforma estable'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 4
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Héctor Delgado', email: 'hector.delgado@email.com', country: 'Argentina' },
                rating: 5,
                title: 'Perfecto para trading de Forex',
                content: 'AvaTrade es perfecto para trading de Forex. Los spreads son muy competitivos, tienen MT4 y MT5, y más de 1000 instrumentos. El soporte al cliente es profesional y siempre están disponibles.',
                pros: ['Spreads competitivos en Forex', 'MT4 y MT5', 'Buen soporte'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 23,
                notHelpful: 1
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Sandra López', email: 'sandra.lopez@email.com', country: 'Chile' },
                rating: 4,
                title: 'Broker sólido con buena educación',
                content: 'AvaTrade es un broker sólido con buena educación. Tienen MT4 y MT5, spreads competitivos y más de 1000 instrumentos. La educación que ofrecen es útil y el soporte es bueno.',
                pros: ['MT4 y MT5', 'Buena educación', 'Spreads competitivos'],
                cons: ['Depósito mínimo alto'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 15,
                notHelpful: 5
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Ricardo Ortega', email: 'ricardo.ortega@email.com', country: 'Perú' },
                rating: 5,
                title: 'Excelente broker profesional',
                content: 'AvaTrade es un excelente broker profesional. Tienen MT4 y MT5, spreads muy competitivos y más de 1000 instrumentos. El soporte al cliente es profesional y siempre están disponibles. Recomendado.',
                pros: ['MT4 y MT5', 'Spreads competitivos', 'Soporte profesional'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 29,
                notHelpful: 1
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Verónica Sánchez', email: 'veronica.sanchez@email.com', country: 'México' },
                rating: 4,
                title: 'Muy buena experiencia general',
                content: 'He usado AvaTrade durante un año y la experiencia ha sido muy buena. Tienen MT4 y MT5, spreads competitivos y más de 1000 instrumentos. El soporte es bueno y la plataforma es estable.',
                pros: ['MT4 y MT5', 'Spreads competitivos', 'Plataforma estable'],
                cons: ['Depósito mínimo alto'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 4
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Oscar Martínez', email: 'oscar.martinez@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Perfecto para traders experimentados',
                content: 'AvaTrade es perfecto para traders experimentados. Tienen MT4 y MT5, spreads muy competitivos y más de 1000 instrumentos. El soporte al cliente es profesional y siempre están disponibles.',
                pros: ['MT4 y MT5', 'Spreads competitivos', 'Soporte profesional'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 27,
                notHelpful: 1
            },
            {
                broker: avatradeBroker._id,
                user: { name: 'Gabriela Flores', email: 'gabriela.flores@email.com', country: 'Brasil' },
                rating: 4,
                title: 'Broker confiable con buenas herramientas',
                content: 'AvaTrade es un broker confiable con buenas herramientas. Tienen MT4 y MT5, spreads competitivos y más de 1000 instrumentos. El soporte es bueno y la educación es útil.',
                pros: ['MT4 y MT5', 'Buenas herramientas', 'Spreads competitivos'],
                cons: ['Depósito mínimo alto'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 5
            },
            
            // IG Markets Reviews (8 reviews)
            {
                broker: igMarketsBroker._id,
                user: { name: 'Alberto Rodríguez', email: 'alberto.rodriguez@email.com', country: 'México' },
                rating: 5,
                title: 'El mejor broker con más instrumentos',
                content: 'IG Markets es el mejor broker que he usado. Tienen más de 17,000 instrumentos, spreads muy competitivos y una plataforma profesional. La educación es excelente y el soporte es profesional. Recomendado para traders experimentados.',
                pros: ['Más de 17,000 instrumentos', 'Spreads competitivos', 'Plataforma profesional'],
                cons: ['Depósito mínimo alto', 'Complejo para principiantes'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 32,
                notHelpful: 1
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Marina Fernández', email: 'marina.fernandez@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente broker premium',
                content: 'IG Markets es un excelente broker premium. Tienen más de 17,000 instrumentos, spreads muy competitivos y una plataforma profesional. La educación es excelente y el soporte es profesional.',
                pros: ['Más de 17,000 instrumentos', 'Spreads competitivos', 'Educación excelente'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 28,
                notHelpful: 2
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Esteban González', email: 'esteban.gonzalez@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Broker profesional con muchas opciones',
                content: 'IG Markets es un broker profesional con muchas opciones. Tienen más de 17,000 instrumentos, spreads competitivos y una plataforma profesional. Sin embargo, puede ser complejo para principiantes y el depósito mínimo es alto.',
                pros: ['Más de 17,000 instrumentos', 'Plataforma profesional', 'Spreads competitivos'],
                cons: ['Complejo para principiantes', 'Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 19,
                notHelpful: 5
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Claudia Herrera', email: 'claudia.herrera@email.com', country: 'Chile' },
                rating: 5,
                title: 'Perfecto para traders avanzados',
                content: 'IG Markets es perfecto para traders avanzados. Tienen más de 17,000 instrumentos, spreads muy competitivos y una plataforma profesional. La educación es excelente y el soporte es profesional.',
                pros: ['Más de 17,000 instrumentos', 'Spreads competitivos', 'Educación excelente'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 26,
                notHelpful: 1
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Felipe Castro', email: 'felipe.castro@email.com', country: 'Perú' },
                rating: 4,
                title: 'Broker sólido con excelente educación',
                content: 'IG Markets es un broker sólido con excelente educación. Tienen más de 17,000 instrumentos, spreads competitivos y una plataforma profesional. La educación es muy útil y el soporte es bueno.',
                pros: ['Más de 17,000 instrumentos', 'Educación excelente', 'Plataforma profesional'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 4
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Natalia Jiménez', email: 'natalia.jimenez@email.com', country: 'México' },
                rating: 5,
                title: 'El broker más completo',
                content: 'IG Markets es el broker más completo que he usado. Tienen más de 17,000 instrumentos, spreads muy competitivos y una plataforma profesional. La educación es excelente y el soporte es profesional. Recomendado.',
                pros: ['Más de 17,000 instrumentos', 'Spreads competitivos', 'Educación excelente'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 30,
                notHelpful: 1
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Rodrigo Vega', email: 'rodrigo.vega@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Excelente para trading profesional',
                content: 'IG Markets es excelente para trading profesional. Tienen más de 17,000 instrumentos, spreads competitivos y una plataforma profesional. Sin embargo, puede ser complejo para principiantes y el depósito mínimo es alto.',
                pros: ['Más de 17,000 instrumentos', 'Plataforma profesional', 'Spreads competitivos'],
                cons: ['Complejo para principiantes', 'Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 21,
                notHelpful: 6
            },
            {
                broker: igMarketsBroker._id,
                user: { name: 'Carolina Morales', email: 'carolina.morales@email.com', country: 'Brasil' },
                rating: 5,
                title: 'El mejor broker premium',
                content: 'IG Markets es el mejor broker premium que he usado. Tienen más de 17,000 instrumentos, spreads muy competitivos y una plataforma profesional. La educación es excelente y el soporte es profesional. Recomendado para traders experimentados.',
                pros: ['Más de 17,000 instrumentos', 'Spreads competitivos', 'Educación excelente'],
                cons: ['Depósito mínimo alto'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 34,
                notHelpful: 1
            },
            
            // Xlence Reviews (8 reviews)
            {
                broker: xlenceBroker._id,
                user: { name: 'Diego Mendoza', email: 'diego.mendoza@email.com', country: 'México' },
                rating: 5,
                title: 'El mejor broker para LATAM - Excelente experiencia',
                content: 'Xlence es sin duda el mejor broker para traders latinoamericanos. La transparencia en comisiones es excepcional, la plataforma es muy fácil de usar y los cursos de trading son completos. Las promociones para LATAM son generosas y el soporte multilingüe 24/5 es excelente.',
                pros: ['Transparencia total', 'Plataforma fácil de usar', 'Cursos extensos', 'Promociones LATAM'],
                cons: ['Spreads variables'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 28,
                notHelpful: 2
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'Sofia Herrera', email: 'sofia.herrera@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente broker con amplia gama de activos',
                content: 'Xlence ofrece una amplia gama de tipos de activos que me permite diversificar mi cartera. La experiencia de usuario es excepcional y los cursos de trading me han ayudado mucho. Las promociones para LATAM son un gran incentivo.',
                pros: ['Amplia gama de activos', 'Experiencia excelente', 'Cursos útiles'],
                cons: ['Spreads variables'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 22,
                notHelpful: 1
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'Ricardo Vega', email: 'ricardo.vega@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Muy buena opción para traders latinoamericanos',
                content: 'Xlence es una muy buena opción para traders latinoamericanos. La plataforma es intuitiva, los cursos son completos y el soporte multilingüe es excelente. Las promociones para LATAM son atractivas.',
                pros: ['Plataforma intuitiva', 'Cursos completos', 'Soporte multilingüe'],
                cons: ['Spreads variables según mercado'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 18,
                notHelpful: 3
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'Patricia Morales', email: 'patricia.morales@email.com', country: 'Chile' },
                rating: 5,
                title: 'Perfecto para principiantes y avanzados',
                content: 'Xlence es perfecto tanto para principiantes como para traders avanzados. Los cursos extensos ayudan a los nuevos traders, mientras que la amplia gama de activos y la transparencia atraen a traders experimentados. El soporte 24/5 es excelente.',
                pros: ['Perfecto para todos los niveles', 'Cursos extensos', 'Soporte 24/5'],
                cons: ['Spreads variables'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 25,
                notHelpful: 1
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'Fernando Cruz', email: 'fernando.cruz@email.com', country: 'Perú' },
                rating: 4,
                title: 'Broker confiable con excelente educación',
                content: 'Xlence es un broker confiable con excelente educación. Los cursos de trading son muy completos y me han ayudado a mejorar mis estrategias. La plataforma es fácil de usar y el soporte responde rápido.',
                pros: ['Excelente educación', 'Plataforma fácil', 'Buen soporte'],
                cons: ['Spreads variables'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 2
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'Laura Jiménez', email: 'laura.jimenez@email.com', country: 'México' },
                rating: 5,
                title: 'El mejor en transparencia y promociones LATAM',
                content: 'Xlence destaca por su transparencia total en comisiones y las promociones generosas para LATAM. La plataforma es muy fácil de usar y los cursos son completos. Recomendado totalmente.',
                pros: ['Transparencia total', 'Promociones LATAM', 'Fácil de usar'],
                cons: ['Spreads variables'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 30,
                notHelpful: 1
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'Carlos Ramírez', email: 'carlos.ramirez@email.com', country: 'Ecuador' },
                rating: 4,
                title: 'Buena experiencia general',
                content: 'Mi experiencia con Xlence ha sido muy positiva. La plataforma es estable, los cursos son útiles y el soporte multilingüe es excelente. Las promociones para LATAM son un plus importante.',
                pros: ['Plataforma estable', 'Cursos útiles', 'Soporte multilingüe'],
                cons: ['Spreads variables'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 4
            },
            {
                broker: xlenceBroker._id,
                user: { name: 'María Fernández', email: 'maria.fernandez@email.com', country: 'Venezuela' },
                rating: 5,
                title: 'Excelente broker para la región',
                content: 'Xlence es un excelente broker para la región latinoamericana. La amplia gama de activos, la transparencia y las promociones especiales para LATAM lo hacen una opción muy atractiva. El soporte 24/5 es excelente.',
                pros: ['Amplia gama de activos', 'Transparencia', 'Promociones LATAM'],
                cons: ['Spreads variables'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 27,
                notHelpful: 1
            },
            
            // EC Markets Reviews (8 reviews)
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Alejandro Torres', email: 'alejandro.torres@email.com', country: 'México' },
                rating: 5,
                title: 'Excelente con presencia local en México',
                content: 'EC Markets es excelente, especialmente por su presencia local en México. Los spreads son muy competitivos, la ejecución es rápida y las opciones de pago locales facilitan mucho las transacciones. El soporte 24/7 es excepcional.',
                pros: ['Presencia local en México', 'Spreads competitivos', 'Ejecución rápida', 'Pagos locales'],
                cons: ['Depósito mínimo puede ser alto'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 26,
                notHelpful: 2
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Valentina Sánchez', email: 'valentina.sanchez@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Multi-regulado y confiable',
                content: 'EC Markets es multi-regulado y muy confiable. Tienen más de 1,000 instrumentos, spreads competitivos y ejecución rápida. Las opciones de pago locales para LATAM son muy convenientes.',
                pros: ['Multi-regulado', 'Más de 1,000 instrumentos', 'Pagos locales'],
                cons: ['No disponible en todos los países'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 21,
                notHelpful: 1
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Roberto Díaz', email: 'roberto.diaz@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Muy buena opción para LATAM',
                content: 'EC Markets es una muy buena opción para traders latinoamericanos. Los spreads son competitivos, la ejecución es rápida y las opciones de pago locales son convenientes. El soporte 24/7 es excelente.',
                pros: ['Spreads competitivos', 'Ejecución rápida', 'Pagos locales'],
                cons: ['Depósito mínimo puede ser alto'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 3
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Carmen López', email: 'carmen.lopez@email.com', country: 'Chile' },
                rating: 5,
                title: 'Excelente ejecución y soporte',
                content: 'EC Markets tiene excelente ejecución y soporte al cliente 24/7. Los spreads son competitivos y tienen más de 1,000 instrumentos. Las opciones de pago locales facilitan mucho las transacciones.',
                pros: ['Ejecución excelente', 'Soporte 24/7', 'Más de 1,000 instrumentos'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 24,
                notHelpful: 1
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Javier Martínez', email: 'javier.martinez@email.com', country: 'Perú' },
                rating: 4,
                title: 'Broker sólido con buena regulación',
                content: 'EC Markets es un broker sólido con buena regulación múltiple. Los spreads son competitivos y la ejecución es rápida. Las opciones de pago locales son convenientes para traders latinoamericanos.',
                pros: ['Regulación múltiple', 'Spreads competitivos', 'Pagos locales'],
                cons: ['Depósito mínimo puede ser alto'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 15,
                notHelpful: 4
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Isabel García', email: 'isabel.garcia@email.com', country: 'Brasil' },
                rating: 5,
                title: 'Perfecto para traders latinoamericanos',
                content: 'EC Markets es perfecto para traders latinoamericanos. La presencia local en México, los spreads competitivos y las opciones de pago locales lo hacen una excelente opción. El soporte 24/7 es excepcional.',
                pros: ['Presencia local', 'Spreads competitivos', 'Soporte 24/7'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 29,
                notHelpful: 1
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Miguel Ruiz', email: 'miguel.ruiz@email.com', country: 'México' },
                rating: 4,
                title: 'Muy buena experiencia con presencia local',
                content: 'Mi experiencia con EC Markets ha sido muy positiva. La presencia local en México es un gran plus, los spreads son competitivos y las opciones de pago locales facilitan las transacciones.',
                pros: ['Presencia local', 'Spreads competitivos', 'Pagos locales'],
                cons: ['Depósito mínimo puede ser alto'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 19,
                notHelpful: 2
            },
            {
                broker: ecMarketsBroker._id,
                user: { name: 'Lucía Hernández', email: 'lucia.hernandez@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente broker multi-regulado',
                content: 'EC Markets es un excelente broker multi-regulado. Tienen más de 1,000 instrumentos, spreads competitivos y ejecución rápida. Las opciones de pago locales y el soporte 24/7 son excelentes.',
                pros: ['Multi-regulado', 'Más de 1,000 instrumentos', 'Soporte 24/7'],
                cons: ['No disponible en todos los países'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 23,
                notHelpful: 1
            },
            
            // Eightcap Reviews (8 reviews)
            {
                broker: eightcapBroker._id,
                user: { name: 'Daniel Castro', email: 'daniel.castro@email.com', country: 'México' },
                rating: 4,
                title: 'Excelente con TradingView y educación',
                content: 'Eightcap es excelente, especialmente por el charting de TradingView y la sección educativa sólida. El canal de YouTube para LATAM es muy útil y las múltiples licencias Tier 1 dan confianza.',
                pros: ['Charting TradingView', 'Educación sólida', 'Canal YouTube LATAM', 'Licencias Tier 1'],
                cons: ['Menos instrumentos que algunos competidores'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 20,
                notHelpful: 3
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'Sandra Morales', email: 'sandra.morales@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Perfecto para traders que usan TradingView',
                content: 'Eightcap es perfecto para traders que usan TradingView. El charting es excelente, la educación es sólida y el canal de YouTube para LATAM es muy útil. Las múltiples licencias Tier 1 dan confianza.',
                pros: ['TradingView integrado', 'Educación sólida', 'Canal YouTube LATAM'],
                cons: ['Menos instrumentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 18,
                notHelpful: 2
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'Héctor Vega', email: 'hector.vega@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Buena opción con herramientas profesionales',
                content: 'Eightcap es una buena opción con herramientas profesionales como TradingView. La educación es sólida y el canal de YouTube para LATAM es útil. Las múltiples licencias Tier 1 son un plus.',
                pros: ['Herramientas profesionales', 'Educación sólida', 'Licencias Tier 1'],
                cons: ['Menos instrumentos que competidores'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 4
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'Patricia Cruz', email: 'patricia.cruz@email.com', country: 'Chile' },
                rating: 5,
                title: 'Excelente educación y TradingView',
                content: 'Eightcap tiene excelente educación y el charting de TradingView es superior. El canal de YouTube para LATAM es muy útil y las múltiples licencias Tier 1 dan confianza total.',
                pros: ['Educación excelente', 'TradingView superior', 'Canal YouTube LATAM'],
                cons: ['Menos instrumentos'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 22,
                notHelpful: 1
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'Fernando Jiménez', email: 'fernando.jimenez@email.com', country: 'Perú' },
                rating: 4,
                title: 'Broker confiable con TradingView',
                content: 'Eightcap es un broker confiable con TradingView integrado. La educación es sólida y el canal de YouTube para LATAM es útil. Las múltiples licencias Tier 1 son un gran plus.',
                pros: ['TradingView integrado', 'Educación sólida', 'Licencias Tier 1'],
                cons: ['Menos instrumentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 3
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'Laura Ramírez', email: 'laura.ramirez@email.com', country: 'Brasil' },
                rating: 5,
                title: 'Perfecto para análisis técnico avanzado',
                content: 'Eightcap es perfecto para análisis técnico avanzado con TradingView. La educación es sólida, el canal de YouTube para LATAM es muy útil y las múltiples licencias Tier 1 dan confianza.',
                pros: ['TradingView avanzado', 'Educación sólida', 'Licencias Tier 1'],
                cons: ['Menos instrumentos'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 25,
                notHelpful: 1
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'Carlos Fernández', email: 'carlos.fernandez@email.com', country: 'México' },
                rating: 4,
                title: 'Buena opción con herramientas profesionales',
                content: 'Eightcap es una buena opción con herramientas profesionales. El charting de TradingView es excelente y la educación es sólida. El canal de YouTube para LATAM es muy útil.',
                pros: ['Herramientas profesionales', 'TradingView', 'Educación sólida'],
                cons: ['Menos instrumentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 2
            },
            {
                broker: eightcapBroker._id,
                user: { name: 'María Torres', email: 'maria.torres@email.com', country: 'Colombia' },
                rating: 5,
                title: 'Excelente con múltiples licencias Tier 1',
                content: 'Eightcap es excelente con múltiples licencias Tier 1 que dan confianza total. El charting de TradingView es superior, la educación es sólida y el canal de YouTube para LATAM es muy útil.',
                pros: ['Licencias Tier 1', 'TradingView superior', 'Educación sólida'],
                cons: ['Menos instrumentos'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 21,
                notHelpful: 1
            },
            
            // Deriv Reviews (8 reviews)
            {
                broker: derivBroker._id,
                user: { name: 'Roberto Sánchez', email: 'roberto.sanchez@email.com', country: 'México' },
                rating: 4,
                title: 'Buena opción para CFDs y opciones',
                content: 'Deriv es una buena opción para trading de CFDs y opciones. Tienen más de 500 instrumentos, amplia elección de plataformas y el depósito mínimo es muy bajo. El soporte 24/7 es excelente.',
                pros: ['CFDs y opciones', 'Amplia elección de plataformas', 'Depósito mínimo bajo', 'Soporte 24/7'],
                cons: ['Menos instrumentos que competidores'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 15,
                notHelpful: 3
            },
            {
                broker: derivBroker._id,
                user: { name: 'Sofia Díaz', email: 'sofia.diaz@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Perfecto para principiantes con depósito bajo',
                content: 'Deriv es perfecto para principiantes con depósito mínimo muy bajo. Tienen más de 500 instrumentos, amplia elección de plataformas y el soporte 24/7 es excelente. Ideal para empezar.',
                pros: ['Depósito mínimo muy bajo', 'Amplia elección de plataformas', 'Soporte 24/7'],
                cons: ['Menos instrumentos'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 19,
                notHelpful: 2
            },
            {
                broker: derivBroker._id,
                user: { name: 'Diego López', email: 'diego.lopez@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Buena plataforma para opciones',
                content: 'Deriv es una buena plataforma para trading de opciones. Tienen más de 500 instrumentos, amplia elección de plataformas y el soporte 24/7 es excelente. El depósito mínimo bajo es un plus.',
                pros: ['Trading de opciones', 'Amplia elección de plataformas', 'Soporte 24/7'],
                cons: ['Menos instrumentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 4
            },
            {
                broker: derivBroker._id,
                user: { name: 'Valentina Martínez', email: 'valentina.martinez@email.com', country: 'Chile' },
                rating: 5,
                title: 'Excelente para empezar con poco capital',
                content: 'Deriv es excelente para empezar con poco capital. El depósito mínimo es muy bajo, tienen más de 500 instrumentos y el soporte 24/7 es excelente. La plataforma es intuitiva.',
                pros: ['Depósito mínimo muy bajo', 'Más de 500 instrumentos', 'Soporte 24/7'],
                cons: ['Menos instrumentos'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 23,
                notHelpful: 1
            },
            {
                broker: derivBroker._id,
                user: { name: 'Ricardo García', email: 'ricardo.garcia@email.com', country: 'Perú' },
                rating: 4,
                title: 'Buena opción con múltiples plataformas',
                content: 'Deriv es una buena opción con múltiples plataformas disponibles. Tienen más de 500 instrumentos, trading de CFDs y opciones, y el soporte 24/7 es excelente.',
                pros: ['Múltiples plataformas', 'CFDs y opciones', 'Soporte 24/7'],
                cons: ['Menos instrumentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 13,
                notHelpful: 3
            },
            {
                broker: derivBroker._id,
                user: { name: 'Carmen Ruiz', email: 'carmen.ruiz@email.com', country: 'Brasil' },
                rating: 4,
                title: 'Plataforma intuitiva para CFDs',
                content: 'Deriv tiene una plataforma intuitiva para trading de CFDs. Tienen más de 500 instrumentos, amplia elección de plataformas y el depósito mínimo es muy bajo. El soporte 24/7 es excelente.',
                pros: ['Plataforma intuitiva', 'Depósito bajo', 'Soporte 24/7'],
                cons: ['Menos instrumentos'],
                experience: 'beginner',
                tradingDuration: 'less-than-1-year',
                isApproved: true,
                verified: true,
                helpful: 18,
                notHelpful: 2
            },
            {
                broker: derivBroker._id,
                user: { name: 'Javier Hernández', email: 'javier.hernandez@email.com', country: 'México' },
                rating: 5,
                title: 'Excelente soporte 24/7',
                content: 'Deriv tiene excelente soporte al cliente 24/7. Tienen más de 500 instrumentos, amplia elección de plataformas y el depósito mínimo es muy bajo. Ideal para traders que necesitan soporte continuo.',
                pros: ['Soporte 24/7 excelente', 'Amplia elección de plataformas', 'Depósito bajo'],
                cons: ['Menos instrumentos'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 20,
                notHelpful: 1
            },
            {
                broker: derivBroker._id,
                user: { name: 'Isabel Castro', email: 'isabel.castro@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Buena opción para trading de opciones',
                content: 'Deriv es una buena opción para trading de opciones. Tienen más de 500 instrumentos, amplia elección de plataformas y el soporte 24/7 es excelente. El depósito mínimo bajo es un plus importante.',
                pros: ['Trading de opciones', 'Amplia elección de plataformas', 'Depósito bajo'],
                cons: ['Menos instrumentos'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 3
            },
            
            // TMGM Reviews (8 reviews)
            {
                broker: tmgmBroker._id,
                user: { name: 'Miguel Vega', email: 'miguel.vega@email.com', country: 'México' },
                rating: 4,
                title: 'Broker global con regulación sólida',
                content: 'TMGM es un broker global con regulación sólida ASIC y FSA. Los spreads son competitivos, tienen plataformas MetaTrader y el soporte multilingüe es bueno. Buena opción para traders latinoamericanos.',
                pros: ['Regulación ASIC y FSA', 'Spreads competitivos', 'Plataformas MetaTrader'],
                cons: ['Menos conocido en LATAM'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 14,
                notHelpful: 4
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Lucía Morales', email: 'lucia.morales@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Buena opción con regulación ASIC',
                content: 'TMGM es una buena opción con regulación ASIC que da confianza. Los spreads son competitivos, tienen plataformas MetaTrader y el soporte multilingüe es útil. Buena ejecución.',
                pros: ['Regulación ASIC', 'Spreads competitivos', 'Soporte multilingüe'],
                cons: ['Menos conocido en LATAM'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 16,
                notHelpful: 3
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Daniel Cruz', email: 'daniel.cruz@email.com', country: 'Argentina' },
                rating: 4,
                title: 'Broker confiable con MetaTrader',
                content: 'TMGM es un broker confiable con plataformas MetaTrader. Los spreads son competitivos, la regulación ASIC y FSA es sólida y el soporte multilingüe es bueno. Buena opción para traders experimentados.',
                pros: ['Plataformas MetaTrader', 'Regulación sólida', 'Spreads competitivos'],
                cons: ['Menos conocido en LATAM'],
                experience: 'advanced',
                tradingDuration: '3-5-years',
                isApproved: true,
                verified: true,
                helpful: 15,
                notHelpful: 4
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Sandra Jiménez', email: 'sandra.jimenez@email.com', country: 'Chile' },
                rating: 4,
                title: 'Buena ejecución y spreads competitivos',
                content: 'TMGM tiene buena ejecución y spreads competitivos. La regulación ASIC y FSA es sólida, tienen plataformas MetaTrader y el soporte multilingüe es útil. Buena opción para LATAM.',
                pros: ['Ejecución buena', 'Spreads competitivos', 'Regulación sólida'],
                cons: ['Menos conocido en LATAM'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 13,
                notHelpful: 3
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Héctor Ramírez', email: 'hector.ramirez@email.com', country: 'Perú' },
                rating: 4,
                title: 'Broker sólido con presencia global',
                content: 'TMGM es un broker sólido con presencia global. La regulación ASIC y FSA es sólida, los spreads son competitivos y tienen plataformas MetaTrader. El soporte multilingüe es bueno.',
                pros: ['Presencia global', 'Regulación sólida', 'Plataformas MetaTrader'],
                cons: ['Menos conocido en LATAM'],
                experience: 'advanced',
                tradingDuration: 'more-than-5-years',
                isApproved: true,
                verified: true,
                helpful: 18,
                notHelpful: 2
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Patricia Fernández', email: 'patricia.fernandez@email.com', country: 'Brasil' },
                rating: 4,
                title: 'Buena opción con regulación múltiple',
                content: 'TMGM es una buena opción con regulación múltiple ASIC y FSA. Los spreads son competitivos, tienen plataformas MetaTrader y el soporte multilingüe es útil. Buena ejecución.',
                pros: ['Regulación múltiple', 'Spreads competitivos', 'Soporte multilingüe'],
                cons: ['Menos conocido en LATAM'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 17,
                notHelpful: 3
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Fernando Torres', email: 'fernando.torres@email.com', country: 'México' },
                rating: 4,
                title: 'Broker confiable con MetaTrader',
                content: 'TMGM es un broker confiable con plataformas MetaTrader. La regulación ASIC y FSA es sólida, los spreads son competitivos y el soporte multilingüe es bueno. Buena opción para traders latinoamericanos.',
                pros: ['Plataformas MetaTrader', 'Regulación sólida', 'Spreads competitivos'],
                cons: ['Menos conocido en LATAM'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 12,
                notHelpful: 4
            },
            {
                broker: tmgmBroker._id,
                user: { name: 'Laura Sánchez', email: 'laura.sanchez@email.com', country: 'Colombia' },
                rating: 4,
                title: 'Buena experiencia con regulación ASIC',
                content: 'Mi experiencia con TMGM ha sido positiva. La regulación ASIC da confianza, los spreads son competitivos y tienen plataformas MetaTrader. El soporte multilingüe es útil aunque menos conocido en LATAM.',
                pros: ['Regulación ASIC', 'Spreads competitivos', 'Plataformas MetaTrader'],
                cons: ['Menos conocido en LATAM'],
                experience: 'intermediate',
                tradingDuration: '1-3-years',
                isApproved: true,
                verified: true,
                helpful: 11,
                notHelpful: 5
            }
        ];

        for (const reviewData of reviews) {
            const review = new Review(reviewData);
            await review.save();
        }
        console.log('✅ Reviews created');

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- 1 Admin user created`);
        console.log(`- ${categories.length} Categories created`);
        console.log(`- ${brokers.length} Brokers created`);
        console.log(`- ${reviews.length} Reviews created`);
        console.log('\n🔑 Admin credentials:');
        console.log('Email: admin@brokersconfiables.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run seeding
seedDatabase();
