import React, { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { ImBooks } from 'react-icons/im';
import { FaRegFrownOpen } from 'react-icons/fa';

export default function ProductOrderInfo({
  currency = 'USD',
  price,
  stock,
  productId,
  productData,
  onStatusChange,
  selectedColor = '',
  selectedSize = ''
}) {
  const [quantity, setQuantity] = useState(1);

  // price와 stock을 숫자로 변환
  const numericPrice = price
    ? typeof price === 'string'
      ? parseFloat(price.replace(/,/g, ''))
      : price
    : 0;

  const numericStock = stock
    ? typeof stock === 'string'
      ? parseInt(stock.replace(/,/g, ''), 10)
      : stock
    : 0;

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= numericStock) {
      setQuantity(newQuantity);
    }
  };

  const currencySymbol =
    currency === 'USD'
      ? '$'
      : currency === 'GBP'
      ? '£'
      : currency === 'EUR'
      ? '€'
      : currency === 'CAN'
      ? 'C$'
      : '$';

  const inStock = numericStock > 0;

  return (
    <div className='bg-white rounded-lg shadow p-4 sticky top-4'>
      <div className='text-center pb-4'>
        <div className='text-xl font-bold'>
          {currencySymbol}
          {numericPrice ? numericPrice.toLocaleString() : '0.00'}
        </div>
        <div className='text-sm text-gray-500'>
          {inStock ? (
            <span className='text-green-600 flex items-center justify-center'>
              <ImBooks className='mr-1' /> In Stock (
              {parseInt(numericStock, 10).toLocaleString()})
            </span>
          ) : (
            <span className='text-red-600 flex items-center justify-center'>
              <FaRegFrownOpen className='mr-1' /> Out of Stock
            </span>
          )}
        </div>
      </div>

      {inStock && (
        <div className='py-3 border-t'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-sm font-medium'>Quantity:</span>
            <div className='flex items-center border rounded-md'>
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className='px-3 py-1 text-lg font-bold disabled:text-gray-300'
              >
                -
              </button>
              <span className='px-3 py-1 text-center'>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= numericStock}
                className='px-3 py-1 text-lg font-bold disabled:text-gray-300'
              >
                +
              </button>
            </div>
          </div>

          <AddToCartButton
            productId={productId}
            productData={{
              ...productData,
              quantity,
              color: selectedColor,
              size: selectedSize
            }}
            onStatusChange={onStatusChange}
          />
        </div>
      )}
    </div>
  );
}
