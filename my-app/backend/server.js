const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const { Builder } = require('xml2js'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const PRODUCTS_PATH = path.join(__dirname, 'data', 'products.json');
const ORDERS_PATH = path.join(__dirname, 'data', 'orders.json');

const xmlBuilder = new Builder({
  xmldec: { version: '1.0', encoding: 'UTF-8' },
  renderOpts: { pretty: true, indent: '  ', newline: '\n' }
});

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error);
    return { products: [] };
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Ошибка записи файла ${filePath}:`, error);
    throw error;
  }
}

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/products', async (_req, res) => {
  try {
    const data = await readJsonFile(PRODUCTS_PATH);
    res.json(data.products);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении данных' });
  }
});

app.get('/api/orders', async (_req, res) => {
  try {
    const data = await readJsonFile(ORDERS_PATH);
    res.json(data.orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении данных' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    
    if (!newOrder.productId || !newOrder.customerName || !newOrder.quantity) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    
    const productsData = await readJsonFile(PRODUCTS_PATH);
    const product = productsData.products.find(p => p.id === newOrder.productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    if (newOrder.quantity > product.stock) {
      return res.status(400).json({ error: 'Недостаточно товара на складе' });
    }
    
    const ordersData = await readJsonFile(ORDERS_PATH);
    
    const newId = ordersData.orders.length > 0 
      ? Math.max(...ordersData.orders.map(o => o.id)) + 1 
      : 1001;
    
    product.stock -= newOrder.quantity;
    
    const order = {
      id: newId,
      productId: newOrder.productId,
      customerName: newOrder.customerName,
      size: newOrder.size || product.size[0],
      quantity: newOrder.quantity,
      totalPrice: product.price * newOrder.quantity,
      status: 'в обработке',
      date: new Date().toISOString().split('T')[0]
    };
    
    ordersData.orders.push(order);
    await writeJsonFile(ORDERS_PATH, ordersData);
    await writeJsonFile(PRODUCTS_PATH, productsData);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const ordersData = await readJsonFile(ORDERS_PATH);
    
    const orderIndex = ordersData.orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const order = ordersData.orders[orderIndex];
    const productsData = await readJsonFile(PRODUCTS_PATH);
    const product = productsData.products.find(p => p.id === order.productId);
    
    if (product) {
      product.stock += order.quantity;
      await writeJsonFile(PRODUCTS_PATH, productsData);
    }
    
    ordersData.orders.splice(orderIndex, 1);
    await writeJsonFile(ORDERS_PATH, ordersData);
    
    res.json({ message: 'Заказ успешно удален', deletedOrder: order });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении заказа' });
  }
});

app.get('/api/data/:type', async (req, res) => {
  try {
    const { type } = req.params; 
    const accept = req.headers.accept || 'application/json';
    
    let data;
    
    if (type === 'products') {
      const productsData = await readJsonFile(PRODUCTS_PATH);
      data = productsData.products;
    } else if (type === 'orders') {
      const ordersData = await readJsonFile(ORDERS_PATH);
      data = ordersData.orders;
    } else {
      return res.status(400).json({ error: 'Неверный тип данных' });
    }
    
    if (accept.includes('application/xml')) {
      const xmlData = {};
      
      if (type === 'products') {
        xmlData.products = { product: data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          sizes: { size: p.size },
          color: p.color,
          stock: p.stock
        }))};
      } else {
        xmlData.orders = { order: data.map(o => ({
          id: o.id,
          productId: o.productId,
          customerName: o.customerName,
          size: o.size,
          quantity: o.quantity,
          totalPrice: o.totalPrice,
          status: o.status,
          date: o.date
        }))};
      }
      
      const xml = xmlBuilder.buildObject(xmlData);
      res.setHeader('Content-Type', 'application/xml');
      return res.send(xml);
    } 
    else if (accept.includes('text/html')) {
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${type === 'products' ? 'Товары' : 'Заказы'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>${type === 'products' ? 'Список товаров' : 'Список заказов'}</h1>
          <table>
      `;
      
      if (type === 'products') {
        html += '<tr><th>ID</th><th>Название</th><th>Категория</th><th>Цена</th><th>Размеры</th><th>Цвет</th><th>Остаток</th></tr>';
      } else {
        html += '<tr><th>ID</th><th>Клиент</th><th>ID товара</th><th>Размер</th><th>Количество</th><th>Сумма</th><th>Статус</th><th>Дата</th></tr>';
      }
      
      data.forEach(item => {
        html += '<tr>';
        if (type === 'products') {
          html += `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.price} руб.</td>
            <td>${Array.isArray(item.size) ? item.size.join(', ') : item.size}</td>
            <td>${item.color}</td>
            <td>${item.stock}</td>
          `;
        } else {
          html += `
            <td>${item.id}</td>
            <td>${item.customerName}</td>
            <td>${item.productId}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>${item.totalPrice} руб.</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
          `;
        }
        html += '</tr>';
      });
      
      html += `
          </table>
        </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } 
    else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`API доступен по адресу http://localhost:${PORT}/api`);
});