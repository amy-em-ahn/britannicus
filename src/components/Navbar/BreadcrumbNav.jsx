import React from 'react';
import { Link } from 'react-router-dom';

export default function BreadcrumbNav({ category, title }) {
  let categoryName = '';
  let categoryPath = '';

  if (category === 'rare-books') {
    categoryName = 'Rare Books';
    categoryPath = 'rare-books';
  } else if (category === 'maps') {
    categoryName = 'Vintage Maps';
    categoryPath = 'maps';
  } else if (category === 'periodicals') {
    categoryName = 'Periodicals';
    categoryPath = 'periodicals';
  } else if (category === 'first-editions') {
    categoryName = 'First Editions';
    categoryPath = 'first-editions';
  }

  return (
    <nav className='text-sm text-gray-500 mb-4'>
      <Link to='/' className='hover:text-blue-600'>
        Home
      </Link>
      <span className='mx-2'>&gt;</span>
      <Link to={`/products/${categoryPath}`} className='hover:text-blue-600'>
        {categoryName}
      </Link>
      {title && (
        <>
          <span className='mx-2'>&gt;</span>
          <span className='text-gray-700'>{title}</span>
        </>
      )}
    </nav>
  );
}
