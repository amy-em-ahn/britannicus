import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Button from './ui/Button';
import { addOrUpdateToCart } from '../api/firebase';
import { useAuthContext } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function AddToCartButton({
  text = 'Add to Cart',
  onClick,
  disabled,
  icon: Icon = FaShoppingCart,
  className = 'w-full mb-2 min-w-40',
  productId,
  productData,
  onStatusChange
}) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const handleClick = async (e) => {
    e.stopPropagation();

    if (onClick) {
      onClick(e);
      return;
    }

    if (!user) {
      if (onStatusChange) {
        onStatusChange({
          type: 'error',
          message: 'Please log in to add items to your cart.'
        });
      } else {
        alert('Please log in to add items to your cart.');
      }
      return;
    }

    if (!productId) {
      console.error('Product ID is missing');
      if (onStatusChange) {
        onStatusChange({
          type: 'error',
          message: 'Cannot add to cart: Product ID is missing'
        });
      } else {
        alert('Cannot add to cart: Product ID is missing');
      }
      return;
    }

    console.log('Adding to cart with productId:', productId);
    console.log('Product data:', productData);

    const cartItem = {
      id: productId,
      title: productData.title,
      image: productData.image,
      price: productData.price,
      currency: productData.currency || 'USD',
      quantity: productData.quantity || 1
    };

    console.log('Cart item to be added:', cartItem);

    if (productData.color) {
      cartItem.color = Array.isArray(productData.color)
        ? productData.color[0]
        : productData.color;
    }

    if (productData.size) {
      cartItem.size = Array.isArray(productData.size)
        ? productData.size[0]
        : productData.size;
    }

    try {
      console.log('Adding to cart for user:', user.uid);
      await addOrUpdateToCart(user.uid, cartItem);

      // 장바구니 쿼리 무효화
      queryClient.invalidateQueries(['cart']);

      if (onStatusChange) {
        onStatusChange({
          type: 'success',
          message: 'Item added to cart successfully!'
        });
      } else {
        alert('Item added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (onStatusChange) {
        onStatusChange({
          type: 'error',
          message: 'Failed to add item to cart. Please try again.'
        });
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  return (
    <Button
      className={className}
      icon={Icon}
      text={text}
      onClick={handleClick}
      disabled={disabled}
    />
  );
}
