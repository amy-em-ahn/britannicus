import React from 'react';
import { initialProductState } from '../config/productState';
import Rating from '../components/ui/Rating';
import Button from '../components/ui/Button';
import { FaRegHeart } from 'react-icons/fa';

export default function ProductCard({
  product: {
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
  } = initialProductState
}) {
  const truncatedTitle = title.length > 15 ? `${title.slice(0, 15)}...` : title;

  return (
    <li className='overflow-hidden p-3'>
      <img
        src={image}
        className='w-[125px] h-[170px] object-cover rounded-md cursor-pointer'
        alt={title}
      />

      <div className='mt-3 px-2 text-md'>
        <p className='bg-gray-200 text-gray-700 text-xs font-semibold rounded-md px-2 py-1 inline-block'>
          {options}
        </p>

        <h3 className='font-bold text-lg mt-1'>{truncatedTitle}</h3>

        <p className='text-md font-bold mt-1'>
          Price:{' '}
          <span className='text-black'>
            {currency} {price}
          </span>
        </p>

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
    </li>
  );
}
