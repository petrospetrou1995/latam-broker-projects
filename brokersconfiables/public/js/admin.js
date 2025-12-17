// Admin Dashboard JavaScript

let currentUser = null;
let authToken = null;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeAdmin();
});

// Check if user is authenticated
function checkAuthentication() {
    authToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!authToken || !userData) {
        window.location.href = '/login';
        return;
    }
    
    currentUser = JSON.parse(userData);
    updateUserInfo();
}

// Initialize admin functionality
function initializeAdmin() {
    setupSidebar();
    setupNavigation();
    loadDashboardData();
    setupModals();
    setupForms();
}

// Setup sidebar functionality
function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Setup navigation between sections
function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const section = item.getAttribute('data-section');
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === section) {
                    sec.classList.add('active');
                }
            });
            
            // Update page title
            if (pageTitle) {
                const title = item.querySelector('span').textContent;
                pageTitle.textContent = title;
            }
            
            // Load section data
            loadSectionData(section);
        });
    });
}

// Load data for specific section
function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'brokers':
            loadBrokersData();
            break;
        case 'reviews':
            loadReviewsData();
            break;
        case 'categories':
            loadCategoriesData();
            break;
        case 'contacts':
            loadContactsData();
            break;
        case 'ai':
            loadAIData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data.stats);
            updateRecentReviews(data.recentReviews);
            updateRecentContacts(data.recentContacts);
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('totalBrokers').textContent = stats.totalBrokers || 0;
    document.getElementById('totalReviews').textContent = stats.totalReviews || 0;
    document.getElementById('totalContacts').textContent = stats.totalContacts || 0;
    document.getElementById('pendingReviews').textContent = stats.pendingReviews || 0;
}

// Update recent reviews
function updateRecentReviews(reviews) {
    const container = document.getElementById('recentReviews');
    if (!container || !reviews) return;
    
    container.innerHTML = reviews.map(review => `
        <div class="recent-item">
            <div class="item-header">
                <span class="item-title">${review.title}</span>
                <span class="item-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
            </div>
            <div class="item-meta">
                <span>${review.broker?.name || 'Unknown Broker'}</span>
                <span>${formatDate(review.createdAt)}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-primary" onclick="approveReview('${review._id}')">
                    Aprobar
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectReview('${review._id}')">
                    Rechazar
                </button>
            </div>
        </div>
    `).join('');
}

// Update recent contacts
function updateRecentContacts(contacts) {
    const container = document.getElementById('recentContacts');
    if (!container || !contacts) return;
    
    container.innerHTML = contacts.map(contact => `
        <div class="recent-item">
            <div class="item-header">
                <span class="item-title">${contact.subject}</span>
                <span class="status-badge ${contact.status}">${contact.status}</span>
            </div>
            <div class="item-meta">
                <span>${contact.name} - ${contact.email}</span>
                <span>${formatDate(contact.createdAt)}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-primary" onclick="viewContact('${contact._id}')">
                    Ver
                </button>
            </div>
        </div>
    `).join('');
}

// Load brokers data
async function loadBrokersData() {
    try {
        const response = await fetch('/api/admin/brokers', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayBrokersTable(data.brokers);
        }
    } catch (error) {
        console.error('Error loading brokers:', error);
    }
}

// Display brokers in table
function displayBrokersTable(brokers) {
    const tbody = document.getElementById('brokersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = brokers.map(broker => `
        <tr>
            <td>
                <div class="broker-logo-small">
                    <i class="fas fa-building"></i>
                </div>
            </td>
            <td>
                <div class="broker-name">
                    <strong>${broker.name}</strong>
                    <small>${broker.website}</small>
                </div>
            </td>
            <td>
                <span class="category-badge">${broker.category}</span>
            </td>
            <td>
                <div class="rating-display">
                    ${generateStars(broker.rating)}
                    <span>${broker.rating.toFixed(1)}</span>
                </div>
            </td>
            <td>${broker.totalReviews}</td>
            <td>
                <span class="status-badge ${broker.isActive ? 'active' : 'inactive'}">
                    ${broker.isActive ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editBroker('${broker._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBroker('${broker._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load reviews data
async function loadReviewsData() {
    try {
        const response = await fetch('/api/admin/reviews', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayReviewsTable(data.reviews);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Display reviews in table
function displayReviewsTable(reviews) {
    const tbody = document.getElementById('reviewsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = reviews.map(review => `
        <tr>
            <td>
                <div class="user-info">
                    <strong>${review.user.name}</strong>
                    <small>${review.user.email}</small>
                </div>
            </td>
            <td>${review.broker?.name || 'Unknown'}</td>
            <td>
                <div class="rating-display">
                    ${generateStars(review.rating)}
                </div>
            </td>
            <td>${review.title}</td>
            <td>
                <span class="status-badge ${review.isApproved ? 'active' : 'pending'}">
                    ${review.isApproved ? 'Aprobada' : 'Pendiente'}
                </span>
            </td>
            <td>${formatDate(review.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-success" onclick="approveReview('${review._id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectReview('${review._id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load categories data
async function loadCategoriesData() {
    try {
        const response = await fetch('/api/admin/categories', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayCategoriesGrid(data.categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Display categories in grid
function displayCategoriesGrid(categories) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-icon" style="background-color: ${category.color}">
                    <i class="${category.icon || 'fas fa-tag'}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                </div>
            </div>
            <div class="category-actions">
                <button class="btn btn-sm btn-primary" onclick="editCategory('${category._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Load contacts data
async function loadContactsData() {
    try {
        const response = await fetch('/api/admin/contacts', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayContactsTable(data.contacts);
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Display contacts in table
function displayContactsTable(contacts) {
    const tbody = document.getElementById('contactsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td>
                <div class="contact-info">
                    <strong>${contact.name}</strong>
                    <small>${contact.country}</small>
                </div>
            </td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>
                <span class="status-badge ${contact.status}">${contact.status}</span>
            </td>
            <td>
                <span class="priority-badge ${contact.priority}">${contact.priority}</span>
            </td>
            <td>${formatDate(contact.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="viewContact('${contact._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="respondContact('${contact._id}')">
                        <i class="fas fa-reply"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load AI data
async function loadAIData() {
    try {
        const response = await fetch('/api/ai/services');
        const data = await response.json();
        console.log('AI Services:', data);
    } catch (error) {
        console.error('Error loading AI data:', error);
    }
}

// Load settings data
function loadSettingsData() {
    // Settings are static for now
    console.log('Loading settings data...');
}

// Setup modals
function setupModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Setup forms
function setupForms() {
    // Add broker form
    const addBrokerForm = document.getElementById('addBrokerForm');
    if (addBrokerForm) {
        addBrokerForm.addEventListener('submit', handleAddBroker);
    }
    
    // Add category form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', handleAddCategory);
    }
}

// Handle add broker form
async function handleAddBroker(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const brokerData = {
        name: formData.get('name'),
        description: formData.get('description'),
        website: formData.get('website'),
        category: formData.get('category'),
        countries: formData.get('countries').split(',').map(c => c.trim())
    };
    
    try {
        const response = await fetch('/api/admin/brokers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(brokerData)
        });
        
        if (response.ok) {
            showNotification('Broker agregado exitosamente', 'success');
            closeModal('addBrokerModal');
            e.target.reset();
            loadBrokersData();
        } else {
            showNotification('Error al agregar broker', 'error');
        }
    } catch (error) {
        console.error('Error adding broker:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Handle add category form
async function handleAddCategory(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const categoryData = {
        name: formData.get('name'),
        description: formData.get('description'),
        color: formData.get('color'),
        icon: formData.get('icon')
    };
    
    try {
        const response = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(categoryData)
        });
        
        if (response.ok) {
            showNotification('Categoría agregada exitosamente', 'success');
            closeModal('addCategoryModal');
            e.target.reset();
            loadCategoriesData();
        } else {
            showNotification('Error al agregar categoría', 'error');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Modal functions
function showAddBrokerModal() {
    document.getElementById('addBrokerModal').style.display = 'block';
}

function showAddCategoryModal() {
    document.getElementById('addCategoryModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Review actions
async function approveReview(reviewId) {
    try {
        const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Reseña aprobada', 'success');
            loadReviewsData();
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error approving review:', error);
    }
}

async function rejectReview(reviewId) {
    try {
        const response = await fetch(`/api/admin/reviews/${reviewId}/reject`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Reseña rechazada', 'success');
            loadReviewsData();
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error rejecting review:', error);
    }
}

// Contact actions
function viewContact(contactId) {
    // Implement view contact functionality
    console.log('Viewing contact:', contactId);
}

function respondContact(contactId) {
    // Implement respond to contact functionality
    console.log('Responding to contact:', contactId);
}

// Broker actions
function editBroker(brokerId) {
    // Implement edit broker functionality
    console.log('Editing broker:', brokerId);
}

async function deleteBroker(brokerId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este broker?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/brokers/${brokerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Broker eliminado exitosamente', 'success');
            loadBrokersData();
        }
    } catch (error) {
        console.error('Error deleting broker:', error);
    }
}

// Category actions
function editCategory(categoryId) {
    // Implement edit category functionality
    console.log('Editing category:', categoryId);
}

async function deleteCategory(categoryId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Categoría eliminada exitosamente', 'success');
            loadCategoriesData();
        }
    } catch (error) {
        console.error('Error deleting category:', error);
    }
}

// Update user info
function updateUserInfo() {
    const userName = document.getElementById('userName');
    if (userName && currentUser) {
        userName.textContent = currentUser.username;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Utility functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
