import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ImageUploader from './ImageUploader';
import CustomSelect from './CustomSelect';
import Button from './ui/Button';
import { uploadImage } from '../api/uploader';
import { addNewProduct } from '../api/firebase';

const ProductForm = () => {
  const initialProductState = {
    category: '',
    title: '',
    price: '',
    currency: 'USD',
    stock: '',
    publishedby: '',
    year: '',
    seller: '',
    location: '',
    description: '',
    options: ''
  };

  const [product, setProduct] = useState(initialProductState);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting with images:', images);
    setIsUploading(true);

    if (images.length === 0) {
      alert('Please upload an image');
      setIsUploading(false);
      return;
    }

    const imageFile = images[0].file;

    // Add product to Cloudinary
    uploadImage(imageFile)
      .then((url) => {
        console.log('Image uploaded to Cloudinary:', url);
        // Add product to firebase with img url
        const productWithUnit = {
          ...product,
          stockUnit: 'PCS' // Always set to PCS
        };
        return addNewProduct(productWithUnit, url);
      })
      .then(() => {
        console.log('Product added to Firebase');
        setSuccess('Product successfully added!');

        setTimeout(() => {
          // Reset form
          setProduct(initialProductState);
          setImages([]);
        }, 500);

        setTimeout(() => {
          setSuccess('');
        }, 4000);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Error: ${error.message || 'Unknown error occurred'}`);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // Common input styles for all text inputs
  const inputStyles =
    'block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  return (
    <>
      <Helmet>
        <title>Add New Product | Britannicus BMS</title>
      </Helmet>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          {success && (
            <div className='m-4 p-4 text-sm text-green-700 bg-green-100 rounded-md'>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className='px-4 py-5 sm:p-6 space-y-6'>
            <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
              {/* Image uploader */}
              <div className='sm:col-span-2'>
                <ImageUploader images={images} setImages={setImages} />
              </div>

              {/* Category */}
              <div className='sm:col-span-1'>
                <CustomSelect
                  name='category'
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  <option value='' disabled>
                    Select Product Category
                  </option>
                  <option value='Rare Books'>Rare Books</option>
                  <option value='Vintage maps'>Vintage Maps</option>
                  <option value='Periodicals'>Periodicals</option>
                  <option value='First Editions'>First Editions</option>
                </CustomSelect>
              </div>

              {/* Product Options */}
              <div className='sm:col-span-1'>
                <CustomSelect
                  name='options'
                  value={product.options}
                  onChange={handleChange}
                  required
                >
                  <option value='' disabled>
                    Select Product Options
                  </option>
                  <option value='Individual'>Individual</option>
                  <option value='Auction'>Auction</option>
                  <option value='Real estate'>Real Estate</option>
                  <option value='Library'>Library</option>
                </CustomSelect>
              </div>

              {/* Title */}
              <div className='sm:col-span-2'>
                <input
                  type='text'
                  name='title'
                  id='title'
                  value={product.title}
                  onChange={handleChange}
                  placeholder='Product Title'
                  required
                  className={inputStyles}
                />
              </div>

              {/* Price with Currency */}
              <div className='flex items-center'>
                <div className='relative flex-1'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <span className='text-gray-500 sm:text-sm'>$</span>
                  </div>
                  <input
                    type='text'
                    name='price'
                    id='price'
                    value={product.price}
                    onChange={handleChange}
                    placeholder='Price'
                    required
                    className='block w-full border border-gray-300 rounded-l-md pl-7 pr-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    style={{ borderRight: 'none' }}
                  />
                </div>
                <div className='relative'>
                  <select
                    name='currency'
                    value={product.currency}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-r-md bg-white px-3 pr-10 appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    style={{
                      borderLeft: 'none',
                      height: '38px'
                    }}
                  >
                    <option value='USD'>USD</option>
                    <option value='EUR'>EUR</option>
                  </select>
                  {/* arrow */}
                  <div className='absolute inset-y-0 right-4 flex items-center pointer-events-none'>
                    <svg
                      className='w-4 h-4 text-gray-500'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className='sm:col-span-1'>
                <div className='relative'>
                  <input
                    type='number'
                    name='stock'
                    id='stock'
                    value={product.stock}
                    onChange={handleChange}
                    placeholder='Stock (PCS)'
                    className={inputStyles}
                  />
                </div>
              </div>

              {/* Published By */}
              <div className='sm:col-span-1'>
                <input
                  type='text'
                  name='publishedby'
                  id='publishedby'
                  value={product.publishedby}
                  onChange={handleChange}
                  placeholder='Published by (optional)'
                  className={inputStyles}
                />
              </div>

              {/* Year */}
              <div className='sm:col-span-1'>
                <input
                  type='text'
                  name='year'
                  id='year'
                  value={product.year}
                  onChange={handleChange}
                  placeholder='Year (optional)'
                  className={inputStyles}
                />
              </div>

              {/* Seller */}
              <div className='sm:col-span-1'>
                <input
                  type='text'
                  name='seller'
                  id='seller'
                  value={product.seller}
                  onChange={handleChange}
                  placeholder='Seller (optional)'
                  className={inputStyles}
                />
              </div>

              {/* Location */}
              <div className='sm:col-span-1'>
                <input
                  type='text'
                  name='location'
                  id='location'
                  value={product.location}
                  onChange={handleChange}
                  placeholder='Seller Location (optional)'
                  className={inputStyles}
                />
              </div>

              {/* Description */}
              <div className='sm:col-span-2'>
                <textarea
                  name='description'
                  id='description'
                  value={product.description}
                  onChange={handleChange}
                  rows='4'
                  placeholder='Product description'
                  required
                  className={inputStyles}
                />
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-center gap-3'>
                <Button type='button' text='Cancel' disabled={isUploading} />
                <Button
                  text={isUploading ? 'Uploading...' : 'Add Product'}
                  disabled={isUploading}
                  type='submit'
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
