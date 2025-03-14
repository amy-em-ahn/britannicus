import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Category mapping
const CATEGORY_MAP = {
  'rare-books': 'Rare Books',
  maps: 'Vintage Maps',
  periodicals: 'Periodicals',
  'first-editions': 'First Editions',
  cart: 'My Cart',
  profile: 'My Profile',
  orders: 'My Orders',
  wishlist: 'My Wishlist'
};

export default function BreadcrumbNav({
  category: propCategory,
  title: propTitle
}) {
  const location = useLocation();

  // Extract path segments from current URL
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Use props if provided, otherwise extract from URL
  const category =
    propCategory ||
    (pathSegments[0] === 'products' && pathSegments[1]
      ? pathSegments[1]
      : pathSegments[0]);

  // Title must be provided via props
  const title = propTitle;

  // Get category display name and path
  const categoryName = CATEGORY_MAP[category] || 'Products';
  const categoryPath = category || '';

  // Build category URL based on type
  const categoryUrl =
    categoryPath === 'cart' ||
    categoryPath === 'profile' ||
    categoryPath === 'orders' ||
    categoryPath === 'wishlist'
      ? `/${categoryPath}`
      : `/products/${categoryPath}`;

  return (
    <nav className='text-sm text-gray-500 mb-4'>
      <Link to='/' className='hover:text-blue-600'>
        Home
      </Link>
      <span className='mx-2'>&gt;</span>
      <Link to={categoryUrl} className='hover:text-blue-600'>
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
