import React from 'react';
import { useNavigate } from 'react-router-dom';
import SellerOption from './ui/SellerOption';
import ProductImage from './ProductImage';
import ProductOrderInfo from './ProductOrderInfo';

export default function ProductListItem({ product, onStatusChange }) {
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
    stock = 0
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
      <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
        {/* Left: Product Image */}
        <div
          className='w-full md:w-1/5 cursor-pointer'
          onClick={handleProductClick}
        >
          <ProductImage
            image={image}
            title={title}
            size='medium'
            className='mx-auto md:mx-0'
          />
        </div>

        {/* Middle: Product Details */}
        <div className='w-full md:w-3/5 mt-4 md:mt-0'>
          <h2
            className='text-xl font-bold mb-2 cursor-pointer hover:text-blue-600'
            onClick={handleProductClick}
          >
            {title}
          </h2>

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

        {/* Right: ProductOrderInfo */}
        <div className='w-full md:w-1/4 md:flex md:justify-end'>
          <div className='w-full md:max-w-[240px]'>
            <ProductOrderInfo
              price={price.toLocaleString()}
              stock={stock.toLocaleString()}
              productId={id}
              productData={product}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
