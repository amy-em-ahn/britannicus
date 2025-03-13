import React from 'react';
import { Link } from 'react-router-dom';
import { initialBookState } from '../config/productState';
import Rating from '../components/ui/Rating';
import Button from '../components/ui/Button';
import { FaRegHeart } from 'react-icons/fa';

export default function ProductCard({
  product: {
    id,
    image,
    category,
    options,
    title,
    price,
    currency,
    stock,
    publishedby,
    year,
    seller,
    location,
    description,
    views
  } = initialBookState
}) {
  const truncatedTitle = title.length > 18 ? `${title.slice(0, 18)}..` : title;
  const formatPrice = (value) => {
    if (!value && value !== 0) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <li className='overflow-hidden p-3 flex flex-col'>
      <Link to={`/products/${id}`}>
        <div className='w-full'>
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
          <div className='flex flex-col'>
            <div className='flex'>
              <p className='bg-gray-200 text-gray-700 text-xs font-semibold rounded-md px-2 py-1 inline-block w-auto'>
                {options}
              </p>
            </div>
            <h3 className='font-bold text-md mt-1 line-clamp-2 min-h-[2.5rem]'>
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
            <Button
              text='Add cart'
              icon='FaShoppingCart'
              className='w-full bg-gray-700 text-white mt-2'
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
