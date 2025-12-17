const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Project-specific content
const projectContent = {
    rankingbrokerslatam: {
        whyChoose: {
            title: "¿Por Qué Elegir RankingBrokersLatam?",
            features: [
                {
                    icon: "fas fa-trophy",
                    title: "Rankings Actualizados Mensualmente",
                    description: "Nuestros rankings se actualizan cada mes basados en spreads reales, regulación y reseñas verificadas."
                },
                {
                    icon: "fas fa-filter",
                    title: "Filtros por País",
                    description: "Encuentra los mejores brokers específicos para tu país: México, Brasil, Argentina y más."
                },
                {
                    icon: "fas fa-chart-line",
                    title: "Comparación de Spreads",
                    description: "Compara spreads en tiempo real y encuentra los brokers más económicos para tu estilo de trading."
                },
                {
                    icon: "fas fa-credit-card",
                    title: "Métodos de Pago Locales",
                    description: "Brokers que aceptan Mercado Pago, Rapipago, Boleto y otros métodos de pago latinoamericanos."
                }
            ]
        },
        about: {
            title: "Acerca de RankingBrokersLatam",
            description1: "Somos la plataforma líder en rankings de brokers para LATAM. Actualizamos mensualmente nuestros rankings basados en datos reales de spreads, regulación y reseñas de usuarios verificados.",
            description2: "Nuestro enfoque está en ayudarte a encontrar el broker perfecto según tu país, estilo de trading y presupuesto. Filtramos por país, comparamos spreads y destacamos métodos de pago locales."
        }
    },
    inversionistadigital: {
        whyChoose: {
            title: "¿Por Qué Elegir InversionistaDigital?",
            features: [
                {
                    icon: "fas fa-dollar-sign",
                    title: "Acciones de EE.UU. desde LATAM",
                    description: "Guías completas para comprar Tesla, Apple y otras acciones estadounidenses desde América Latina."
                },
                {
                    icon: "fas fa-coins",
                    title: "Crypto On-Ramps Locales",
                    description: "Brokers y exchanges con pares fiat locales: MXN, COP, CLP a USDT y otras criptomonedas."
                },
                {
                    icon: "fas fa-share-alt",
                    title: "Acciones Fraccionarias",
                    description: "Brokers que permiten invertir con poco capital mediante acciones fraccionarias."
                },
                {
                    icon: "fas fa-university",
                    title: "Integración con Neo-Bancos",
                    description: "Brokers que se integran con NuBank, Albo, Ualá y otros neo-bancos populares en LATAM."
                }
            ]
        },
        about: {
            title: "Acerca de InversionistaDigital",
            description1: "Somos la plataforma especializada en inversión digital para América Latina. Ayudamos a inversores a acceder a mercados globales desde sus países.",
            description2: "Nuestro enfoque está en democratizar el acceso a inversiones: acciones de EE.UU., crypto, ETFs y más. Proporcionamos guías detalladas sobre brokers que aceptan métodos de pago locales y ofrecen soporte en español y portugués."
        }
    },
    zonatradinglatam: {
        whyChoose: {
            title: "¿Por Qué Elegir ZonaTradingLatam?",
            features: [
                {
                    icon: "fas fa-tachometer-alt",
                    title: "Velocidad de Ejecución",
                    description: "Análisis detallado de ping y velocidad de ejecución para day trading en LATAM."
                },
                {
                    icon: "fas fa-exchange-alt",
                    title: "Forex Majors Locales",
                    description: "Guías especializadas en USD/MXN, USD/BRL, USD/CLP y otros pares relevantes para LATAM."
                },
                {
                    icon: "fas fa-mobile-alt",
                    title: "Apps Móviles Optimizadas",
                    description: "Reseñas de las mejores apps Android para trading móvil, el sistema operativo dominante en LATAM."
                },
                {
                    icon: "fas fa-signal",
                    title: "Señales y Bots",
                    description: "Análisis de servicios de señales y bots populares en la región latinoamericana."
                }
            ]
        },
        about: {
            title: "Acerca de ZonaTradingLatam",
            description1: "Somos la zona de trading activo para América Latina. Nos especializamos en brokers optimizados para day trading, scalping y trading de alta frecuencia.",
            description2: "Nuestro enfoque está en la velocidad: analizamos ping, latencia y velocidad de ejecución. También cubrimos plataformas como TradingView y MT5, servicios de señales y las mejores apps móviles para Android."
        }
    },
    brokersconfiables: {
        whyChoose: {
            title: "¿Por Qué Elegir BrokersConfiables?",
            features: [
                {
                    icon: "fas fa-exclamation-triangle",
                    title: "Centro de Alertas de Estafas",
                    description: "Reporta y consulta brokers no regulados y entidades fraudulentas en nuestra base de datos."
                },
                {
                    icon: "fas fa-check-circle",
                    title: "Verificador de Regulación",
                    description: "Explicamos ASIC, FCA y regulaciones locales. Verifica si tu broker está realmente regulado."
                },
                {
                    icon: "fas fa-shield-alt",
                    title: "Protección de Fondos",
                    description: "Análisis detallado de qué brokers tienen seguro de depósitos y protección de fondos."
                },
                {
                    icon: "fas fa-user-check",
                    title: "Reseñas Verificadas",
                    description: "Todas las reseñas son verificadas y filtradas por país para garantizar autenticidad."
                }
            ]
        },
        about: {
            title: "Acerca de BrokersConfiables",
            description1: "Somos la autoridad en seguridad y confiabilidad de brokers para LATAM. Tu seguridad es nuestra máxima prioridad.",
            description2: "Mantenemos un centro de alertas de estafas, verificamos regulaciones y analizamos protección de fondos. Todas nuestras reseñas son verificadas y filtradas por país para garantizar que encuentres información confiable sobre brokers seguros."
        }
    },
    rutadetrading: {
        whyChoose: {
            title: "¿Por Qué Elegir RutaDeTrading?",
            features: [
                {
                    icon: "fas fa-map-marked-alt",
                    title: "Guías Paso a Paso",
                    description: "Guías detalladas como 'Tu Primera Operación en Chile' con instrucciones claras y fáciles de seguir."
                },
                {
                    icon: "fas fa-search-dollar",
                    title: "Matchmaker de Capital",
                    description: "Encuentra brokers basados en el tamaño de tu depósito: desde $10 hasta $1000 o más."
                },
                {
                    icon: "fas fa-play-circle",
                    title: "Cuentas Demo Gratuitas",
                    description: "Lista de los mejores brokers con cuentas demo para practicar sin riesgo."
                },
                {
                    icon: "fas fa-graduation-cap",
                    title: "Academia Gratuita",
                    description: "Cursos en video, PDFs y recursos educativos gratuitos para aprender trading."
                }
            ]
        },
        about: {
            title: "Acerca de RutaDeTrading",
            description1: "Somos tu guía completa en el viaje del trading. Desde principiante hasta avanzado, te acompañamos en cada paso.",
            description2: "Proporcionamos guías paso a paso específicas por país, ayudamos a encontrar brokers según tu capital disponible y ofrecemos una academia gratuita con cursos, videos y PDFs. También destacamos cuentas micro y cent para principiantes."
        }
    },
    comparativaforex: {
        whyChoose: {
            title: "¿Por Qué Elegir ComparativaForex?",
            features: [
                {
                    icon: "fas fa-table",
                    title: "Tablas de Spreads en Vivo",
                    description: "Compara spreads en tiempo real de todos los brokers para encontrar los mejores precios."
                },
                {
                    icon: "fas fa-arrows-alt-v",
                    title: "Alto Apalancamiento",
                    description: "Brokers que ofrecen apalancamiento 1:500+ popular en la región latinoamericana."
                },
                {
                    icon: "fas fa-ban",
                    title: "Cuentas Swap-Free",
                    description: "Brokers con cuentas swap-free ideales para traders que mantienen posiciones a largo plazo."
                },
                {
                    icon: "fas fa-code-branch",
                    title: "ECN vs Market Maker",
                    description: "Análisis técnico profundo de modelos ECN y Market Maker para ayudarte a elegir."
                }
            ]
        },
        about: {
            title: "Acerca de ComparativaForex",
            description1: "Somos especialistas en comparativas de brokers Forex para LATAM. Nos enfocamos en spreads, apalancamiento y condiciones técnicas.",
            description2: "Proporcionamos tablas de spreads en vivo, analizamos brokers con alto apalancamiento y cuentas swap-free. También cubrimos pares exóticos latinoamericanos y servicios VPS para trading automatizado en zonas horarias de LATAM."
        }
    },
    plataformasdeinversion: {
        whyChoose: {
            title: "¿Por Qué Elegir PlataformasDeInversion?",
            features: [
                {
                    icon: "fas fa-layer-group",
                    title: "Multi-Activo",
                    description: "Brokers que ofrecen acciones, crypto, forex y más en una sola plataforma integrada."
                },
                {
                    icon: "fas fa-money-bill-wave",
                    title: "Inversión en Dividendos",
                    description: "Plataformas ideales para construir un portafolio de dividendos a largo plazo."
                },
                {
                    icon: "fas fa-robot",
                    title: "Robo-Advisors",
                    description: "Opciones de inversión automatizada disponibles en América Latina."
                },
                {
                    icon: "fas fa-star",
                    title: "Score de UX",
                    description: "Calificaciones detalladas de interfaz y experiencia de usuario de cada plataforma."
                }
            ]
        },
        about: {
            title: "Acerca de PlataformasDeInversion",
            description1: "Somos la plataforma líder en reseñas de brokers multi-activo para LATAM. Nos enfocamos en inversión, no solo trading.",
            description2: "Analizamos brokers que ofrecen acciones, crypto, forex y más. Cubrimos inversión en dividendos, acceso a IPOs, robo-advisors y proporcionamos scores detallados de UX/UI para ayudarte a encontrar la plataforma perfecta."
        }
    },
    guiadebrokerssudamerica: {
        whyChoose: {
            title: "¿Por Qué Elegir GuiadeBrokersSudamerica?",
            features: [
                {
                    icon: "fas fa-map",
                    title: "Enfoque Regional",
                    description: "Guías específicas para Argentina, Uruguay y Paraguay con información local detallada."
                },
                {
                    icon: "fas fa-coins",
                    title: "Cobertura contra Inflación",
                    description: "Brokers especializados en oro, plata y stablecoins para proteger tu capital."
                },
                {
                    icon: "fas fa-users",
                    title: "Trading P2P",
                    description: "Plataformas que facilitan transacciones peer-to-peer en la región."
                },
                {
                    icon: "fas fa-university",
                    title: "Transferencias Bancarias",
                    description: "Guías completas sobre depósitos bancarios locales y transferencias."
                }
            ]
        },
        about: {
            title: "Acerca de GuiadeBrokersSudamerica",
            description1: "Somos la guía especializada en brokers para el Cono Sur de América Latina. Nos enfocamos en Argentina, Uruguay y Paraguay.",
            description2: "Proporcionamos información específica sobre métodos de pago locales, brokers para cobertura contra inflación, trading P2P y transferencias bancarias. También mantenemos un calendario de eventos locales y noticias regionales que afectan el trading en Sudamérica."
        }
    },
    topbrokersmexicoymas: {
        whyChoose: {
            title: "¿Por Qué Elegir TopBrokersMexicoYMas?",
            features: [
                {
                    icon: "fas fa-flag",
                    title: "Análisis Profundo de México",
                    description: "Información detallada sobre depósitos SPEI, regulación CNBV e impuestos locales."
                },
                {
                    icon: "fas fa-globe-americas",
                    title: "Resto de LATAM",
                    description: "Secciones dedicadas para otros países latinoamericanos con información específica."
                },
                {
                    icon: "fas fa-building",
                    title: "Acceso a Brokers de EE.UU.",
                    description: "Guías para abrir cuentas en TD Ameritrade, Schwab y otros brokers estadounidenses desde México."
                },
                {
                    icon: "fas fa-file-invoice-dollar",
                    title: "Reportes Fiscales",
                    description: "Herramientas para generar reportes fiscales y cumplir con obligaciones tributarias."
                }
            ]
        },
        about: {
            title: "Acerca de TopBrokersMexicoYMas",
            description1: "Somos la plataforma líder enfocada en el mercado mexicano, el más grande de LATAM. Proporcionamos análisis profundo y guías específicas.",
            description2: "Cubrimos depósitos SPEI, regulación CNBV, impuestos locales y acceso a brokers estadounidenses. También proporcionamos estrategias de trading en pesos mexicanos y kits para principiantes mexicanos."
        }
    },
    capitallatamreviews: {
        whyChoose: {
            title: "¿Por Qué Elegir CapitalLatamReviews?",
            features: [
                {
                    icon: "fas fa-briefcase",
                    title: "Cuentas Profesionales",
                    description: "Brokers con cuentas profesionales diseñadas para traders institucionales y de alto volumen."
                },
                {
                    icon: "fas fa-network-wired",
                    title: "Acceso Directo al Mercado",
                    description: "Plataformas DMA con datos de Level 2 para trading profesional avanzado."
                },
                {
                    icon: "fas fa-code",
                    title: "API Trading",
                    description: "Brokers con APIs robustas para desarrolladores y traders algorítmicos."
                },
                {
                    icon: "fas fa-clipboard-check",
                    title: "Auditoría de Seguridad",
                    description: "Scorecard riguroso de 50 puntos evaluando seguridad, regulación y protección."
                }
            ]
        },
        about: {
            title: "Acerca de CapitalLatamReviews",
            description1: "Somos la plataforma de reseñas institucionales para traders profesionales y de alto patrimonio en LATAM.",
            description2: "Nos especializamos en cuentas profesionales, DMA, API trading, cuentas gestionadas (PAMM/MAM) y servicios de gestión de patrimonio. Nuestras auditorías de seguridad de 50 puntos son las más rigurosas del mercado."
        }
    }
};

function updateProjectContent(projectKey, content) {
    console.log(`\n📝 Updating content: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const indexPath = path.join(projectDir, 'views', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        console.log(`⚠️  Index file not found`);
        return;
    }
    
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Update "Why Choose Us" section
    const whyChoosePattern = /<h2[^>]*>¿Por Qué Elegir[^<]*<\/h2>[\s\S]*?<\/section>/;
    if (whyChoosePattern.test(html)) {
        let whyChooseHTML = `
            <h2 data-translate="whyChoose.title">${content.whyChoose.title}</h2>
            <div class="features-grid">
        `;
        
        content.whyChoose.features.forEach(feature => {
            whyChooseHTML += `
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="${feature.icon}"></i>
                    </div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `;
        });
        
        whyChooseHTML += `</div>`;
        
        html = html.replace(whyChoosePattern, `<h2 data-translate="whyChoose.title">${content.whyChoose.title}</h2>\n            <div class="features-grid">\n${content.whyChoose.features.map(f => `                <div class="feature-card">\n                    <div class="feature-icon">\n                        <i class="${f.icon}"></i>\n                    </div>\n                    <h3>${f.title}</h3>\n                    <p>${f.description}</p>\n                </div>`).join('\n')}\n            </div>\n        </div>\n    </section>`);
    }
    
    // Update About section
    html = html.replace(
        /<h2[^>]*>Acerca de[^<]*<\/h2>/,
        `<h2 data-translate="about.title">${content.about.title}</h2>`
    );
    
    html = html.replace(
        /<p data-translate="about.description1">[^<]*<\/p>/,
        `<p data-translate="about.description1">${content.about.description1}</p>`
    );
    
    html = html.replace(
        /<p data-translate="about.description2">[^<]*<\/p>/,
        `<p data-translate="about.description2">${content.about.description2}</p>`
    );
    
    fs.writeFileSync(indexPath, html);
    console.log(`   ✅ Updated content for ${projectKey}`);
}

// Update all projects
console.log('🚀 Updating project content...\n');

Object.keys(projectContent).forEach((key) => {
    updateProjectContent(key, projectContent[key]);
});

console.log('\n✨ Content updates complete!');

