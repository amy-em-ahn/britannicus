import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductImage from '../ProductImage';

export default function ProductImageCarousel({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageArray = Array.isArray(images) ? images : [images];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!imageArray || imageArray.length === 0 || !imageArray[0]) {
    return (
      <div className='w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md'>
        <p className='text-gray-500'>No image available</p>
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      <div className='relative overflow-hidden rounded-md'>
        <ProductImage
          image={imageArray[currentIndex]}
          title={title || 'Product Image'}
          size='medium'
        />

        {imageArray.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-r-md hover:bg-black/50'
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-l-md hover:bg-black/50'
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {/* thumbnail */}
      {imageArray.length > 1 && (
        <div className='flex mt-4 space-x-2 overflow-x-auto'>
          {imageArray.map((img, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-16 h-16 flex-shrink-0 cursor-pointer border-2 rounded-md overflow-hidden
                ${
                  currentIndex === index
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
            >
              <ProductImage
                image={img}
                title={`Thumbnail ${index + 1}`}
                size='xsmall'
                className='w-full h-full'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
