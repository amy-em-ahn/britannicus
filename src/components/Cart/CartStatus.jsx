import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../api/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { RiShoppingBag3Fill } from 'react-icons/ri';

export default function CartStatus() {
  const { uid } = useAuthContext();
  const { data: products } = useQuery(['carts'], () => getCart(uid));

  return (
    <div className='relative'>
      <RiShoppingBag3Fill className='text-4xl' />
      {products && (
        <p className='w-6 h-6 text-center bg-pink-600  text-white font-bold rounded-full absolute -top-1 -right-2'>
          {products.length}
        </p>
      )}
    </div>
  );
}
