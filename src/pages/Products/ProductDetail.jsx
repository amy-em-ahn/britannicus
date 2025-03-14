import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';
import ProductImageCarousel from '../../components/ui/ProductImageCarousel';
import BreadcrumbNav from '../../components/Navbar/BreadcrumbNav';
import ProductOrderInfo from '../../components/ProductOrderInfo';
import Rating from '../../components/ui/Rating';
import SellerOption from '../../components/ui/SellerOption';
import { FaAddressBook } from 'react-icons/fa';
import { getProductById } from '../../api/firebase';

export default function ProductDetail() {
  const location = useLocation();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const productFromState = location.state?.product;

  useEffect(() => {
    if (product) {
      console.log('Product data:', product);
      console.log('Color info:', product.color, typeof product.color);
      console.log('Size info:', product.size, typeof product.size);
      console.log('Colors array:', product.colors);
      console.log('Sizes array:', product.sizes);
    }
  }, [product]);

  useEffect(() => {
    if (productFromState) {
      setProduct(productFromState);

      if (productFromState.colors && productFromState.colors.length > 0) {
        setSelectedColor(productFromState.colors[0]);
      } else if (productFromState.color) {
        setSelectedColor(
          Array.isArray(productFromState.color)
            ? productFromState.color[0]
            : productFromState.color
        );
      }

      if (productFromState.sizes && productFromState.sizes.length > 0) {
        setSelectedSize(productFromState.sizes[0]);
      } else if (productFromState.size) {
        setSelectedSize(
          Array.isArray(productFromState.size)
            ? productFromState.size[0]
            : productFromState.size
        );
      }

      setLoading(false);
      return;
    }

    if (productId) {
      setLoading(true);
      getProductById(productId)
        .then((data) => {
          if (data) {
            setProduct(data);

            if (data.colors && data.colors.length > 0) {
              setSelectedColor(data.colors[0]);
            } else if (data.color) {
              setSelectedColor(
                Array.isArray(data.color) ? data.color[0] : data.color
              );
            }

            if (data.sizes && data.sizes.length > 0) {
              setSelectedSize(data.sizes[0]);
            } else if (data.size) {
              setSelectedSize(
                Array.isArray(data.size) ? data.size[0] : data.size
              );
            }
          } else {
            setError('Product not found');
          }
        })
        .catch((err) => {
          console.error('Error fetching product:', err);
          setError(err.message || 'Failed to load product');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, productFromState]);

  if (loading) {
    return (
      <div className='w-full max-w-[1200px] mx-auto px-4 py-6 text-center'>
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='w-full max-w-[1200px] mx-auto px-4 py-6 text-center text-red-500'>
        Error: {error || 'Product not found'}
      </div>
    );
  }

  const {
    title,
    image,
    images,
    category,
    options,
    author,
    publishedby,
    year,
    genre,
    genres,
    format,
    formats,
    language,
    languages,
    size,
    color,
    colors,
    sizes,
    condition,
    currency,
    price,
    stock,
    seller,
    location: sellerLocation,
    description
  } = product;

  let categoryTitle = 'All Products';
  if (category === 'rare-books') categoryTitle = 'Rare Books';
  else if (category === 'maps') categoryTitle = 'Vintage Maps';
  else if (category === 'periodicals') categoryTitle = 'Periodicals';
  else if (category === 'first-editions') categoryTitle = 'First Editions';

  const handleSelectSize = (e) => setSelectedSize(e.target.value);
  const handleSelectColor = (e) => setSelectedColor(e.target.value);

  // Use arrays if available, otherwise use single values
  const displayGenres = genres || (genre ? [genre] : []);
  const displayFormats = formats || (format ? [format] : []);
  const displayLanguages = languages || (language ? [language] : []);
  const displayColors =
    colors || (color ? (Array.isArray(color) ? color : [color]) : []);
  const displaySizes =
    sizes || (size ? (Array.isArray(size) ? size : [size]) : []);

  return (
    <>
      <Helmet>
        <title>{title || 'Product Detail'} | Britannicus BMS</title>
      </Helmet>

      <section className='w-full max-w-[1200px] mx-auto px-4 py-6'>
        <BreadcrumbNav category={category} title={title} />

        <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
          <div className='md:col-span-4'>
            <ProductImageCarousel images={images || image} />
          </div>

          <div className='md:col-span-5'>
            <div className='mb-6'>
              {category && (
                <p className='text-sm text-blue-600 uppercase'>
                  {categoryTitle}
                </p>
              )}
              {title && <h1 className='text-2xl font-bold mt-1'>{title}</h1>}
              {author && <p className='text-lg mt-1'>by {author}</p>}
              <div className='flex flex-wrap text-sm text-gray-600 mt-2'>
                {publishedby && (
                  <span className='mr-4'>Published by: {publishedby}</span>
                )}
                {year && <span className='mr-4'>Year: {year}</span>}
              </div>
              <div className='mt-3'>
                <Rating rating={4} />
              </div>
            </div>

            <div className='border-t border-b py-4 my-4'>
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex'>
                  {options && (
                    <span>
                      <SellerOption options={options} />
                    </span>
                  )}
                  {condition && (
                    <span>
                      <SellerOption options={condition} />
                    </span>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {/* Format */}
                  {displayFormats.length > 0 && (
                    <div>
                      <p className='text-sm text-gray-500'>Format</p>
                      <p className='text-md'>{displayFormats[0]}</p>
                    </div>
                  )}

                  {/* Language */}
                  {displayLanguages.length > 0 && (
                    <div>
                      <p className='text-sm text-gray-500'>Language</p>
                      <p className='text-md'>{displayLanguages[0]}</p>
                    </div>
                  )}
                </div>

                {/* Genre */}
                {displayGenres.length > 0 && (
                  <div>
                    <p className='text-sm text-gray-500'>Genre</p>
                    <p className='text-md'>{displayGenres[0]}</p>
                  </div>
                )}

                {/* Color options */}
                {displayColors.length > 0 && (
                  <div>
                    <div className='flex items-center'>
                      <p className='text-sm text-gray-500 mr-2 w-16'>Color</p>
                      <select
                        onChange={handleSelectColor}
                        value={selectedColor || ''}
                        className='border border-gray-300 rounded-md px-2 py-1 text-md flex-grow'
                      >
                        {displayColors.map((colorOption, index) => (
                          <option key={index} value={colorOption}>
                            {colorOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Size options */}
                {displaySizes.length > 0 && (
                  <div>
                    <div className='flex items-center'>
                      <p className='text-sm text-gray-500 mr-2 w-16'>Size</p>
                      <select
                        onChange={handleSelectSize}
                        value={selectedSize || ''}
                        className='border border-gray-300 rounded-md px-2 py-1 text-md flex-grow'
                      >
                        {displaySizes.map((sizeOption, index) => (
                          <option key={index} value={sizeOption}>
                            {sizeOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {(seller || sellerLocation) && (
                <div className='mt-4 pt-4 border-t border-gray-100'>
                  <div className='text-sm text-gray-500 flex items-center'>
                    <FaAddressBook className='mr-1' />
                    {seller && <p className='mr-2'>{seller}</p>}
                    {sellerLocation && (
                      <p className='text-gray-600'>{sellerLocation}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='md:col-span-3'>
            <ProductOrderInfo
              currency={currency}
              price={price}
              stock={stock}
              productId={productId || product.id}
              productData={{
                ...product,
                selectedColor,
                selectedSize
              }}
            />
          </div>
        </div>

        {description && (
          <div className='mt-12 border-t pt-6'>
            <h2 className='text-xl font-bold mb-4'>Description</h2>
            <p className='whitespace-pre-line'>{description}</p>
          </div>
        )}
      </section>
    </>
  );
}
