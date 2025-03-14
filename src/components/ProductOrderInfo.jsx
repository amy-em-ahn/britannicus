import React, { useState } from 'react';
import Button from './ui/Button';
import { FaRegHeart, FaShieldAlt } from 'react-icons/fa';
import AddToCartButton from './AddToCartButton';
import { ImBooks } from 'react-icons/im';
import { FaRegFrownOpen } from 'react-icons/fa';

export default function ProductOrderInfo({
  currency = 'USD',
  price,
  stock,
  productId,
  productData
}) {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (value) => {
    if (!value && value !== 0) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= stock) {
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

  const formattedPrice = formatPrice(price);
  const inStock = stock > 0;

  return (
    <div className='bg-white rounded-lg shadow p-4 sticky top-4'>
      <div className='text-center pb-4'>
        <div className='text-xl font-bold'>
          {currencySymbol}
          {formattedPrice}
        </div>
        <div className='text-sm text-gray-500'>
          {inStock ? (
            <span className='text-green-600 flex items-center justify-center'>
              <ImBooks className='mr-1' /> In Stock ({stock})
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
                disabled={quantity >= stock}
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
              quantity
            }}
          />

          <Button
            className='w-full mb-2 min-w-40'
            icon={FaRegHeart}
            text='Save for Later'
            onClick={() => alert('Product saved for later')}
          />
        </div>
      )}

      <div className='pt-4 border-t'>
        <div className='text-sm text-gray-600 flex items-center mb-2'>
          <FaShieldAlt className='mr-2 text-green-600' />
          <span>Secure transaction</span>
        </div>
        <div className='text-xs text-gray-500'>
          Your purchase is protected through our secure payment process.
        </div>
      </div>
    </div>
  );
}
