import React from 'react';

export default function SellerOption({ options }) {
  return (
    <div className='flex'>
      <p className='bg-gray-200 text-gray-700 text-xs font-semibold rounded-md px-2 py-1 mx-1 inline-block w-auto'>
        {options || 'No options available'}
      </p>
    </div>
  );
}
