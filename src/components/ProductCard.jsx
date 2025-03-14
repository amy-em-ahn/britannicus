import React from 'react';
import { initialBookState } from '../config/productState';
import Rating from './ui/Rating';
import { FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SellerOption from './ui/SellerOption';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product = initialBookState }) {
  const { id, image, options, title, price, views } = product;

  const truncatedTitle = title.length > 18 ? `${title.slice(0, 18)}..` : title;
  const formatPrice = (value) => {
    if (!value && value !== 0) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const navigate = useNavigate();

  const handleProductClick = () => {
    console.log(`Navigating to: /products/${id}`);
    navigate(`/products/${id}`, { state: { product } });
  };

  return (
    <li className='overflow-hidden p-3 flex flex-col'>
      <div className='w-full' onClick={handleProductClick}>
        <div className='aspect-[3/4] w-full overflow-hidden rounded-md'>
          <img
            src={image}
            className='w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer'
            alt={title}
            crossOrigin='anonymous'
          />
        </div>
      </div>
      <div className='mt-3 px-2 text-md flex flex-col flex-grow justify-between'>
        <div className='flex flex-col' onClick={handleProductClick}>
          <SellerOption options={options} />
          <h3 className='font-bold text-md mt-1 line-clamp-2 min-h-[2.5rem] cursor-pointer'>
            {truncatedTitle}
          </h3>
          <p className='text-sm mt-1 min-h-[1.5rem]'>
            Price: <span className='text-black'>${formatPrice(price)}</span>
          </p>
        </div>
        <div className='mt-auto flex flex-col'>
          <div className='flex items-center justify-between mt-2'>
            <Rating rating={5} />
            <div className='flex items-center gap-1 text-gray-500 text-sm'>
              <FaRegHeart className='text-xl cursor-pointer' />
              {views}
            </div>
          </div>
          <AddToCartButton productId={id} productData={product} />
        </div>
      </div>
    </li>
  );
}
