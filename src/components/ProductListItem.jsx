import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerOption from './ui/SellerOption';
import ProductImage from './ProductImage';
import ProductOrderInfo from './ProductOrderInfo';
import ProductOptions from './ProductOption';

export default function ProductListItem({ product, onStatusChange }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const {
    id,
    image,
    title,
    author,
    publishedby,
    year,
    condition,
    category,
    options,
    price,
    genre,
    stock = 0,
    colors,
    sizes,
    color,
    size
  } = product || {};
  console.log(product)
  useEffect(() => {
    if (colors && colors.length > 0) {
      setSelectedColor(colors[0]);
    } else if (color) {
      setSelectedColor(Array.isArray(color) ? color[0] : color);
    }

    if (sizes && sizes.length > 0) {
      setSelectedSize(sizes[0]);
    } else if (size) {
      setSelectedSize(Array.isArray(size) ? size[0] : size);
    }
  }, [colors, sizes, color, size]);

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

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const displayColors =
    colors || (color ? (Array.isArray(color) ? color : [color]) : []);
  const displaySizes =
    sizes || (size ? (Array.isArray(size) ? size : [size]) : []);

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
        <div className='w-full md:w-2/5 mt-4 md:mt-0'>
          <h2
            className='text-xl font-bold mb-2 cursor-pointer hover:text-blue-600'
            onClick={handleProductClick}
          >
            {title}
          </h2>

          {category !== 'maps' && (
            <div className='mb-3 text-gray-700'>
              {author && <p>By {author}</p>}
              {/* {!author && <p>Lol no author</p>} */}
              {publishedby && <p>Published by {publishedby}</p>}
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

          {/* Product Options*/}
          <ProductOptions
            colors={displayColors}
            sizes={displaySizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={handleColorChange}
            onSizeChange={handleSizeChange}
          />
        </div>

        {/* Right: ProductOrderInfo */}
        <div className='w-full md:w-2/5 md:flex md:justify-end'>
          <div className='w-full md:max-w-[240px]'>
            <ProductOrderInfo
              price={price}
              stock={stock}
              productId={id}
              productData={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
