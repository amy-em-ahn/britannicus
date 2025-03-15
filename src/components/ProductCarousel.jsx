import React, { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const ProductCarousel = ({ products, category, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const scrollTo = (index) => {
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    setCurrentIndex(index);

    if (carouselRef.current) {
      const itemWidth =
        carouselRef.current.querySelector('.carousel-item').offsetWidth;
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => scrollTo(currentIndex - 1);
  const handleNext = () => scrollTo(currentIndex + 1);

  return (
    <div className='mb-12'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <Link to={`/${category}`} className='text-blue-600 hover:underline'>
          View All
        </Link>
      </div>

      <div className='relative'>
        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <button
            className='absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md'
            onClick={handlePrev}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            className='absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md'
            onClick={handleNext}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        )}

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className='flex overflow-x-auto pb-4 hide-scrollbar scroll-smooth'
        >
          {products.map((product) => (
            <div key={product.id} className='carousel-item min-w-[250px] px-2'>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Optional: Pagination dots */}
        {products.length > itemsPerView && (
          <div className='flex justify-center mt-4'>
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
