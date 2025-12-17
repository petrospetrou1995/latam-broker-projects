const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Complete navigation translations mapped to nav keys
const completeNavTranslations = {
    rankingbrokerslatam: {
        es: {
            home: 'Inicio',
            top10: 'Top 10',
            rankingmensual: 'Ranking Mensual',
            porpaís: 'Por País',
            mejoresspreads: 'Mejores Spreads',
            comparar: 'Comparar',
            comparar3brokers: 'Comparar 3 Brokers',
            spreadsenvivo: 'Spreads en Vivo',
            métodosdepago: 'Métodos de Pago',
            copytrading: 'Copy Trading',
            reseñas: 'Reseñas',
            contacto: 'Contacto'
        },
        en: {
            home: 'Home',
            top10: 'Top 10',
            rankingmensual: 'Monthly Ranking',
            porpaís: 'By Country',
            mejoresspreads: 'Best Spreads',
            comparar: 'Compare',
            comparar3brokers: 'Compare 3 Brokers',
            spreadsenvivo: 'Live Spreads',
            métodosdepago: 'Payment Methods',
            copytrading: 'Copy Trading',
            reseñas: 'Reviews',
            contacto: 'Contact'
        }
    },
    inversionistadigital: {
        es: {
            inicio: 'Inicio',
            accionesusa: 'Acciones USA',
            cómocomprar: 'Cómo Comprar',
            brokersrecomendados: 'Brokers Recomendados',
            accionesfraccionarias: 'Acciones Fraccionarias',
            crypto: 'Crypto',
            onrampslocales: 'On-Ramps Locales',
            mxncopclpausdt: 'MXN/COP/CLP a USDT',
            wallets: 'Wallets',
            etfs: 'ETFs',
            neobancos: 'Neo-Bancos',
            blog: 'Blog',
            contacto: 'Contacto'
        },
        en: {
            inicio: 'Home',
            accionesusa: 'US Stocks',
            cómocomprar: 'How to Buy',
            brokersrecomendados: 'Recommended Brokers',
            accionesfraccionarias: 'Fractional Shares',
            crypto: 'Crypto',
            onrampslocales: 'Local On-Ramps',
            mxncopclpausdt: 'MXN/COP/CLP to USDT',
            wallets: 'Wallets',
            etfs: 'ETFs',
            neobancos: 'Neo-Banks',
            blog: 'Blog',
            contacto: 'Contact'
        }
    },
    zonatradinglatam: {
        es: {
            inicio: 'Inicio',
            daytrading: 'Day Trading',
            brokersrápidos: 'Brokers Rápidos',
            velocidadejecución: 'Velocidad Ejecución',
            pinglatam: 'Ping LATAM',
            forexmajors: 'Forex Majors',
            usdmxn: 'USD/MXN',
            usdbrl: 'USD/BRL',
            usdclp: 'USD/CLP',
            plataformas: 'Plataformas',
            señales: 'Señales',
            appsmóviles: 'Apps Móviles',
            reseñas: 'Reseñas'
        },
        en: {
            inicio: 'Home',
            daytrading: 'Day Trading',
            brokersrápidos: 'Fast Brokers',
            velocidadejecución: 'Execution Speed',
            pinglatam: 'LATAM Ping',
            forexmajors: 'Forex Majors',
            usdmxn: 'USD/MXN',
            usdbrl: 'USD/BRL',
            usdclp: 'USD/CLP',
            plataformas: 'Platforms',
            señales: 'Signals',
            appsmóviles: 'Mobile Apps',
            reseñas: 'Reviews'
        }
    },
    brokersconfiables: {
        es: {
            inicio: 'Inicio',
            seguridad: 'Seguridad',
            alertasdeestafas: 'Alertas de Estafas',
            verificadorregulación: 'Verificador Regulación',
            protecciónfondos: 'Protección Fondos',
            verificación: 'Verificación',
            reseñasverificadas: 'Reseñas Verificadas',
            esseguro: '¿Es Seguro?',
            soporteespañol: 'Soporte Español',
            brokers: 'Brokers',
            guías: 'Guías',
            blog: 'Blog',
            contacto: 'Contacto'
        },
        en: {
            inicio: 'Home',
            seguridad: 'Security',
            alertasdeestafas: 'Scam Alerts',
            verificadorregulación: 'Regulation Checker',
            protecciónfondos: 'Fund Protection',
            verificación: 'Verification',
            reseñasverificadas: 'Verified Reviews',
            esseguro: 'Is It Safe?',
            soporteespañol: 'Spanish Support',
            brokers: 'Brokers',
            guías: 'Guides',
            blog: 'Blog',
            contacto: 'Contact'
        }
    },
    rutadetrading: {
        es: {
            inicio: 'Inicio',
            guías: 'Guías',
            pasoapaso: 'Paso a Paso',
            porpaís: 'Por País',
            primeraoperación: 'Primera Operación',
            recursos: 'Recursos',
            academia: 'Academia',
            cuentasdemo: 'Cuentas Demo',
            glosario: 'Glosario',
            matchmaker: 'Matchmaker',
            brokers: 'Brokers',
            blog: 'Blog',
            sobrenosotros: 'Sobre Nosotros'
        },
        en: {
            inicio: 'Home',
            guías: 'Guides',
            pasoapaso: 'Step by Step',
            porpaís: 'By Country',
            primeraoperación: 'First Trade',
            recursos: 'Resources',
            academia: 'Academy',
            cuentasdemo: 'Demo Accounts',
            glosario: 'Glossary',
            matchmaker: 'Matchmaker',
            brokers: 'Brokers',
            blog: 'Blog',
            sobrenosotros: 'About Us'
        }
    },
    comparativaforex: {
        es: {
            inicio: 'Inicio',
            spreads: 'Spreads',
            tablasenvivo: 'Tablas en Vivo',
            compararcostos: 'Comparar Costos',
            mejoresspreads: 'Mejores Spreads',
            apalancamiento: 'Apalancamiento',
            altoapalancamiento: 'Alto Apalancamiento',
            '1:500+': '1:500+',
            swapfree: 'Swap-Free',
            ecnvsmm: 'ECN vs MM',
            paresexóticos: 'Pares Exóticos',
            brokers: 'Brokers',
            reseñas: 'Reseñas'
        },
        en: {
            inicio: 'Home',
            spreads: 'Spreads',
            tablasenvivo: 'Live Tables',
            compararcostos: 'Compare Costs',
            mejoresspreads: 'Best Spreads',
            apalancamiento: 'Leverage',
            altoapalancamiento: 'High Leverage',
            '1:500+': '1:500+',
            swapfree: 'Swap-Free',
            ecnvsmm: 'ECN vs MM',
            paresexóticos: 'Exotic Pairs',
            brokers: 'Brokers',
            reseñas: 'Reviews'
        }
    },
    plataformasdeinversion: {
        es: {
            inicio: 'Inicio',
            multiactivo: 'Multi-Activo',
            accionescrypto: 'Acciones + Crypto',
            forexcfds: 'Forex + CFDs',
            todaslasopciones: 'Todas las Opciones',
            inversión: 'Inversión',
            dividendos: 'Dividendos',
            etfs: 'ETFs',
            ipos: 'IPOs',
            roboadvisors: 'Robo-Advisors',
            uxscore: 'UX Score',
            brokers: 'Brokers',
            blog: 'Blog',
            contacto: 'Contacto'
        },
        en: {
            inicio: 'Home',
            multiactivo: 'Multi-Asset',
            accionescrypto: 'Stocks + Crypto',
            forexcfds: 'Forex + CFDs',
            todaslasopciones: 'All Options',
            inversión: 'Investment',
            dividendos: 'Dividends',
            etfs: 'ETFs',
            ipos: 'IPOs',
            roboadvisors: 'Robo-Advisors',
            uxscore: 'UX Score',
            brokers: 'Brokers',
            blog: 'Blog',
            contacto: 'Contact'
        }
    },
    guiadebrokerssudamerica: {
        es: {
            inicio: 'Inicio',
            países: 'Países',
            argentina: 'Argentina',
            uruguay: 'Uruguay',
            paraguay: 'Paraguay',
            cobertura: 'Cobertura',
            oroyplata: 'Oro y Plata',
            stablecoins: 'Stablecoins',
            inflación: 'Inflación',
            p2p: 'P2P',
            transferencias: 'Transferencias',
            brokers: 'Brokers',
            noticias: 'Noticias'
        },
        en: {
            inicio: 'Home',
            países: 'Countries',
            argentina: 'Argentina',
            uruguay: 'Uruguay',
            paraguay: 'Paraguay',
            cobertura: 'Hedging',
            oroyplata: 'Gold and Silver',
            stablecoins: 'Stablecoins',
            inflación: 'Inflation',
            p2p: 'P2P',
            transferencias: 'Transfers',
            brokers: 'Brokers',
            noticias: 'News'
        }
    },
    topbrokersmexicoymas: {
        es: {
            inicio: 'Inicio',
            méxico: 'México',
            spei: 'SPEI',
            cnbv: 'CNBV',
            impuestos: 'Impuestos',
            latam: 'LATAM',
            otropaíses: 'Otros Países',
            guíasporpaís: 'Guías por País',
            brokersusa: 'Brokers USA',
            reportes: 'Reportes',
            tradingmxn: 'Trading MXN',
            kitsinicio: 'Kits Inicio',
            contacto: 'Contacto'
        },
        en: {
            inicio: 'Home',
            méxico: 'Mexico',
            spei: 'SPEI',
            cnbv: 'CNBV',
            impuestos: 'Taxes',
            latam: 'LATAM',
            otropaíses: 'Other Countries',
            guíasporpaís: 'Guides by Country',
            brokersusa: 'US Brokers',
            reportes: 'Reports',
            tradingmxn: 'Trading MXN',
            kitsinicio: 'Starter Kits',
            contacto: 'Contact'
        }
    },
    capitallatamreviews: {
        es: {
            inicio: 'Inicio',
            profesional: 'Profesional',
            cuentaspro: 'Cuentas Pro',
            dma: 'DMA',
            apitrading: 'API Trading',
            seguridad: 'Seguridad',
            scorecard50pts: 'Scorecard 50pts',
            auditorías: 'Auditorías',
            protección: 'Protección',
            gestión: 'Gestión',
            pammmam: 'PAMM/MAM',
            brokers: 'Brokers',
            reseñas: 'Reseñas',
            contacto: 'Contacto'
        },
        en: {
            inicio: 'Home',
            profesional: 'Professional',
            cuentaspro: 'Pro Accounts',
            dma: 'DMA',
            apitrading: 'API Trading',
            seguridad: 'Security',
            scorecard50pts: 'Scorecard 50pts',
            auditorías: 'Audits',
            protección: 'Protection',
            gestión: 'Management',
            pammmam: 'PAMM/MAM',
            brokers: 'Brokers',
            reseñas: 'Reviews',
            contacto: 'Contact'
        }
    }
};

function finalizeTranslations(projectKey, translations) {
    console.log(`\n📝 Finalizing translations: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const languagesPath = path.join(projectDir, 'public', 'js', 'languages.js');
    
    if (!fs.existsSync(languagesPath)) {
        console.log(`⚠️  Languages file not found`);
        return;
    }
    
    let content = fs.readFileSync(languagesPath, 'utf8');
    
    // Merge custom nav translations into nav section for both languages
    const esNav = translations.es;
    const enNav = translations.en;
    
    // Update Spanish nav section
    const esNavPattern = /(es: \{[\s\S]*?nav: \{)([\s\S]*?)(\},)/;
    if (esNavPattern.test(content)) {
        content = content.replace(esNavPattern, (match, before, navContent, after) => {
            // Merge custom nav keys into nav section
            let updatedNav = navContent;
            Object.keys(esNav).forEach(key => {
                const value = esNav[key];
                // Add if not already present
                if (!updatedNav.includes(`"${key}":`)) {
                    updatedNav += `            ${key}: '${value}',\n`;
                }
            });
            return before + updatedNav + after;
        });
    }
    
    // Update English nav section
    const enNavPattern = /(en: \{[\s\S]*?nav: \{)([\s\S]*?)(\},)/;
    if (enNavPattern.test(content)) {
        content = content.replace(enNavPattern, (match, before, navContent, after) => {
            let updatedNav = navContent;
            Object.keys(enNav).forEach(key => {
                const value = enNav[key];
                if (!updatedNav.includes(`"${key}":`)) {
                    updatedNav += `            ${key}: '${value}',\n`;
                }
            });
            return before + updatedNav + after;
        });
    }
    
    fs.writeFileSync(languagesPath, content);
    console.log(`   ✅ Finalized translations`);
}

// Update all projects
console.log('🚀 Finalizing translations for all projects...\n');

Object.keys(completeNavTranslations).forEach((key) => {
    finalizeTranslations(key, completeNavTranslations[key]);
});

console.log('\n✨ All translations finalized!');

