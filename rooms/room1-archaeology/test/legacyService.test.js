'use strict';

const svc = require('../src/legacyService');

describe('Room 1 — legacy service behaviour', () => {
  beforeEach(() => {
    svc.resetAllForTestsOnly();
  });

  test('creates user and authenticates', () => {
    const res = svc.createUser('Alice', 'secret', { isAdmin: true });
    expect(res.ok).toBe(true);

    const auth = svc.authenticate('Alice', 'secret');
    expect(auth.ok).toBe(true);
    expect(typeof auth.token).toBe('string');
    expect(auth.user.username).toBe('Alice');
  });

  test('free shipping should apply for subtotal >= 50 EUR', () => {
    svc.createUser('Bob', 'pw');
    const auth = svc.authenticate('Bob', 'pw');

    const order = svc.placeOrder(auth.token, {
      currency: 'EUR',
      items: [
        { sku: 'A', qty: 1, priceCents: 5000 }
      ],
      shippingAddress: { country: 'PT' }
    });

    expect(order.ok).toBe(true);
    expect(order.order.amounts.subtotalCents).toBe(5000);

    // EXPECTATION: shipping free at/above 50 EUR
    expect(order.order.amounts.shippingCents).toBe(0);
  });

  test('tax should be computed on (subtotal - discount + shipping)', () => {
    svc.createUser('Carla', 'pw');
    const auth = svc.authenticate('Carla', 'pw');

    const order = svc.placeOrder(auth.token, {
      currency: 'EUR',
      discountCode: 'WELCOME10',
      items: [
        { sku: 'A', qty: 2, priceCents: 1000 }
      ],
      shippingAddress: { country: 'PT' }
    });

    expect(order.ok).toBe(true);
    // subtotal = 2000, discount=200, shipping should be 450 (below 50 EUR)
    // taxable = 2000 - 200 + 450 = 2250 => tax=517.5 => 518
    expect(order.order.amounts.taxCents).toBe(518);
  });
});
