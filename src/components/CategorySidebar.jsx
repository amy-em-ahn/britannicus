import React from 'react';
import { Link } from 'react-router-dom';

export default function CategorySidebar({ currentCategory, onSelectCategory }) {
  const categories = [
    { id: '', name: 'All Products', path: '/products' },
    { id: 'rare-books', name: 'Rare Books', path: '/products/rare-books' },
    { id: 'maps', name: 'Vintage Maps', path: '/products/maps' },
    { id: 'periodicals', name: 'Periodicals', path: '/products/periodicals' },
    {
      id: 'first-editions',
      name: 'First Editions',
      path: '/products/first-editions'
    }
  ];

  const handleClick = () => {
    if (onSelectCategory) {
      onSelectCategory();
    }
  };

  return (
    <div className='w-full'>
      <h2 className='text-xl font-bold mb-4'>Categories</h2>
      <ul className='space-y-2'>
        {categories.map((category) => (
          <li key={category.id || 'all'}>
            <Link
              to={category.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                currentCategory === category.id
                  ? 'bg-slate-900 text-white'
                  : 'hover:bg-slate-100'
              }`}
              onClick={handleClick}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
