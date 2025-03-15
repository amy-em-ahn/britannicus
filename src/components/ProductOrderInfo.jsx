import React, { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { ImBooks } from 'react-icons/im';
import { FaRegFrownOpen } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import { addOrUpdateToCart } from '../api/firebase';
import { useQueryClient } from '@tanstack/react-query';

export default function ProductOrderInfo({
  currency = 'USD',
  price,
  stock,
  productId,
  productData,
  onStatusChange
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const {
    id,
    images,
    category,
    options,
    title,
    author,
    publishedby,
    year,
    genre,
    colors,
    sizes
  } = productData || {};

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

  // add to cart
  const handleClick = async () => {
    const product = {
      id: productId || id,
      image: images && images.length > 0 ? images[0] : null,
      title,
      price,
      quantity
    };

    if (author) product.author = author;
    if (publishedby) product.publishedby = publishedby;
    if (year) product.year = year;

    if (colors && colors.length > 0 && selectedColor) {
      product.color = selectedColor;
    }

    if (sizes && sizes.length > 0 && selectedSize) {
      product.size = selectedSize;
    }

    try {
      await addOrUpdateToCart(uid, product);
      queryClient.invalidateQueries(['cart']);

      if (onStatusChange) {
        onStatusChange({
          type: 'success',
          message: 'Item added to cart successfully!'
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);

      if (onStatusChange) {
        onStatusChange({
          type: 'error',
          message: 'Failed to add item to cart. Please try again.'
        });
      }
    }
  };

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
          {colors && colors.length > 0 && (
            <div className='mb-4'>
              <span className='text-sm font-medium block mb-2'>Color:</span>
              <div className='flex flex-wrap gap-2'>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? 'border-blue-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes && sizes.length > 0 && (
            <div className='mb-4'>
              <span className='text-sm font-medium block mb-2'>Size:</span>
              <div className='flex flex-wrap gap-2'>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

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
            onStatusChange={onStatusChange}
          />

          {/* <Button
            className='w-full mb-2 min-w-40'
            icon={FaRegHeart}
            text='Save for Later'
            onClick={() => alert('Product saved for later')}
          /> */}
        </div>
      )}

      {/* <div className='pt-4 border-t'>
        <div className='text-sm text-gray-600 flex items-center mb-2'>
          <FaShieldAlt className='mr-2 text-green-600' />
          <span>Secure transaction</span>
        </div>
        <div className='text-xs text-gray-500'>
          Your purchase is protected through our secure payment process.
        </div>
      </div> */}
    </div>
  );
}
