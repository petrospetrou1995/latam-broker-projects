// Leaderboard functionality for RankingBrokersLatam

(function() {
    'use strict';

    // Initialize leaderboard
    function initLeaderboard() {
        console.log('Initializing leaderboard...');
        
        // Load brokers and display in ranking table
        if (typeof window.loadBrokers === 'function') {
            window.loadBrokers().then(brokers => {
                displayRankingTable(brokers);
                displayRankingGrid(brokers);
            });
        } else if (typeof window.loadFeaturedBrokers === 'function') {
            window.loadFeaturedBrokers().then(() => {
                // Brokers will be displayed by main.js
                setTimeout(() => {
                    const brokers = Array.from(document.querySelectorAll('.broker-card'));
                    if (brokers.length > 0) {
                        convertToRankingTable();
                    }
                }, 1000);
            });
        }
        
        // Setup view toggle
        setupViewToggle();
        
        // Setup country filters
        setupCountryFilters();
        
        // Setup quick compare
        setupQuickCompare();
    }

    // Display ranking table
    function displayRankingTable(brokers) {
        const tbody = document.getElementById('rankingTableBody');
        if (!tbody) return;

        // Sort brokers by rating (descending)
        const sortedBrokers = [...brokers].sort((a, b) => b.rating - a.rating);
        
        // Take top 10
        const top10 = sortedBrokers.slice(0, 10);

        let html = '';
        top10.forEach((broker, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
            
            // Get broker logo
            const logoUrl = getBrokerLogoUrl(broker);
            const logoHTML = logoUrl 
                ? `<img src="${logoUrl}" alt="${broker.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <i class="fas fa-building" style="display: none;"></i>`
                : `<i class="fas fa-building"></i>`;

            // Generate stars
            const stars = generateStars(broker.rating);

            // Get regulation badges
            const regulations = broker.regulations || [];
            const regulationHTML = regulations.length > 0
                ? regulations.slice(0, 2).map(reg => `<span class="regulation-badge">${reg}</span>`).join('')
                : '<span class="regulation-badge">Regulado</span>';

            // Get payment methods
            const payments = broker.paymentMethods || ['Tarjeta', 'Transferencia'];
            const paymentHTML = payments.slice(0, 3).map(p => `<span class="payment-method-badge">${p}</span>`).join('');

            // Spread (mock data - replace with real data)
            const spread = broker.spread || '1.2 pips';

            html += `
                <tr>
                    <td class="rank-col">
                        <div class="rank-number ${rankClass}">${rank}</div>
                    </td>
                    <td class="broker-col" data-label="Broker">
                        <div class="broker-info-table">
                            <div class="broker-logo-table">
                                ${logoHTML}
                            </div>
                            <div>
                                <div class="broker-name-table">${broker.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="rating-col" data-label="Calificación">
                        <div class="rating-stars-table">
                            ${stars}
                            <span class="rating-value-table">${broker.rating.toFixed(1)}</span>
                        </div>
                    </td>
                    <td class="spread-col" data-label="Spread">
                        <div class="spread-value">${spread}</div>
                    </td>
                    <td class="regulation-col" data-label="Regulación">
                        <div class="regulation-badges">${regulationHTML}</div>
                    </td>
                    <td class="payment-col" data-label="Métodos de Pago">
                        <div class="payment-methods-table">${paymentHTML}</div>
                    </td>
                    <td class="action-col" data-label="Acción">
                        <a href="/broker/${broker.slug}.html" class="table-action-btn">
                            Ver Detalles
                        </a>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    // Convert existing broker cards to ranking table
    function convertToRankingTable() {
        const grid = document.getElementById('brokersGrid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.broker-card');
        if (cards.length === 0) return;

        const brokers = Array.from(cards).map(card => {
            const name = card.querySelector('h3')?.textContent || '';
            const rating = parseFloat(card.querySelector('.broker-rating span')?.textContent || '0');
            const slug = card.getAttribute('data-broker-slug') || '';
            return { name, rating, slug };
        });

        displayRankingTable(brokers);
    }

    // Display ranking grid (alternative view)
    function displayRankingGrid(brokers) {
        const grid = document.getElementById('brokersGrid');
        if (!grid) return;

        // Use existing displayBrokers function if available
        if (typeof window.displayBrokers === 'function') {
            window.displayBrokers(brokers.slice(0, 10), 'brokersGrid');
        }
    }

    // Setup view toggle
    function setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const tableContainer = document.querySelector('.ranking-table-container');
        const gridContainer = document.getElementById('brokersGrid');

        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                if (view === 'table') {
                    if (tableContainer) tableContainer.style.display = 'block';
                    if (gridContainer) gridContainer.style.display = 'none';
                } else {
                    if (tableContainer) tableContainer.style.display = 'none';
                    if (gridContainer) gridContainer.style.display = 'grid';
                }
            });
        });
    }

    // Setup country filters
    function setupCountryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const country = this.getAttribute('data-country');
                filterBrokersByCountry(country);
            });
        });
    }

    // Filter brokers by country
    function filterBrokersByCountry(country) {
        console.log('Filtering by country:', country);
        // Implementation would filter brokers based on country
        // This would require country data in broker objects
    }

    // Setup quick compare
    function setupQuickCompare() {
        const slots = document.querySelectorAll('.compare-slot');
        const compareBtn = document.querySelector('.compare-btn');
        const selectedBrokers = [];

        slots.forEach(slot => {
            slot.addEventListener('click', function() {
                const slotNum = this.getAttribute('data-slot');
                // Open broker selector modal or dropdown
                // For now, just show placeholder
                this.innerHTML = `
                    <i class="fas fa-building"></i>
                    <span>Broker ${slotNum}</span>
                    <button class="remove-broker" onclick="removeBrokerFromCompare(${slotNum})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                this.classList.add('filled');
                selectedBrokers[slotNum - 1] = true;
                
                if (selectedBrokers.filter(Boolean).length >= 2) {
                    compareBtn.disabled = false;
                }
            });
        });

        if (compareBtn) {
            compareBtn.addEventListener('click', function() {
                if (!this.disabled) {
                    window.location.href = '/broker-comparison.html';
                }
            });
        }
    }

    // Helper functions
    function getBrokerLogoUrl(broker) {
        if (typeof window.getBrokerLogoUrl === 'function') {
            return window.getBrokerLogoUrl(broker);
        }
        return null;
    }

    function generateStars(rating) {
        if (typeof window.generateStars === 'function') {
            return window.generateStars(rating);
        }
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        return stars;
    }

    // Remove broker from compare
    window.removeBrokerFromCompare = function(slotNum) {
        const slot = document.querySelector(`[data-slot="${slotNum}"]`);
        if (slot) {
            slot.innerHTML = `
                <i class="fas fa-plus"></i>
                <span>Seleccionar Broker ${slotNum}</span>
            `;
            slot.classList.remove('filled');
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLeaderboard);
    } else {
        initLeaderboard();
    }

})();

