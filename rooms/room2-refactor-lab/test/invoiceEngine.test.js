'use strict';

const { InvoiceEngine } = require('../src/invoiceEngine');

describe('Room 2 — invoice engine', () => {
  test('generates invoice with welcome discount and PT tax', () => {
    const engine = new InvoiceEngine();
    const invoice = engine.generateInvoice(
      {
        items: [
          { sku: 'A', qty: 2, unitPrice: 10 }
        ],
        discountCode: 'WELCOME10',
        shippingAddress: { country: 'PT' }
      },
      { id: 'u1', tier: 'REGULAR' }
    );

    expect(invoice.ok).toBe(true);
    expect(invoice.amounts.subtotal).toBe(20);
    expect(invoice.amounts.discount).toBe(2);
    expect(invoice.amounts.shipping).toBe(4.5);
    // taxable = 20-2+4.5=22.5; tax=5.175=>5.18
    expect(invoice.amounts.tax).toBe(5.18);
  });
});
