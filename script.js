// ============================================================
// 1. ДАННЫЕ О БУКЕТАХ 
// ============================================================
const bouquetData = [
    { 
        id: 1, 
        name: "Авторский букет №201", 
        price: 3500, 
        category: "author", 
        image: "img/bouquet1.jpg", 
        description: "Уникальная композиция, созданная в единственном экземпляре" 
    },
    { 
        id: 2, 
        name: "Весеннее настроение", 
        price: 4200, 
        category: "author", 
        image: "img/bouquet2.jpg", 
        description: "Авторский букет с яркими весенними оттенками" 
    },
    { 
        id: 3, 
        name: "Нежность пионов", 
        price: 5100, 
        category: "mono", 
        image: "img/bouquet3.jpg", 
        description: "Монобукет из роскошных пионов в нежных тонах" 
    },
    { 
        id: 4, 
        name: "Классика элегантности", 
        price: 4800, 
        category: "mono", 
        image: "img/bouquet4.jpg", 
        description: "Монобукет из белых роз — символ чистоты и элегантности" 
    },
    { 
        id: 5, 
        name: "Свадебный вальс", 
        price: 6200, 
        category: "author", 
        image: "img/bouquet5.jpg", 
        description: "Авторский свадебный букет в нежных пастельных тонах" 
    },
    { 
        id: 6, 
        name: "Цветы в коробке №1", 
        price: 3900, 
        category: "box", 
        image: "img/bouquet6.jpg", 
        description: "Изысканная композиция в стильной коробке" 
    },
    { 
        id: 7, 
        name: "Романтический закат", 
        price: 5500, 
        category: "author", 
        image: "img/bouquet7.jpg", 
        description: "Авторский букет с тёплыми оттенками заката" 
    },
    { 
        id: 8, 
        name: "Монобукет из тюльпанов", 
        price: 3600, 
        category: "mono", 
        image: "img/bouquet8.jpg", 
        description: "Классический монобукет из свежих тюльпанов" 
    },
    { 
        id: 9, 
        name: "Цветы в коробке №2", 
        price: 4700, 
        category: "box", 
        image: "img/bouquet9.jpg", 
        description: "Элегантная композиция в деревянной коробке" 
    },
    { 
        id: 10, 
        name: "Авторский букет №152", 
        price: 6800, 
        category: "author", 
        image: "img/bouquet10.jpg", 
        description: "Эксклюзивный авторский букет с редкими сортами цветов" 
    }
];
// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================
let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let currentPage = 1;
const itemsPerPage = 6;

// Функция сортировки
function sortBouquets(data) {
    const sorted = [...data];
    switch(currentSort) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Загружаем корзину из localStorage
function loadCart() {
    const saved = localStorage.getItem('buketoff_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
    updateCartUI();
}

// Сохраняем корзину в localStorage
function saveCart() {
    localStorage.setItem('buketoff_cart', JSON.stringify(cart));
}

// ============================================================
// 3. DOM-ЭЛЕМЕНТЫ
// ============================================================
const grid = document.getElementById('catalogGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCount = document.getElementById('cartCount');

// ============================================================
// 4. РЕНДЕРИНГ КАТАЛОГА
// ============================================================
function renderCatalog() {
    // Фильтрация
    const filtered = currentFilter === 'all' 
        ? bouquetData 
        : bouquetData.filter(item => item.category === currentFilter);
    
    // СОРТИРОВКА (добавлено)
    const sorted = sortBouquets(filtered);
    
    // Пагинация
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = sorted.slice(start, end);
    
    // Если нет товаров
    if (pageItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalog">
                <i class="fas fa-leaf" style="font-size: 48px; color: #ddd;"></i>
                <p style="color: #888; margin-top: 15px;">В этой категории пока нет букетов</p>
            </div>
        `;
        grid.style.display = 'grid';
        updatePagination(totalPages);
        return;
    }
    
    // Генерация HTML
    let html = '';
    pageItems.forEach(item => {
        const categoryMap = {
            'author': 'Авторский',
            'mono': 'Монобукет',
            'box': 'В коробке'
        };
        
        html += `
            <div class="catalog-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="catalog-item-content">
                    <span class="category-tag">${categoryMap[item.category] || item.category}</span>
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p>
                    <p class="price">${item.price.toLocaleString()} ₽</p>
                    <button class="btn btn-primary add-to-cart" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    grid.style.display = 'grid';
    updatePagination(totalPages);
}

// ============================================================
// 5. ПАГИНАЦИЯ
// ============================================================
function updatePagination(totalPages) {
    pageInfo.textContent = `${currentPage} / ${totalPages || 1}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCatalog();
        window.scrollTo({ top: document.getElementById('catalog').offsetTop - 100, behavior: 'smooth' });
    }
});

nextPageBtn.addEventListener('click', () => {
    const filtered = currentFilter === 'all' 
        ? bouquetData 
        : bouquetData.filter(item => item.category === currentFilter);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderCatalog();
        window.scrollTo({ top: document.getElementById('catalog').offsetTop - 100, behavior: 'smooth' });
    }
});

// ============================================================
// 6. ФИЛЬТРЫ
// ============================================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        currentPage = 1;
        renderCatalog();
    });
});


// Обработчик сортировки
const sortSelect = document.getElementById('sortSelect');

sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    currentPage = 1;
    renderCatalog();
});

// ============================================================
// 7. КОРЗИНА
// ============================================================

// Добавление в корзину (делегирование)
grid.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;
    
    const id = parseInt(button.dataset.id);
    const product = bouquetData.find(item => item.id === id);
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Визуальный фидбек
    button.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
    button.style.background = '#4CAF50';
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
        button.style.background = '';
    }, 1500);
});

// Открыть корзину
cartIcon.addEventListener('click', () => {
    renderCartModal();
    cartModal.classList.add('show')
    document.body.style.overflow = 'hidden';
});

// Закрыть корзину
function closeCartModal() {
    cartModal.classList.remove('show');
    document.body.style.overflow = '';
}

closeCart.addEventListener('click', closeCartModal);
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) closeCartModal();
});

// Рендеринг модального окна корзины
function renderCartModal() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket" style="font-size: 40px; color: #ddd; display: block; margin-bottom: 10px;"></i>
                Корзина пуста
            </div>
        `;
        cartTotalPrice.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price.toLocaleString()} ₽</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-decrease" data-id="${item.id}">−</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-increase" data-id="${item.id}">+</button>
                    <span class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </span>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotalPrice.textContent = total.toLocaleString() + ' ₽';
    
    // Обработчики для управления количеством
    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += 1;
                saveCart();
                renderCartModal();
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(i => i.id !== id);
                }
                saveCart();
                renderCartModal();
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            cart = cart.filter(i => i.id !== id);
            saveCart();
            renderCartModal();
            updateCartUI();
        });
    });
}

// Обновление иконки корзины
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Анимация
    if (totalItems > 0) {
        cartCount.classList.add('bump');
        setTimeout(() => cartCount.classList.remove('bump'), 300);
    }
}

// ============================================================
// 8. ОФОРМЛЕНИЕ ЗАКАЗА
// ============================================================
document.getElementById('checkoutBtn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте букеты.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsList = cart.map(item => `${item.name} (${item.quantity} шт.)`).join(', ');
    
    if (confirm(`Вы уверены, что хотите оформить заказ?\n\nТовары: ${itemsList}\nИтого: ${total.toLocaleString()} ₽`)) {
        alert('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время.');
        cart = [];
        saveCart();
        renderCartModal();
        updateCartUI();
        closeCartModal();
    }
});

// ============================================================
// 9. ФОРМА ОБРАТНОЙ СВЯЗИ
// ============================================================
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value.trim();
    const phone = this.querySelector('input[type="tel"]').value.trim();
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }
    
    alert(`Спасибо, ${name}! Мы свяжемся с вами по номеру ${phone} в ближайшее время.`);
    this.reset();
});

// ============================================================
// 10. АНИМАЦИИ ПРИ СКРОЛЛЕ
// ============================================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.advantage-item, .catalog-item');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && rect.bottom > 100) {
            el.classList.add('visible');
        }
    });
}

// ============================================================
// 11. ИНИЦИАЛИЗАЦИЯ
// ============================================================
loadCart();
renderCatalog();
animateOnScroll();

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('resize', () => {
    // Обновляем слайдер при изменении размера, если нужно
});

// Для кнопки "Смотреть каталог" в hero
document.querySelector('.hero .btn-primary')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
});

console.log('БукетOff запущен!');
console.log(`В каталоге ${bouquetData.length} букетов`);
