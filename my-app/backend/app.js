const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler'); 
const countryRoutes = require('./routes/country.routes');
const routeRoutes = require('./routes/route.routes');
const saleRoutes = require('./routes/sale.routes');

require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(bodyParser.json());

app.use('/api/countries', countryRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/sales', saleRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;