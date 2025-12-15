const xml2js = require('xml2js');

const builder = new xml2js.Builder({
  xmldec: { version: '1.0', encoding: 'UTF-8' },
  renderOpts: { pretty: true, indent: '  ', newline: '\n' }
});

class XmlConverter {
  static jsonToXml(data, rootName = 'data') {
    const obj = {};
    obj[rootName] = data;
    return builder.buildObject(obj);
  }

  static productsToXml(products) {
    const xmlData = {
      products: {
        product: products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          sizes: {
            size: p.size
          },
          color: p.color,
          stock: p.stock
        }))
      }
    };
    return builder.buildObject(xmlData);
  }

  static ordersToXml(orders) {
    const xmlData = {
      orders: {
        order: orders.map(o => ({
          id: o.id,
          productId: o.productId,
          customerName: o.customerName,
          size: o.size,
          quantity: o.quantity,
          totalPrice: o.totalPrice,
          status: o.status,
          date: o.date
        }))
      }
    };
    return builder.buildObject(xmlData);
  }
}

module.exports = XmlConverter;