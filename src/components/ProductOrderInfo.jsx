import React, { useState } from 'react';
import Button from '../components/ui/Button';

export default function ProductOrderInfo({ currency, price, stock }) {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (value) => {
    if (!value && value !== 0) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const increaseQuantity = () => {
    if (stock && quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className='bg-gray-50 p-4 rounded-lg'>
      <div className='text-2xl font-bold mb-4'>
        {currency} {formatPrice(price)}
      </div>

      <div className='mb-4'>
        <p className='text-sm text-gray-500 mb-2'>Quantity</p>
        <div className='flex items-center'>
          <button
            onClick={decreaseQuantity}
            className='w-8 h-8 flex items-center justify-center border rounded-l-md'
            disabled={quantity <= 1}
          >
            -
          </button>
          <div className='w-12 h-8 flex items-center justify-center border-t border-b'>
            {quantity}
          </div>
          <button
            onClick={increaseQuantity}
            className='w-8 h-8 flex items-center justify-center border rounded-r-md'
            disabled={stock && quantity >= stock}
          >
            +
          </button>

          {stock && (
            <span className='ml-3 text-sm text-gray-500'>
              {stock} available
            </span>
          )}
        </div>
      </div>

      <Button
        text='Add to Cart'
        icon='FaShoppingCart'
        className='w-full mb-2'
        onClick={() => alert('Product added to cart')}
      />

      <Button
        text='Save for Later'
        className='w-full bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100'
        onClick={() => alert('Product saved for later')}
      />
    </div>
  );
}
