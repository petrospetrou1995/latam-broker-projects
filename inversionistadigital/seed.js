const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Broker = require('./models/Broker');
const Category = require('./models/Category');
const Review = require('./models/Review');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latam-broker-reviews', {
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
            email: 'admin@latambrokerreviews.com',
            password: 'admin123',
            role: 'admin'
        });
        await adminUser.save();
        console.log('✅ Admin user created');

        // Create categories
        const categories = [
            {
                name: 'Forex',
                slug: 'forex',
                description: 'Brokers especializados en trading de divisas',
                icon: 'fas fa-exchange-alt',
                color: '#3498db',
                sortOrder: 1
            },
            {
                name: 'Acciones',
                slug: 'stocks',
                description: 'Brokers para trading de acciones y mercados bursátiles',
                icon: 'fas fa-chart-line',
                color: '#27ae60',
                sortOrder: 2
            },
            {
                name: 'Criptomonedas',
                slug: 'crypto',
                description: 'Brokers que ofrecen trading de criptomonedas',
                icon: 'fab fa-bitcoin',
                color: '#f39c12',
                sortOrder: 3
            },
            {
                name: 'CFDs',
                slug: 'cfd',
                description: 'Brokers especializados en contratos por diferencia',
                icon: 'fas fa-chart-bar',
                color: '#e74c3c',
                sortOrder: 4
            },
            {
                name: 'Commodities',
                slug: 'commodities',
                description: 'Brokers para trading de materias primas',
                icon: 'fas fa-seedling',
                color: '#9b59b6',
                sortOrder: 5
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
                category: 'forex',
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
                category: 'forex',
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
                category: 'crypto',
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
                category: 'cfd',
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
                category: 'forex',
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
                category: 'stocks',
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
        console.log('Email: admin@latambrokerreviews.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run seeding
seedDatabase();
