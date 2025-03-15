import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../api/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { RiShoppingBag3Fill } from 'react-icons/ri';

export default function CartStatus() {
  const { uid } = useAuthContext();
  const { data: products } = useQuery(['cart'], () => getCart(uid), {
    enabled: !!uid,
    staleTime: 0, // 항상 최신 데이터를 가져오도록 설정
    refetchOnWindowFocus: true, // 창이 포커스를 받을 때 다시 가져오기
    refetchOnMount: true // 컴포넌트가 마운트될 때 다시 가져오기
  });

  console.log('CartStatus - Cart products:', products);

  const validProducts = products
    ? products.filter((product) => product && (product.id || product.Id))
    : [];
  console.log('CartStatus - Valid products count:', validProducts.length);

  return (
    <div className='relative'>
      <RiShoppingBag3Fill className='text-4xl' />
      {validProducts && validProducts.length > 0 && (
        <p className='w-6 h-6 text-center bg-pink-600 text-white font-bold rounded-full absolute -top-1 -right-2'>
          {validProducts.length}
        </p>
      )}
    </div>
  );
}
