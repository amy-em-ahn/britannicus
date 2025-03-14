import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Button from './ui/Button';
import { addOrUpdateToCart } from '../api/firebase';
import { useAuthContext } from '../context/AuthContext';

export default function AddToCartButton({
  text = 'Add to Cart',
  onClick,
  disabled,
  icon: Icon = FaShoppingCart,
  className = 'w-full mb-2 min-w-40',
  productId,
  productData
}) {
  const { user } = useAuthContext();

  const handleClick = async (e) => {
    e.stopPropagation();

    if (onClick) {
      onClick(e);
      return;
    }

    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const cartItem = {
      Id: productId,
      productId: productId,
      title: productData.title,
      image: productData.image,
      price: productData.price,
      currency: productData.currency || 'USD',
      quantity: productData.quantity || 1
    };

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
      await addOrUpdateToCart(user.uid, cartItem);
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
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
