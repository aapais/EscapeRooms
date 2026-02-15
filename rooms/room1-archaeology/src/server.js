'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const legacyService = require('./legacyService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());

// Initialize store with some data
if (process.env.NODE_ENV !== 'test') {
  legacyService.createUser('Alice', 'secret123', { isAdmin: true });
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const result = legacyService.authenticate(username, password);
  res.json(result);
});

app.post('/api/checkout', (req, res) => {
  const { token, cart, shippingAddress, discountCode } = req.body;
  const result = legacyService.placeOrder(token, {
    items: cart,
    shippingAddress,
    discountCode,
    currency: 'EUR'
  });
  res.json(result);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Room 1 Server running on http://localhost:${PORT}`);
    console.log(`Open Browser to see the Legacy Shop!`);
  });
}

module.exports = app;
