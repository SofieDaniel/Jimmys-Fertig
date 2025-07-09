/**
 * Jimmy's Tapas Bar - Static Website JavaScript
 * Handles dynamic menu loading, navigation, cookies, and interactions
 */

// Global variables
let menuData = {};
let cookieSettings = {
    essential: true,
    analytics: false,
    marketing: false,
    comfort: false
};

// DOM ready state
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

/**
 * Initialize the website
 */
function initializeWebsite() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize components
    initializeNavigation();
    initializeCookies();
    initializeScrollToTop();
    
    // Load menu data and initialize page-specific content
    loadMenuData()
        .then(() => {
            initializeHomePage();
            initializeContactForm();
            hideLoadingScreen();
        })
        .catch(error => {
            console.error('Error loading menu data:', error);
            // Still initialize what we can
            initializeHomePage();
            initializeContactForm();
            hideLoadingScreen();
        });
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger lines
            const lines = mobileMenuBtn.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                if (mobileMenu.classList.contains('active')) {
                    if (index === 0) line.style.transform = 'rotate(45deg) translate(6px, 6px)';
                    if (index === 1) line.style.opacity = '0';
                    if (index === 2) line.style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    line.style.transform = '';
                    line.style.opacity = '';
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                
                // Reset hamburger lines
                const lines = mobileMenuBtn.querySelectorAll('.hamburger-line');
                lines.forEach(line => {
                    line.style.transform = '';
                    line.style.opacity = '';
                });
            }
        });
    }
}

/**
 * Cookie management
 */
function initializeCookies() {
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');
    const cookieSettings = document.getElementById('cookieSettings');
    
    // Check if cookies are already accepted
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        setTimeout(() => {
            if (cookieBanner) {
                cookieBanner.classList.add('show');
            }
        }, 2000);
    }
    
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            acceptAllCookies();
        });
    }
    
    if (cookieReject) {
        cookieReject.addEventListener('click', function() {
            rejectAllCookies();
        });
    }
    
    if (cookieSettings) {
        cookieSettings.addEventListener('click', function() {
            // For now, just accept all (in a real implementation, you'd show a settings modal)
            acceptAllCookies();
        });
    }
}

function acceptAllCookies() {
    cookieSettings.essential = true;
    cookieSettings.analytics = true;
    cookieSettings.marketing = true;
    cookieSettings.comfort = true;
    
    localStorage.setItem('cookieConsent', 'accepted_all');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    hideCookieBanner();
}

function rejectAllCookies() {
    cookieSettings.essential = true;
    cookieSettings.analytics = false;
    cookieSettings.marketing = false;
    cookieSettings.comfort = false;
    
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    hideCookieBanner();
}

function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

/**
 * Scroll to top functionality
 */
function initializeScrollToTop() {
    const scrollToTop = document.getElementById('scrollToTop');
    
    if (scrollToTop) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Load menu data from INI file
 */
async function loadMenuData() {
    try {
        // Detect if we're in a subdirectory
        const isSubDirectory = window.location.pathname.includes('/pages/');
        const menuPath = isSubDirectory ? '../config/menu.ini' : 'config/menu.ini';
        
        console.log('Loading menu data from:', menuPath);
        const response = await fetch(menuPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const iniText = await response.text();
        menuData = parseINI(iniText);
        
        console.log('Menu data loaded successfully:', menuData);
        return menuData;
    } catch (error) {
        console.error('Error loading menu.ini:', error);
        
        // Fallback data if INI file can't be loaded
        console.log('Using fallback menu data');
        menuData = getFallbackMenuData();
        return menuData;
    }
}

/**
 * Parse INI file content
 */
function parseINI(iniText) {
    const result = {};
    const categories = {};
    let currentSection = null;
    
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
            if (currentSection !== 'SETTINGS' && currentSection !== 'CATEGORIES') {
                result[currentSection] = {};
            }
            continue;
        }
        
        // Key-value pairs
        const equalIndex = line.indexOf('=');
        if (equalIndex > -1) {
            const key = line.slice(0, equalIndex).trim();
            const value = line.slice(equalIndex + 1).trim();
            
            if (currentSection === 'CATEGORIES') {
                categories[key] = value;
            } else if (currentSection === 'SETTINGS') {
                result.settings = result.settings || {};
                result.settings[key] = value;
            } else if (currentSection) {
                // Convert boolean strings
                if (value === 'true') {
                    result[currentSection][key] = true;
                } else if (value === 'false') {
                    result[currentSection][key] = false;
                } else {
                    result[currentSection][key] = value;
                }
            }
        }
    }
    
    result.categories = categories;
    return result;
}

/**
 * Get fallback menu data if INI file fails to load
 */
function getFallbackMenuData() {
    return {
        settings: {
            restaurant_name: "Jimmy's Tapas Bar",
            currency: "EUR",
            currency_symbol: "€"
        },
        categories: {
            inicio: "Inicio / Vorspeisen",
            carnes: "Carnes / Fleischgerichte",
            pescados: "Pescados / Fischgerichte",
            paellas: "Paellas"
        },
        inicio_1: {
            name: "Gambas al Ajillo",
            description: "Klassische Knoblauchgarnelen in Olivenöl",
            detailed_description: "Frische Garnelen, scharf angebraten in bestem Olivenöl mit viel Knoblauch und Petersilie",
            price: "12.90",
            category: "inicio",
            allergens: "Krustentiere",
            origin: "Andalusien",
            image: "images/placeholder-card.svg",
            vegetarian: false
        },
        inicio_2: {
            name: "Patatas Bravas",
            description: "Würzige Kartoffeln mit traditioneller Bravas-Sauce",
            detailed_description: "Knusprig gebratene Kartoffelwürfel mit hausgemachter Bravas-Sauce und Aioli",
            price: "8.90",
            category: "inicio",
            allergens: "Eier (Aioli)",
            origin: "Madrid",
            image: "images/placeholder-card.svg",
            vegetarian: true
        },
        paellas_1: {
            name: "Paella Valenciana",
            description: "Original spanische Paella mit Safran, Huhn und Gemüse",
            detailed_description: "Die klassische Paella aus Valencia mit Bomba-Reis, echtem Safran, Huhn, grünen Bohnen und Tomaten",
            price: "18.90",
            category: "paellas",
            allergens: "",
            origin: "Valencia",
            image: "images/placeholder-card.svg",
            vegetarian: false
        },
        paellas_2: {
            name: "Paella de Mariscos",
            description: "Meeresfrüchte-Paella mit Garnelen, Muscheln und Tintenfisch",
            detailed_description: "Luxuriöse Paella mit frischen Meeresfrüchten aus der Ostsee und dem Mittelmeer",
            price: "22.90",
            category: "paellas",
            allergens: "Krustentiere, Weichtiere",
            origin: "Valencia",
            image: "images/placeholder-card.svg",
            vegetarian: false
        }
    };
}

/**
 * Initialize homepage content
 */
function initializeHomePage() {
    // Only run on homepage
    if (!document.getElementById('specialtiesGrid')) {
        return;
    }
    
    populateSpecialties();
}

/**
 * Populate specialties section with menu data
 */
function populateSpecialties() {
    const specialtiesGrid = document.getElementById('specialtiesGrid');
    if (!specialtiesGrid) return;
    
    // Get featured items from menu data
    const featuredItems = getFeaturedMenuItems();
    
    specialtiesGrid.innerHTML = '';
    
    featuredItems.forEach(item => {
        const card = createSpecialtyCard(item);
        specialtiesGrid.appendChild(card);
    });
}

/**
 * Get featured menu items for homepage
 */
function getFeaturedMenuItems() {
    // Return specific featured dishes with their images and IDs
    return [
        {
            id: 'paellas_1',
            name: 'Paella',
            description: 'Traditionelle spanische Paella',
            detailed_description: 'Klassische Paella mit Bomba-Reis, Safran, Hähnchen und frischen Meeresfrüchten',
            price: '8.90',
            category: 'paellas',
            image: 'images/paella-specialty.jpg',
            allergens: 'Krustentiere, Weichtiere',
            origin: 'Valencia'
        },
        {
            id: 'carne_6',
            name: 'Rollitos de Serrano con Higo',
            description: 'Serrano-Schinken-Röllchen mit Feigen',
            detailed_description: 'Luftgetrockneter Serrano-Schinken gefüllt mit süßen Feigen und Frischkäse',
            price: '9.90',
            category: 'carnes',
            image: 'images/serrano-figs-correct.jpg',
            allergens: 'Milch',
            origin: 'Spanien'
        },
        {
            id: 'pescado_2',
            name: 'Calamares a la Plancha',
            description: 'Gegrillte Tintenfisch-Ringe',
            detailed_description: 'Frische Tintenfisch-Ringe gegrillt mit Knoblauch, Petersilie und Zitrone',
            price: '8.90',
            category: 'pescados',
            image: 'images/paella-specialty.jpg',
            allergens: 'Weichtiere',
            origin: 'Spanien'
        },
        {
            id: 'carne_2',
            name: 'Albóndigas a la Casera',
            description: 'Hausgemachte spanische Fleischbällchen',
            detailed_description: 'Traditionelle Fleischbällchen in würziger Tomatensauce nach Großmutters Rezept',
            price: '6.90',
            category: 'carnes',
            image: 'images/meatballs-spanish.jpg',
            allergens: 'Gluten, Eier',
            origin: 'Spanien'
        }
    ];
}

/**
 * Create specialty card HTML element
 */
function createSpecialtyCard(item) {
    const card = document.createElement('div');
    card.className = 'specialty-card';
    card.onclick = () => {
        // Navigate to specific item in menu page using URL fragment
        window.location.href = `pages/speisekarte.html?item=${item.id}#${item.category}`;
    };
    
    const currencySymbol = menuData.settings?.currency_symbol || '€';
    
    card.innerHTML = `
        <img src="${item.image || 'images/placeholder-card.svg'}" 
             alt="${item.name}" 
             class="specialty-image">
        <div class="specialty-content">
            <h3 class="specialty-title">${item.name}</h3>
            <p class="specialty-description">${item.description}</p>
            <p class="specialty-price">${item.price}${currencySymbol}</p>
        </div>
    `;
    
    return card;
}

/**
 * Loading screen functions
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

/**
 * Utility functions
 */

// Format price with currency
function formatPrice(price) {
    const currencySymbol = menuData.settings?.currency_symbol || '€';
    return `${price}${currencySymbol}`;
}

// Get category display name
function getCategoryName(categoryKey) {
    return menuData.categories?.[categoryKey] || categoryKey;
}

// Filter menu items by category
function getMenuItemsByCategory(category) {
    const items = [];
    
    Object.keys(menuData).forEach(key => {
        if (key !== 'settings' && key !== 'categories' && menuData[key].category === category) {
            items.push({
                key: key,
                ...menuData[key]
            });
        }
    });
    
    return items;
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for use in other pages
window.JimmysApp = {
    menuData,
    cookieSettings,
    loadMenuData,
    parseINI,
    formatPrice,
    getCategoryName,
    getMenuItemsByCategory,
    scrollToElement,
    showLoadingScreen,
    hideLoadingScreen
};

/**
 * Initialize contact form with mailto functionality
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('contactName');
            const email = formData.get('contactEmail');
            const phone = formData.get('contactPhone');
            const location = formData.get('contactLocation');
            const subject = formData.get('contactSubject');
            const message = formData.get('contactMessage');
            
            // Get location name
            const locationNames = {
                'neustadt': 'Neustadt in Holstein',
                'grossenbrode': 'Großenbrode',
                'both': 'Beide Standorte',
                'general': 'Allgemeine Anfrage'
            };
            
            const locationName = locationNames[location] || location;
            
            // Create email subject
            const emailSubject = subject ? `Kontaktanfrage: ${subject}` : 'Kontaktanfrage von der Website';
            
            // Create email body
            const emailBody = `
Neue Kontaktanfrage von der Jimmy's Tapas Bar Website:

Name: ${name}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}
Standort: ${locationName}
Betreff: ${subject || 'Nicht angegeben'}

Nachricht:
${message}

---
Diese Nachricht wurde über das Kontaktformular auf jimmys-tapasbar.de gesendet.
            `.trim();
            
            // Create mailto URL
            const mailtoUrl = `mailto:info@jimmys-tapasbar.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoUrl;
            
            // Show success message
            showContactSuccess();
        });
    }
}

/**
 * Show contact form success message
 */
function showContactSuccess() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="button-text">✓ E-Mail-Programm geöffnet</span>';
        submitButton.style.backgroundColor = '#28a745';
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.backgroundColor = '';
            submitButton.disabled = false;
        }, 3000);
    }
}

// Console welcome message
console.log(`
🌶️ Jimmy's Tapas Bar - Static Website
🚀 Website loaded successfully
📄 Menu data: ${Object.keys(menuData).length} items loaded
🍪 Cookie consent: ${localStorage.getItem('cookieConsent') || 'not set'}
`);