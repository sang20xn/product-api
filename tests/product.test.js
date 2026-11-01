const test = require('node:test');
const assert = require('node:assert/strict');
const Product = require('../models/Product');

test('Product có đầy đủ các trường bắt buộc', () => {
  const product = new Product({
    pid: 'P101',
    pname: 'Laptop Dell',
    price: 12000000,
    quantity: 5
  });

  const error = product.validateSync();
  assert.equal(error, undefined);
});

test('Không chấp nhận giá sản phẩm âm', () => {
  const product = new Product({
    pid: 'P102',
    pname: 'Laptop HP',
    price: -100,
    quantity: 5
  });

  assert.ok(product.validateSync());
});