/**
 * Jimmy's Tapas Bar - Speisekarte JavaScript
 * Handles menu loading, filtering, and modal functionality
 */

let currentCategory = 'all';
let menuItems = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeisekarte();
});

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

/**
 * Initialize the Speisekarte page
 */
async function initializeSpeisekarte() {
    console.log('🍽️ Initializing Speisekarte...');
    
    // Show loading screen
    showLoadingScreen();
    
    try {
        // Load menu data
        await loadMenuDataForSpeisekarte();
        
        // Initialize filters
        initializeFilters();
        
        // Hide loading screen
        hideLoadingScreen();
        
        console.log('✅ Speisekarte initialization complete');
    } catch (error) {
        console.error('❌ Error initializing Speisekarte:', error);
        hideLoadingScreen();
    }
}

/**
 * Load menu data specifically for Speisekarte
 */
async function loadMenuDataForSpeisekarte() {
    try {
        // Try to use global menu data first
        if (window.JimmysApp && window.JimmysApp.menuData && Object.keys(window.JimmysApp.menuData).length > 0) {
            processMenuData(window.JimmysApp.menuData);
            return;
        }
        
        // Load menu data directly
        console.log('Loading menu data from config/menu.ini');
        
        // Detect if we're in subdirectory or main directory
        const currentPath = window.location.pathname;
        let menuPath;
        
        if (currentPath.includes('/pages/')) {
            // We're in pages/ subdirectory, go up one level
            menuPath = '../config/menu.ini';
            console.log('Detected pages/ subdirectory, using path:', menuPath);
        } else {
            // We're in main directory
            menuPath = 'config/menu.ini';
            console.log('Detected main directory, using path:', menuPath);
        }
        
        console.log('Trying to load menu from:', menuPath);
        const response = await fetch(menuPath);
        
        if (!response.ok) {
            console.error('Failed to load menu.ini, status:', response.status);
            throw new Error(`HTTP error! status: ${response.status} - Path: ${menuPath}`);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const iniText = await response.text();
        const menuData = parseINIForSpeisekarte(iniText);
        
        processMenuData(menuData);
        
        console.log('Menu data loaded for Speisekarte:', menuData);
    } catch (error) {
        console.error('Error loading menu data:', error);
        
        // Try fallback paths
        const fallbackPaths = [
            '../config/menu.ini',
            'config/menu.ini',
            './config/menu.ini',
            '/config/menu.ini'
        ];
        
        for (const fallbackPath of fallbackPaths) {
            try {
                console.log('Trying fallback path:', fallbackPath);
                const fallbackResponse = await fetch(fallbackPath);
                if (fallbackResponse.ok) {
                    console.log('✅ Fallback path successful:', fallbackPath);
                    const iniText = await fallbackResponse.text();
                    const menuData = parseINIForSpeisekarte(iniText);
                    processMenuData(menuData);
                    return;
                }
            } catch (fallbackError) {
                console.warn('Fallback path failed:', fallbackPath, fallbackError);
            }
        }
        
        // Use fallback data if all paths fail
        console.log('All paths failed, using fallback menu data');
        const fallbackData = getFallbackMenuDataForSpeisekarte();
        processMenuData(fallbackData);
    }
}

/**
 * Parse INI data for Speisekarte
 */
function parseINIForSpeisekarte(iniText) {
    const result = {
        settings: {},
        categories: {},
        items: []
    };
    
    let currentSection = null;
    let currentItem = null;
    const lines = iniText.split('\n');
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip comments and empty lines
        if (line.startsWith('#') || line.startsWith(';') || line === '') {
            continue;
        }
        
        // Section headers
        if (line.startsWith('[') && line.endsWith(']')) {
            currentSection = line.slice(1, -1);
            
            if (currentSection === 'SETTINGS' || currentSection === 'CATEGORIES') {
                currentItem = null;
            } else {
                // This is a menu item
                currentItem = {
                    id: currentSection,
                    section: currentSection
                };
                result.items.push(currentItem);
            }
            continue;
        }
        
        // Key-value pairs
        const equalIndex = line.indexOf('=');
        if (equalIndex > -1) {
            const key = line.slice(0, equalIndex).trim();
            const value = line.slice(equalIndex + 1).trim();
            
            if (currentSection === 'CATEGORIES') {
                result.categories[key] = value;
            } else if (currentSection === 'SETTINGS') {
                result.settings[key] = value;
            } else if (currentItem) {
                // Add to current item
                // Convert boolean strings
                if (value === 'true') {
                    currentItem[key] = true;
                } else if (value === 'false') {
                    currentItem[key] = false;
                } else {
                    currentItem[key] = value;
                }
            }
        }
    }
    
    console.log('Parsed INI data:', result);
    return result;
}

/**
 * Process menu data into usable format
 */
function processMenuData(data) {
    // Store categories
    window.menuCategories = data.categories || {};
    window.menuSettings = data.settings || {};
    
    // Process menu items
    if (data.items) {
        menuItems = data.items.filter(item => item.name && item.category);
    } else {
        // Handle old format (fallback)
        menuItems = [];
        Object.keys(data).forEach(key => {
            if (key !== 'settings' && key !== 'categories' && data[key].name) {
                menuItems.push({
                    id: key,
                    ...data[key]
                });
            }
        });
    }
    
    console.log('Processed menu items:', menuItems);
}

/**
 * Get fallback menu data
 */
function getFallbackMenuDataForSpeisekarte() {
    return {
        settings: {
            restaurant_name: "Jimmy's Tapas Bar",
            currency: "EUR",
            currency_symbol: "€"
        },
        categories: {
            inicio: "Inicio / Vorspeisen",
            "tapas-pollo": "Tapas de Pollo",
            carnes: "Tapas de Carne",
            pescados: "Tapas de Pescado",
            paellas: "Tapa Paella",
            pasta: "Pasta",
            pizza: "Pizza",
            postres: "Dessert",
            "weine-offen": "Weine (offen)",
            "bier-fass": "Bier vom Fass",
            cocktails: "Cocktails mit Alkohol"
        },
        items: [
            {
                id: "inicio_1",
                name: "Aioli",
                description: "Hausgemachte spanische Knoblauch-Mayonnaise",
                price: "3.50",
                category: "inicio",
                allergens: "Eier"
            },
            {
                id: "inicio_2", 
                name: "Aceitunas",
                description: "Marinierte Oliven mit Kräutern",
                price: "3.90",
                category: "inicio",
                allergens: ""
            },
            {
                id: "inicio_3",
                name: "Pan con Tomate",
                description: "Geröstetes Brot mit Tomate und Olivenöl",
                price: "4.20",
                category: "inicio",
                allergens: "Gluten"
            },
            {
                id: "tapas-pollo_1",
                name: "Pollo al Ajillo",
                description: "Hähnchen in Knoblauch-Olivenöl",
                price: "6.50",
                category: "tapas-pollo",
                allergens: ""
            },
            {
                id: "tapas-pollo_2",
                name: "Alitas de Pollo",
                description: "Würzige Hähnchenflügel",
                price: "7.20",
                category: "tapas-pollo",
                allergens: ""
            },
            {
                id: "carnes_1",
                name: "Jamón Ibérico",
                description: "Luftgetrockneter Schinken aus Spanien",
                price: "8.90",
                category: "carnes",
                allergens: ""
            },
            {
                id: "carnes_2",
                name: "Chorizo a la Plancha",
                description: "Gebratene spanische Wurst",
                price: "6.80",
                category: "carnes",
                allergens: ""
            },
            {
                id: "pescados_1",
                name: "Gambas al Ajillo",
                description: "Garnelen in Knoblauch und Chili",
                price: "7.50",
                category: "pescados",
                allergens: "Schalentiere"
            },
            {
                id: "pescados_2",
                name: "Calamares a la Romana",
                description: "Frittierte Tintenfischringe",
                price: "6.90",
                category: "pescados",
                allergens: "Schalentiere, Gluten"
            },
            {
                id: "paellas_1",
                name: "Paella Valenciana",
                description: "Traditionelle Paella mit Huhn und Gemüse",
                price: "12.50",
                category: "paellas",
                allergens: ""
            },
            {
                id: "paellas_2",
                name: "Paella Mixta",
                description: "Paella mit Fleisch und Meeresfrüchten",
                price: "14.90",
                category: "paellas",
                allergens: "Schalentiere"
            },
            {
                id: "pasta_1",
                name: "Spaghetti Carbonara",
                description: "Klassische Carbonara mit Speck und Parmesan",
                price: "9.50",
                category: "pasta",
                allergens: "Gluten, Eier, Milch"
            },
            {
                id: "pizza_1",
                name: "Pizza Margherita",
                description: "Tomaten, Mozzarella, Basilikum",
                price: "8.50",
                category: "pizza",
                allergens: "Gluten, Milch"
            },
            {
                id: "postres_1",
                name: "Crema Catalana",
                description: "Katalanische Crème Brûlée",
                price: "4.50",
                category: "postres",
                allergens: "Eier, Milch"
            },
            {
                id: "postres_2",
                name: "Flan Casero",
                description: "Hausgemachter Karamellpudding",
                price: "4.20",
                category: "postres",
                allergens: "Eier, Milch"
            },
            {
                id: "weine-offen_1",
                name: "Sangria (0,5l)",
                description: "Traditionelle spanische Sangria",
                price: "6.90",
                category: "weine-offen",
                allergens: ""
            },
            {
                id: "weine-offen_2",
                name: "Rioja Tinto (0,2l)",
                description: "Spanischer Rotwein",
                price: "4.50",
                category: "weine-offen",
                allergens: ""
            },
            {
                id: "bier-fass_1",
                name: "Estrella Galicia (0,3l)",
                description: "Spanisches Bier vom Fass",
                price: "3.50",
                category: "bier-fass",
                allergens: "Gluten"
            },
            {
                id: "cocktails_1",
                name: "Mojito",
                description: "Weißer Rum, Minze, Limette, Zucker",
                price: "7.50",
                category: "cocktails",
                allergens: ""
            },
            {
                id: "cocktails_2",
                name: "Piña Colada",
                description: "Weißer Rum, Kokosnuss, Ananas",
                price: "8.20",
                category: "cocktails",
                allergens: ""
            }
        ]
    };
}

/**
 * Get category name from category key
 */
function getCategoryName(categoryKey) {
    if (window.menuCategories && window.menuCategories[categoryKey]) {
        return window.menuCategories[categoryKey];
    }
    
    // Fallback mapping for common categories
    const categoryMap = {
        'inicio': 'Inicio / Vorspeisen',
        'salat': 'Salat',
        'kleiner-salat': 'Kleiner Salat',
        'paellas': 'Tapa Paella',
        'vegetarian': 'Tapas Vegetarian',
        'tapas-pollo': 'Tapas de Pollo',
        'carnes': 'Tapas de Carne',
        'pescados': 'Tapas de Pescado',
        'kroketten': 'Kroketten',
        'pasta': 'Pasta',
        'pizza': 'Pizza',
        'kleine-grosse-hunger': 'Für den kleinen und großen Hunger',
        'postres': 'Dessert',
        'helados': 'Helados (Eis)',
        'heissgetraenke': 'Heißgetränke',
        'wasser': 'Wasser',
        'softdrinks': 'Softdrinks',
        'saefte': 'Säfte/Nektar',
        'limonaden': 'Limonaden (hausgemacht)',
        'weine-offen': 'Weine (offen)',
        'flaschenweine': 'Flaschenweine',
        'spanische-getraenke': 'Spanische Getränke',
        'bier-fass': 'Bier vom Fass',
        'flaschenbier': 'Flaschenbier',
        'spirituosen': 'Spirituosen (Shots 2cl)',
        'gin-longdrinks': 'Gin Longdrinks',
        'whiskey': 'Whiskey (4cl)',
        'shots': 'Shots (4cl)',
        'brandy': 'Spanischer Brandy (4cl)',
        'cocktails-alkoholfrei': 'Cocktails alkoholfrei',
        'cocktails': 'Cocktails mit Alkohol'
    };
    
    return categoryMap[categoryKey] || categoryKey;
}

/**
 * Toggle extended categories display
 */
function toggleCategories() {
    const extendedCategories = document.querySelector('.extended-categories');
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    if (extendedCategories.style.display === 'none' || extendedCategories.style.display === '') {
        extendedCategories.style.display = 'flex';
        showMoreBtn.textContent = 'Weniger Kategorien anzeigen';
    } else {
        extendedCategories.style.display = 'none';
        showMoreBtn.textContent = 'Mehr Kategorien anzeigen';
    }
}

/**
 * Initialize category filter buttons - Original Design
 */
function initializeCategories() {
    // All category buttons are already in HTML, just add event listeners
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';
            filterByCategory(category);
        });
    });
}

/**
 * Initialize menu grid - Original Design
 */
function initializeMenuGrid() {
    const menuList = document.getElementById('menuList');
    if (!menuList) return;
    
    menuList.innerHTML = '';
    
    // Group items by category
    const categories = {};
    menuItems.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });
    
    // Create category sections
    Object.entries(categories).forEach(([categoryKey, items]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'menu-category-section';
        categorySection.dataset.category = categoryKey;
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'menu-category-title';
        categoryTitle.textContent = getCategoryName(categoryKey);
        categorySection.appendChild(categoryTitle);
        
        items.forEach(item => {
            const menuItemElement = createMenuItemOriginal(item);
            categorySection.appendChild(menuItemElement);
        });
        
        menuList.appendChild(categorySection);
    });
}

/**
 * Create menu item HTML element - Fixed Hover
 */
function createMenuItemOriginal(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item-original';
    menuItem.dataset.category = item.category;
    
    const currencySymbol = window.menuSettings?.currency_symbol || '€';
    const vegetarianIcon = item.vegetarian ? '🌿' : '';
    
    menuItem.innerHTML = `
        <div class="menu-item-header-original">
            <h3 class="menu-item-title-original">
                ${vegetarianIcon} ${item.name}
            </h3>
            <span class="menu-item-price-original">${item.price}${currencySymbol}</span>
        </div>
        <p class="menu-item-description-original">${item.description}</p>
        ${item.detailed_description && item.detailed_description !== item.description ? 
            `<p class="menu-item-detailed-description">${item.detailed_description}</p>` : ''}
        ${item.allergens ? `<p class="menu-item-allergens"><strong>Allergene:</strong> ${item.allergens}</p>` : ''}
        <div class="menu-item-meta-original">
            ${item.origin ? `<span class="menu-item-tag tag-origin">${item.origin}</span>` : ''}
            ${item.category ? `<span class="menu-item-tag tag-category">${getCategoryName(item.category)}</span>` : ''}
            ${item.vegetarian ? `<span class="menu-item-tag tag-vegetarian">Vegetarisch</span>` : ''}
        </div>
    `;
    
    // Fixed hover handlers
    menuItem.addEventListener('mouseenter', () => {
        showMenuItemDetail(item);
        menuItem.classList.add('active');
    });
    
    // Remove the mouseleave that was causing issues
    menuItem.addEventListener('click', () => {
        // Remove active from all items
        document.querySelectorAll('.menu-item-original').forEach(el => el.classList.remove('active'));
        // Add active to clicked item
        menuItem.classList.add('active');
        showMenuItemDetail(item);
    });
    
    return menuItem;
}

/**
 * Show menu item detail in right panel - Original Design WITHOUT IMAGES
 */
function showMenuItemDetail(item) {
    const detailPanel = document.getElementById('menuDetailPanel');
    if (!detailPanel) return;
    
    const currencySymbol = window.menuSettings?.currency_symbol || '€';
    const vegetarianIcon = item.vegetarian ? '🌿' : '';
    
    detailPanel.innerHTML = `
        <div class="menu-detail-content">
            <h2 class="detail-title">${vegetarianIcon} ${item.name}</h2>
            <div class="detail-price">${item.price}${currencySymbol}</div>
            
            <p class="detail-description">
                ${item.detailed_description || item.description}
            </p>
            
            <div class="detail-info-section">
                <h3 class="detail-info-title">🍽️ Detaillierte Gericht-Informationen</h3>
                <div class="detail-info-grid">
                    ${item.origin ? `
                        <div class="detail-info-row">
                            <span class="detail-info-label">🌍 Herkunft:</span>
                            <span class="detail-info-value">${item.origin}</span>
                        </div>
                    ` : ''}
                    
                    ${item.preparation ? `
                        <div class="detail-info-row">
                            <span class="detail-info-label">👨‍🍳 Zubereitung:</span>
                            <span class="detail-info-value">${item.preparation}</span>
                        </div>
                    ` : ''}
                    
                    ${item.ingredients ? `
                        <div class="detail-info-row">
                            <span class="detail-info-label">🥘 Zutaten:</span>
                            <span class="detail-info-value">${item.ingredients}</span>
                        </div>
                    ` : ''}
                    
                    <div class="detail-info-row">
                        <span class="detail-info-label">🌱 Vegetarisch:</span>
                        <span class="detail-info-value">${item.vegetarian ? 'Ja' : 'Nein'}</span>
                    </div>
                </div>
            </div>
            
            ${item.allergens ? `
                <div class="detail-info-section">
                    <h3 class="detail-info-title">⚠️ Allergene & Zusatzstoffe</h3>
                    <div class="detail-info-grid">
                        <div class="detail-info-row">
                            <span class="detail-info-label">🚨 Allergene:</span>
                            <span class="detail-info-value">${item.allergens}</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-tags">
                ${item.vegetarian ? '<span class="menu-item-tag tag-vegetarian">🌿 Vegetarisch</span>' : ''}
                ${item.origin ? `<span class="menu-item-tag tag-origin">📍 ${item.origin}</span>` : ''}
                ${item.category ? `<span class="menu-item-tag tag-category">${getCategoryName(item.category)}</span>` : ''}
            </div>
        </div>
    `;
}

/**
 * Hide menu item detail panel - Fixed
 */
function hideMenuItemDetail() {
    // Don't hide when hovering over detail panel or menu item
    const detailPanel = document.getElementById('menuDetailPanel');
    if (!detailPanel) return;
    
    // Only hide if not hovering over panel and no active item
    setTimeout(() => {
        const isHoveringPanel = detailPanel.matches(':hover');
        const hasActiveItem = document.querySelector('.menu-item-original.active');
        
        if (!isHoveringPanel && !hasActiveItem) {
            detailPanel.innerHTML = `
                <div class="detail-placeholder">
                    <div class="detail-icon">🍽️</div>
                    <p>Bewegen Sie die Maus über ein Gericht<br>um detaillierte Beschreibungen,<br>Zutaten, Herkunft, Zubereitung<br>und Allergie-Informationen zu erhalten</p>
                </div>
            `;
        }
    }, 100);
}

/**
 * Filter menu items by category - Original Design
 */
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category || (category === 'all' && !btn.dataset.category)) {
            btn.classList.add('active');
        }
    });
    
    // Filter category sections
    const categorySections = document.querySelectorAll('.menu-category-section');
    categorySections.forEach(section => {
        if (category === 'all' || section.dataset.category === category) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Reset detail panel
    hideMenuItemDetail();
}

/**
 * Initialize modal functionality
 */
function initializeModal() {
    const modal = document.getElementById('menuModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    // Close modal handlers
    if (modalClose) {
        modalClose.onclick = hideMenuItemModal;
    }
    
    if (modalOverlay) {
        modalOverlay.onclick = hideMenuItemModal;
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideMenuItemModal();
        }
    });
}

/**
 * Show menu item modal
 */
function showMenuItemModal(item) {
    const modal = document.getElementById('menuModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const currencySymbol = window.menuSettings?.currency_symbol || '€';
    
    modalBody.innerHTML = `
        <img src="${item.image || 'images/placeholder-card.svg'}" 
             alt="${item.name}" 
             class="modal-image">
        
        <h2 class="modal-title">${item.name}</h2>
        <div class="modal-price">${item.price}${currencySymbol}</div>
        
        <p class="modal-description">
            ${item.detailed_description || item.description}
        </p>
        
        <div class="modal-details">
            <h4>Details</h4>
            
            ${item.origin ? `
                <div class="detail-row">
                    <span class="detail-label">Herkunft:</span>
                    <span class="detail-value">${item.origin}</span>
                </div>
            ` : ''}
            
            ${item.preparation ? `
                <div class="detail-row">
                    <span class="detail-label">Zubereitung:</span>
                    <span class="detail-value">${item.preparation}</span>
                </div>
            ` : ''}
            
            ${item.ingredients ? `
                <div class="detail-row">
                    <span class="detail-label">Zutaten:</span>
                    <span class="detail-value">${item.ingredients}</span>
                </div>
            ` : ''}
            
            ${item.allergens ? `
                <div class="detail-row">
                    <span class="detail-label">Allergene:</span>
                    <span class="detail-value">${item.allergens}</span>
                </div>
            ` : ''}
            
            <div class="detail-row">
                <span class="detail-label">Vegetarisch:</span>
                <span class="detail-value">${item.vegetarian ? 'Ja 🌿' : 'Nein'}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Hide menu item modal
 */
function hideMenuItemModal() {
    const modal = document.getElementById('menuModal');
    
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Initialize filters functionality
 */
function initializeFilters() {
    // Add event listeners to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn, .category-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';
            filterByCategory(category);
        });
    });
    
    // Add event listener to "Mehr anzeigen" button
    const showMoreBtn = document.querySelector('.show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', toggleCategories);
    }
    
    console.log('Filters initialized');
}

/**
 * Search functionality (if needed in the future)
 */
function searchMenuItems(query) {
    const searchTerm = query.toLowerCase();
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const title = item.querySelector('.menu-item-title').textContent.toLowerCase();
        const description = item.querySelector('.menu-item-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.classList.remove('hidden');
            item.classList.add('show');
        } else {
            item.classList.add('hidden');
            item.classList.remove('show');
        }
    });
}

// Export functions for global use
window.SpeisekarteApp = {
    filterByCategory,
    searchMenuItems,
    showMenuItemModal,
    hideMenuItemModal,
    menuItems
};

console.log('🍽️ Speisekarte JavaScript loaded successfully');