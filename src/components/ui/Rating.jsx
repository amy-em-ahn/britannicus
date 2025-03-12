import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function Rating({ rating = 5 }) {
  return (
    <div className='flex text-yellow-500'>
      {[...Array(rating)].map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
  );
}
