import products from './products.js';

// Отображение товаров
function displayProducts(productsToShow = products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <div class="product-actions">
                    <button class="details-btn" onclick="showDetails(${product.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Показ деталей товара
function showDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body">
                <img src="${product.image}" alt="${product.name}">
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <div class="specs">
                        <h3>Характеристики:</h3>
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-name">${key}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-price">${product.price.toLocaleString()} ₽</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Добавление в корзину
function addToCart(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const product = products.find(p => p.id === productId);
    
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showAddedToCartAnimation();
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Анимация добавления в корзину
function showAddedToCartAnimation() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Товар добавлен в корзину';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2500);
}

// Фильтрация по категориям
function initCategoryFilters() {
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            const filteredProducts = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);
            displayProducts(filteredProducts);
        });
    });
}

// Поиск товаров
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });
}

// Боковое меню
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Сортировка товаров
function sortProducts(type) {
    let sortedProducts = [...products];
    switch(type) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    displayProducts(sortedProducts);
}

// Инициализация страницы
function initPage() {
    displayProducts();
    updateCartCount();
    initCategoryFilters();
    initSearch();
}

// Экспорт функций для глобального использования
window.addToCart = addToCart;
window.showDetails = showDetails;
window.toggleSidebar = toggleSidebar;
window.sortProducts = sortProducts;

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initPage);