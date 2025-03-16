import React, { useState } from 'react';
import { TbSquareRoundedMinus, TbSquareRoundedPlus } from 'react-icons/tb';
import ProductImage from '../ProductImage';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { addOrUpdateToCart, removeFromCart } from '../../api/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const ICON_CLASS =
  'transition-all cursor-pointer hover:text-pink-600 hover:scale-105 mx-2 shrink-0';

export default function CartItem({
  product,
  product: {
    id,
    Id,
    image,
    title,
    author,
    year,
    publishedby,
    color,
    size,
    price,
    quantity
  },
  onStatusChange
}) {
  const navigate = useNavigate();
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const productId = id || Id;

  console.log('CartItem received product:', product);
  console.log('CartItem extracted id:', id);
  console.log('CartItem extracted Id:', Id);
  console.log('CartItem using productId:', productId);

  const handleMinus = async () => {
    if (quantity > 1) {
      try {
        setIsUpdating(true);

        if (!productId) {
          console.error('Product ID is undefined');
          onStatusChange({
            type: 'error',
            message: 'Failed to update quantity: Product ID is missing'
          });
          setIsUpdating(false);
          return;
        }

        const updatedProduct = {
          ...product,
          id: productId,
          quantity: quantity - 1
        };
        console.log('Updating cart with product:', updatedProduct);
        const result = await addOrUpdateToCart(uid, updatedProduct);
        queryClient.invalidateQueries(['cart']);
        onStatusChange({
          type: result.changed ? 'success' : 'info',
          message: result.message
        });
      } catch (error) {
        console.error('Error updating cart:', error);
        onStatusChange({
          type: 'error',
          message: 'Failed to update quantity'
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handlePlus = async () => {
    try {
      setIsUpdating(true);

      if (!productId) {
        console.error('Product ID is undefined');
        onStatusChange({
          type: 'error',
          message: 'Failed to update quantity: Product ID is missing'
        });
        setIsUpdating(false);
        return;
      }

      const updatedProduct = {
        ...product,
        id: productId,
        quantity: quantity + 1
      };
      console.log('Updating cart with product:', updatedProduct);
      const result = await addOrUpdateToCart(uid, updatedProduct);
      queryClient.invalidateQueries(['cart']);
      onStatusChange({
        type: result.changed ? 'success' : 'info',
        message: result.message
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      onStatusChange({
        type: 'error',
        message: 'Failed to update quantity'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);

    try {
      const result = await removeFromCart(uid, productId);
      queryClient.invalidateQueries(['cart']);

      if (onStatusChange) {
        onStatusChange({
          type: result.success ? 'success' : 'error',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (onStatusChange) {
        onStatusChange({
          type: 'error',
          message: 'Failed to remove item from cart. Please try again.'
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProductClick = () => {
    navigate(`/products/${productId}`, { state: { product } });
  };

  return (
    <li className='flex justify-between my-2 items-center'>
      <div onClick={handleProductClick} className='cursor-pointer'>
        <ProductImage image={image} alt={title} size='small' />
      </div>
      <div className='flex-1 flex justify-between ml-4'>
        <div className='basis-3/5'>
          <p className='text-lg font-bold'>{title}</p>
          <div>
            <span>{author}</span>
            <span>{publishedby}</span>
            <span>{year}</span>
          </div>
          <p className='text-md font-bold text-blue-700'>{color}</p>
          <p className='text-md font-bold text-blue-700'>{size}</p>
          <p className='text-xl font-bold text-pink-600'>
            $ {price.toLocaleString()}
          </p>
        </div>
      </div>
      <div className='text-2xl flex items-center'>
        <TbSquareRoundedMinus
          className={`${ICON_CLASS} ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={!isUpdating ? handleMinus : undefined}
        />
        <span>{quantity}</span>
        <TbSquareRoundedPlus
          className={`${ICON_CLASS} ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={!isUpdating ? handlePlus : undefined}
        />
        <RiDeleteBin6Fill
          className={`${ICON_CLASS} ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={!isUpdating ? handleDelete : undefined}
        />
      </div>
    </li>
  );
}
