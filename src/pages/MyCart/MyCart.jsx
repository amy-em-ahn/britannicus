import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../api/firebase';
import { useAuthContext } from '../../context/AuthContext';
import BreadcrumbNav from '../../components/Navbar/BreadcrumbNav';
import CartItem from '../../components/Cart/CartItem';
import PriceCard from '../../components/Cart/PriceCard';

export default function MyCart() {
  const { uid } = useAuthContext();
  const { isLoading, data: products } = useQuery(['carts'], () => getCart(uid));

  // check shopping cart
  const hasProducts = products && products.length > 0;
  const totalPrice =
    products &&
    products.reduce(
      (prev, current) => prev + parseInt(current.price) * current.quantity,
      0
    );

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <Helmet>
        <title>My Cart | Britannicus BMS</title>
      </Helmet>
      <section className='w-full max-w-[1200px] mx-auto px-4 py-6'>
        <BreadcrumbNav />
        <h1>My Cart</h1>
        {!hasProducts && <p>No products in your cart</p>}
        {hasProducts && (
          <>
            <ul>
              {products.map((product) => (
                <CartItem key={product.id} product={product} />
              ))}
            </ul>
            <div>
              <PriceCard text='Total Price' price={totalPrice} />
            </div>
          </>
        )}
      </section>
    </>
  );
}
