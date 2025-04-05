import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { addOrUpdateToCart, getCart, decrementStockOnCheckout } from '../../api/firebase';
import { useAuthContext } from '../../context/AuthContext';
import BreadcrumbNav from '../../components/Navbar/BreadcrumbNav';
import CartItem from '../../components/Cart/CartItem';
import Button from '../../components/ui/Button';
import { FaShoppingCart } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

export default function MyCart() {
  const { uid } = useAuthContext();
  const { isLoading, data: products, refetch } = useQuery(['cart'], () => getCart(uid));
  const [statusMessage, setStatusMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('Authentication state:', uid ? 'Logged in' : 'Not logged in');
  console.log('Cart products raw data:', products);
  const [orderModal, setOrderModal] = useState({
    show: false
  })
  const navigate = useNavigate();
  // 각 제품의 키와 값을 확인
  if (products && products.length > 0) {
    products.forEach((product, index) => {
      console.log(`Product ${index} keys:`, Object.keys(product));
      console.log(`Product ${index} full data:`, product);
    });
  }
  
  // Handle status changes from cart items
  const handleStatusChange = (status) => {
    setStatusMessage(status);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  // check shopping cart
  const validProducts = products
    ? products.filter((product) => product && (product.id || product.Id))
    : [];
  console.log('Valid products after filtering:', validProducts);

  // 각 유효한 제품의 ID 필드 확인
  if (validProducts && validProducts.length > 0) {
    validProducts.forEach((product, index) => {
      console.log(`Valid product ${index} id:`, product.id);
      console.log(`Valid product ${index} Id:`, product.Id);
    });
  }
  const hasProducts = validProducts.length > 0;
  const totalPrice =
    validProducts &&
    validProducts.reduce(
      (prev, current) => prev + parseInt(current.price) * current.quantity,
      0
    );
  if (isLoading) return <p>Loading...</p>;

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!uid) {
      setStatusMessage({
        type: 'error',
        message: 'You must be logged in to place an order'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await decrementStockOnCheckout(uid);
      
      if (result.success) {
        setStatusMessage({
          type: 'success',
          message: 'Order placed successfully!'
        });
        // Refresh cart after successful checkout
        refetch();
        setOrderModal({show: false});
      } else {
        setStatusMessage({
          type: 'error',
          message: `Failed to place order: ${result.message}`
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setStatusMessage({
        type: 'error',
        message: 'An unexpected error occurred during checkout'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Cart | Britannicus BMS</title>
      </Helmet>
      <section className='w-full max-w-[1200px] mx-auto p-8 flex flex-col'>
        <BreadcrumbNav />
        <div className='flex justify-between items-center pb-4 mt-4 border-b border-gray-300'>
          <h1 className='text-2xl font-bold'>My Cart</h1>
          <p className='text-gray-600'>
            {validProducts.length}{' '}
            {validProducts.length === 1 ? 'Item' : 'Items'} Added
          </p>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 p-4 rounded-md ${
              statusMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : statusMessage.type === 'info'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {statusMessage.message}
          </div>
        )}

        {!hasProducts && <p>No products in your cart</p>}
        {hasProducts && (
          <>
            <div>
              <ul className='p-4 px-8 mb-8 border-b border-gray-300'>
                {validProducts.map((product) => (
                  <CartItem
                    key={product.id || product.Id}
                    product={product}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </ul>

              <div className='flex justify-between items-center px-2 mb-6 md:px-8'>
                <p>Total Price</p>
                <p className='text-xl font-bold text-pink-600 md:text-2xl'>
                  $ {totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              icon={FaShoppingCart}
              text='Place your order'
              className='px-8 py-3'
              onClick={() => setOrderModal({show: true})}
            />
            {orderModal.show && 
              <div className='flex fixed inset-0 z-50 justify-center items-center bg-gray-600 bg-opacity-50'>
                    <div className='p-6 mx-auto max-w-sm bg-white rounded-lg'>
                    <h3 className='mb-4 text-lg font-medium text-gray-900'>
                        Order Placed!
                    </h3>
                    <p className='mb-4 text-sm text-gray-500'>
                        Thank you for shopping with Britannicus!
                    </p>
                    <div className='flex gap-3 justify-end'>
                        <Button text='cancel' onClick={() => setOrderModal({show: false})}/>
                        <Button 
                          text={isProcessing ? 'Processing...' : 'Place Order'} 
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                        />
                    </div>
                    </div>
                </div>
            }
          </>
        )}
      </section>
    </>
  );
}
