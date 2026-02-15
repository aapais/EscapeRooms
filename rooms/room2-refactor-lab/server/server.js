const express = require('express');
const app = express();
const path = require('path');
const engine = require('../src/invoiceEngine');

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/invoice', (req, res) => {
  // Simulate legacy slowness or processing
  try {
    const invoice = engine.generateInvoice({
        id: 'REQ-' + Date.now(),
        customer: { type: 'VIP', country: 'PT' },
        items: [
            { id: 'A', price: 100 },
            { id: 'B', price: 200 }
        ]
    });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🧾 Room 2 Invoice System running at http://localhost:${PORT}`);
});
