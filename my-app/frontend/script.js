const API_URL = 'http://localhost:3000/api';
let productsData = [];
let ordersData = [];

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        
        productsData = await response.json();
        displayProducts(productsData);
        populateProductSelect(productsData);
        console.log('Товары загружены:', productsData.length);

        return productsData;
    } catch (error) {
        showMessage('Ошибка при загрузке товаров', 'error');
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!container) {
        console.error('Элемент products-container не найден');
        return;
    }
    
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Категория:</strong> ${product.category}</p>
            <p><strong>Цвет:</strong> ${product.color}</p>
            <p class="price">${product.price} руб.</p>
            <p><strong>Размеры:</strong> ${Array.isArray(product.size) ? product.size.join(', ') : product.size}</p>
            <p><strong>В наличии:</strong> ${product.stock} шт.</p>
        `;
        container.appendChild(productCard);
    });
}

function populateProductSelect(products) {
    const select = document.getElementById('product-select');
    if (!select) {
        console.error('Элемент product-select не найден');
        return;
    }
    
    select.innerHTML = '<option value="">-- Выберите товар --</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${product.price} руб.)`;
        select.appendChild(option);
    });
}

function setupProductChangeListener() {
    const productSelect = document.getElementById('product-select');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const productId = parseInt(this.value);
            const product = productsData.find(p => p.id === productId);
            const sizeSelect = document.getElementById('size-select');
            
            if (!sizeSelect) return;
            
            sizeSelect.innerHTML = '<option value="">-- Выберите размер --</option>';
            
            if (product && Array.isArray(product.size)) {
                product.size.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    sizeSelect.appendChild(option);
                });
            }
        });
    }
}

function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const input = document.getElementById('quantity');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    }
    
    const increaseBtn = document.getElementById('increase-quantity');
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const input = document.getElementById('quantity');
            if (parseInt(input.value) < 10) {
                input.value = parseInt(input.value) + 1;
            }
        });
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('product-select').value);
    const customerName = document.getElementById('customer-name').value;
    const size = document.getElementById('size-select').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!productId || !customerName || !size || !quantity) {
        showMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    const product = productsData.find(p => p.id === productId);
    if (!product) {
        showMessage('Товар не найден', 'error');
        return;
    }
    
    if (quantity > product.stock) {
        showMessage(`Недостаточно товара на складе. Доступно: ${product.stock} шт.`, 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                customerName,
                size,
                quantity
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка при создании заказа');
        }
        
        const newOrder = await response.json();
        showMessage(`Заказ #${newOrder.id} успешно создан!`, 'success');
        
        await loadProducts();
        await loadOrders();
        
        document.getElementById('order-form').reset();
        document.getElementById('size-select').innerHTML = '<option value="">-- Выберите размер --</option>';
        
    } catch (error) {
        showMessage(error.message, 'error');
        console.error('Error creating order:', error);
    }
}

async function loadOrders() {
    try {
        console.log('Загрузка заказов...');
        if (productsData.length === 0) {
            await loadProducts();
        }
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error('Ошибка сети');
        
        ordersData = await response.json();
        displayOrders(ordersData);
        console.log('Заказы загружены:', ordersData.length);
        return ordersData;
    } catch (error) {
        showMessage('Ошибка при загрузке заказов', 'error');
        console.error('Error loading orders:', error);
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-body');
    if (!tbody) {
        console.error('Элемент orders-body не найден');
        return;
    }
    
    tbody.innerHTML = '';

    orders.forEach(order => {
        let productName = 'Неизвестно';
        const product = productsData.find(p => p.id === order.productId);
        if (product) {
            productName = product.name;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${productName} (#${order.productId})</td>
            <td>${order.size}</td>
            <td>${order.quantity}</td>
            <td>${order.totalPrice} руб.</td>
            <td>${order.status}</td>
            <td>${order.date}</td>
            <td>
                <button class="delete-order-btn" data-id="${order.id}">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    setupDeleteButtons();
}

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-order-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const orderId = parseInt(this.getAttribute('data-id'));
            await deleteOrder(orderId);
        });
    });
}

async function deleteOrder(orderId) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка при удалении заказа');
        }
        
        const result = await response.json();
        showMessage(`Заказ #${orderId} успешно удален`, 'success');
        
        await loadProducts();
        await loadOrders();
        
    } catch (error) {
        showMessage(error.message, 'error');
        console.error('Error deleting order:', error);
    }
}

async function downloadData(type, format) {
    try {
        const headers = {};
        
        switch (format) {
            case 'json':
                headers['Accept'] = 'application/json';
                break;
            case 'xml':
                headers['Accept'] = 'application/xml';
                break;
            case 'html':
                headers['Accept'] = 'text/html';
                break;
        }
        
        const response = await fetch(`${API_URL}/data/${type}`, { headers });
        
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }
        
        let content, mimeType, extension;
        
        switch (format) {
            case 'json':
                const json = await response.json();
                content = JSON.stringify(json, null, 2);
                mimeType = 'application/json';
                extension = 'json';
                break;
            case 'xml':
                content = await response.text();
                mimeType = 'application/xml';
                extension = 'xml';
                break;
            case 'html':
                content = await response.text();
                mimeType = 'text/html';
                extension = 'html';
                break;
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage(`Файл ${type}.${extension} успешно скачан`, 'success');
        
    } catch (error) {
        showMessage('Ошибка при скачивании файла', 'error');
        console.error('Error downloading data:', error);
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('order-message');
    if (!messageDiv) {
        console.error('Элемент order-message не найден');
        return;
    }
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function setupEventListeners() {
    const refreshProductsBtn = document.getElementById('refresh-products-btn');
    if (refreshProductsBtn) {
        refreshProductsBtn.addEventListener('click', async () => {
            await loadProducts();
            showMessage('Товары обновлены', 'success');
        });
    }
    
    const refreshOrdersBtn = document.getElementById('refresh-orders-btn');
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', async () => {
            await loadOrders();
            showMessage('Заказы обновлены', 'success');
        });
    }
    
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    setupProductChangeListener();
    
    setupQuantityControls();
    
    const downloadButtons = document.querySelectorAll('button[onclick^="downloadData"]');
    downloadButtons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        const match = onclick.match(/downloadData\('([^']+)',\s*'([^']+)'\)/);
        if (match) {
            const type = match[1];
            const format = match[2];
            button.removeAttribute('onclick');
            button.addEventListener('click', () => downloadData(type, format));
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Страница загружена, настраиваем обработчики...');
    
    setupEventListeners();
    
    try {
        await loadProducts();
        await loadOrders();
        showMessage('Добро пожаловать в магазин одежды!', 'success');
    } catch (error) {
        showMessage('Ошибка при загрузке данных', 'error');
        console.error('Initialization error:', error);
    }
    
    console.log('Приложение инициализировано');
});