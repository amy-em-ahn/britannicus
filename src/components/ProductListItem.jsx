import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerOption from './ui/SellerOption';
import ProductImage from './ProductImage';
import ProductOrderInfo from './ProductOrderInfo';

export default function ProductListItem({ product }) {
  const navigate = useNavigate();

  const {
    id,
    image,
    title,
    author,
    publisher,
    year,
    condition,
    category,
    options,
    price,
    genre,
    stock
  } = product || {};

  const handleProductClick = () => {
    navigate(`/products/${id}`, { state: { product } });
  };

  const getCategoryLabel = (categoryId) => {
    const categories = {
      'rare-books': 'Rare Books',
      maps: 'Vintage Maps',
      periodicals: 'Periodicals',
      'first-editions': 'First Editions'
    };
    return categories[categoryId] || 'General';
  };

  return (
    <li className='py-6 w-full'>
      <div className='flex gap-6 justify-between'>
        {/* Left: Product Image */}
        <div className='w-1/5 cursor-pointer' onClick={handleProductClick}>
          <ProductImage image={image} title={title} size='small' />
        </div>

        {/* Middle: Product Details */}
        <div className='w-3/5'>
          <h2
            className='text-xl font-bold mb-2 cursor-pointer hover:text-blue-600'
            onClick={handleProductClick}
          >
            {title}
          </h2>

          {/* Author, Publisher, Year - Skip for maps */}
          {category !== 'maps' && (
            <div className='mb-3 text-gray-700'>
              {author && <p>By {author}</p>}
              {publisher && <p>Published by {publisher}</p>}
              {year && <p>Year: {year}</p>}
            </div>
          )}

          {/* Product Details */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {genre && <SellerOption options={genre} />}
            {condition && <SellerOption options={`Condition: ${condition}`} />}
            <SellerOption options={getCategoryLabel(category)} />
            {options && <SellerOption options={options} />}
          </div>
        </div>

        {/* Right: ProductOrderInfo for cart functionality */}
        <div className='w-1/4'>
          <ProductOrderInfo
            price={price}
            stock={stock}
            productId={id}
            productData={product}
          />
        </div>
      </div>
    </li>
  );
}
