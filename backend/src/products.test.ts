import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shippingFor } from './products.js';

for (const { name, subtotal, expected } of [
  { name: 'charges standard shipping for a small order', subtotal: 249, expected: 79 },
  { name: 'charges shipping just below the free-delivery threshold', subtotal: 1998, expected: 79 },
  { name: 'offers free shipping at exactly Rs.1999', subtotal: 1999, expected: 0 },
  { name: 'offers free shipping above the threshold', subtotal: 2241, expected: 0 },
]) {
  test(name, () => assert.equal(shippingFor(subtotal), expected));
}
