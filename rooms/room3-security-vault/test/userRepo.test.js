'use strict';

const repo = require('../src/userRepo');

describe('Room 3 — security vault', () => {
  test('login should not accept wrong credentials', () => {
    expect(repo.login('admin', 'wrong').ok).toBe(false);
  });

  test('findUsersByName returns a query string (legacy) but should be safe after refactor', () => {
    const res = repo.findUsersByName("x' OR 1=1;--");
    expect(typeof res.query).toBe('string');
    // the test does not enforce safety; the scanner does.
  });
});
