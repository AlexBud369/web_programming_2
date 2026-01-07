const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler'); 
const countryRoutes = require('./routes/country.routes');
const routeRoutes = require('./routes/route.routes');
const saleRoutes = require('./routes/sale.routes');
const authRoutes = require('./routes/auth.routes');

require('dotenv').config();

const app = express();

app.use(cors({ 
  origin: process.env.CLIENT_URL || '*',
  credentials: true 
}));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Travel Planner API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/sales', saleRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;