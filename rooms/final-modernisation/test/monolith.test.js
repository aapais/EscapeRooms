'use strict';

const { calcScore } = require('../src/monolith');

describe('Final — monolith baseline', () => {
  test('calculates score deterministically', () => {
    const res = calcScore({ age: 30, country: 'PT', spends: [200, 350] });
    expect(res.totalSpent).toBe(550);
    // age 30-49 => 15, PT => 2, spends>500 => 5, total => 22
    expect(res.score).toBe(22);
  });
});
