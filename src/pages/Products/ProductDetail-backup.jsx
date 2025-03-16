import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getProductById } from '../../api/firebase';
import { useParams } from 'react-router-dom';
import { initialBookState } from '../../config/productState';
import ProductImageCarousel from '../../components/ui/ProductImageCarousel';
import BreadcrumbNav from '../../components/Navbar/BreadcrumbNav';
import ProductOrderInfo from '../../components/ProductOrderInfo';
import Rating from '../../components/ui/Rating';
import SellerOption from '../../components/ui/SellerOption';
import { FaAddressBook } from 'react-icons/fa';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);

        if (productData && productData.image) {
          productData.images = [productData.image];
        }

        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading)
    return <p className='text-center p-8'>Loading product details...</p>;
  if (error) return <p className='text-center text-red-500 p-8'>{error}</p>;
  if (!product) return <p className='text-center p-8'>Product not found</p>;

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
    format,
    language,
    condition,
    currency,
    price,
    stock,
    seller,
    location,
    description
  } = { ...initialBookState, ...product };

  let categoryTitle = 'All Products';
  if (category === 'rare-books') categoryTitle = 'Rare Books';
  else if (category === 'maps') categoryTitle = 'Vintage Maps';
  else if (category === 'periodicals') categoryTitle = 'Periodicals';
  else if (category === 'first-editions') categoryTitle = 'First Editions';

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
                <Rating rating={4} />{' '}
              </div>
            </div>

            <div className='border-t border-b py-4 my-4'>
              <div className='grid grid-cols-2 gap-4'>
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
                {format && (
                  <div>
                    <p className='text-sm text-gray-500'>Format</p>
                    <p>{format}</p>
                  </div>
                )}
                {language && (
                  <div>
                    <p className='text-sm text-gray-500'>Language</p>
                    <p>{language}</p>
                  </div>
                )}
                {genre && (
                  <div>
                    <p className='text-sm text-gray-500'>Genre</p>
                    <p>{genre}</p>
                  </div>
                )}
              </div>

              {(seller || location) && (
                <div className='mt-4 pt-4 border-t border-gray-100'>
                  <div className='text-sm text-gray-500 flex items-center'>
                    <FaAddressBook className='mr-1' />
                    {seller && <p className='mr-2'>{seller}</p>}
                    {location && <p className='text-gray-600'>{location}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='md:col-span-3'>
            <ProductOrderInfo
              currency={currency}
              price={price.toLocaleString()}
              stock={stock.toLocaleString()}
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
