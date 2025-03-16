import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductImage from '../ProductImage';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard';

export default function HeroCarousel({ allProducts }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  
  const productArray = Array.isArray(allProducts) ? allProducts : [allProducts]
  console.log("PRKASDAS", allProducts)
  const imageArray = productArray.map(a => a.image);
  const titleArray = productArray.map(a => a.title);
  

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
  const navigate = useNavigate();
  if (!imageArray || imageArray.length === 0 || !imageArray[0]) {
    return (
      <div className='w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md'>
        <p className='text-gray-500'>No image available</p>
      </div>
    );
  }
    // let recentProductsImgs = productArray.map(a => a.image)
    // let recentProductsTitles = productArray.map(a => a.title)
    // let recentProductsIds = productArray.map(a => a.id)
  return (
    
    <div className='relative w-3/4 m-auto border-b-[2px] pb-5 mb-5 border-solid border-b-slate-900' >
      <div className='relative overflow-hidden rounded-md flex justify-center'>
        {/* <ProductImage
          image={imageArray[currentIndex]}
          title={titleArray[currentIndex] || 'Product Image'}
          size='medium'
        /> */}
        <ProductCard 
            key={productArray[currentIndex].id}
            product={productArray[currentIndex]}
        />
        {imageArray.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-md hover:bg-black/50 text-[1.5rem]'
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-md hover:bg-black/50 text-[1.5rem]'
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
      {/* thumbnail */}
      {imageArray.length > 1 && (
        <div className='w-full flex mt-4 space-x-2 overflow-x-auto justify-center'>
          {imageArray.map((img, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={` flex-shrink-0 cursor-pointer border-2 rounded-md overflow-hidden
                ${
                  currentIndex === index
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
            >
              <ProductImage
                image={img}
                title={`Thumbnail ${index + 1}`}
                size='small'
                className='w-full h-full'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
