import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <li className='border border-gray-300 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
      <Link to={`/products/${product.id}`}>
        <div className='h-48 overflow-hidden'>
          <img
            src={product.image}
            alt={product.title || 'Product image'}
            className='w-full h-full object-cover transition-transform hover:scale-105'
            crossOrigin='anonymous'
          />
        </div>
        <div className='p-4'>
          <h3 className='font-bold text-lg mb-1 line-clamp-1'>
            {product.title}
          </h3>
          <p className='text-gray-600 text-sm mb-2 line-clamp-2'>
            {product.description}
          </p>
          <div className='flex justify-between items-center'>
            <span className='font-bold text-blue-600'>£{product.price}</span>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
              {product.category}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
