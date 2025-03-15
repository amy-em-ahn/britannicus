import React from 'react';
import { initialBookState } from '../config/productState';
import { useNavigate } from 'react-router-dom';
import SellerOption from './ui/SellerOption';
import AddToCartButton from './AddToCartButton';
import ProductImage from './ProductImage';

export default function ProductCard({
  product = initialBookState,
  onStatusChange
}) {
  const { id, image, options, title, price } = product;

  const truncatedTitle = title.length > 18 ? `${title.slice(0, 18)}..` : title;
  const formatPrice = (value) => {
    if (!value && value !== 0) return '0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const navigate = useNavigate();

  const handleProductClick = () => {
    console.log(`Navigating to: /products/${id}`);
    navigate(`/products/${id}`, { state: { product } });
  };

  return (
    <li className='overflow-hidden p-3 flex flex-col'>
      <div className='w-full' onClick={handleProductClick}>
        <div className='aspect-[3/4] w-full overflow-hidden rounded-md'>
          <ProductImage
            image={image}
            title={title}
            size='small'
            className='mx-auto'
          />
        </div>
      </div>
      <div className='px-2 text-md flex flex-col flex-grow justify-between'>
        <div className='flex flex-col' onClick={handleProductClick}>
          <SellerOption options={options} />
          <h3 className='font-bold text-md mt-1 line-clamp-2'>
            {truncatedTitle}
          </h3>
          <p className='text-sm mt-1'>
            Price: <span className='text-black'>${formatPrice(price)}</span>
          </p>
        </div>
        <div className='mt-3 flex flex-col'>
          <AddToCartButton
            productId={id}
            productData={product}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </li>
  );
}
