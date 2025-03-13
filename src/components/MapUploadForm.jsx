import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import CustomSelect from './CustomSelect';
import { uploadImage } from '../api/uploader';
import { addNewProduct } from '../api/firebase';
import { initialMapState } from '../config/productState';
import CommonProductFields from './CommonProductFields';

const MapUploadForm = () => {
  const [product, setProduct] = useState(initialMapState);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (images.length === 0) {
      alert('Please upload an image');
      setIsUploading(false);
      return;
    }

    const imageFile = images[0].file;

    uploadImage(imageFile)
      .then((url) => {
        const productWithUnit = {
          ...product,
          stockUnit: 'PCS'
        };
        return addNewProduct(productWithUnit, url);
      })
      .then(() => {
        setSuccess('Map successfully added!');

        setTimeout(() => {
          setProduct(initialMapState);
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

  const inputStyles =
    'block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  const categoryOptions = <option value='Vintage maps'>Vintage Maps</option>;

  return (
    <>
      <Helmet>
        <title>Add New Map | Britannicus BMS</title>
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
              {/* Common Fields */}
              <CommonProductFields
                product={product}
                setProduct={setProduct}
                images={images}
                setImages={setImages}
                inputStyles={inputStyles}
                handleChange={handleChange}
                categoryOptions={categoryOptions}
                isCategoryDisabled={true}
              />

              {/* Map-specific Fields */}
              <div className='sm:col-span-1'>
                <CustomSelect
                  name='color'
                  value={product.color}
                  onChange={handleChange}
                >
                  <option value='' disabled>
                    Select Color (Optional)
                  </option>
                  <option value='Full Color'>Full Color</option>
                  <option value='Black & White'>Black & White</option>
                  <option value='Sepia'>Sepia</option>
                  <option value='Hand Colored'>Hand Colored</option>
                  <option value='Lithograph'>Lithograph</option>
                  <option value='Woodcut'>Woodcut</option>
                </CustomSelect>
              </div>

              <div className='sm:col-span-1'>
                <CustomSelect
                  name='size'
                  value={product.size}
                  onChange={handleChange}
                >
                  <option value='' disabled>
                    Select Size (Optional)
                  </option>
                  <option value='Small (Up to 8x10")'>
                    Small (Up to 8x10")
                  </option>
                  <option value='Medium (11x14" to 16x20")'>
                    Medium (11x14" to 16x20")
                  </option>
                  <option value='Large (17x22" to 24x36")'>
                    Large (17x22" to 24x36")
                  </option>
                  <option value='Extra Large (Larger than 24x36")'>
                    Extra Large (Larger than 24x36")
                  </option>
                  <option value='Folding Map'>Folding Map</option>
                  <option value='Atlas Page'>Atlas Page</option>
                </CustomSelect>
              </div>

              {/* Description at the bottom */}
              <div className='sm:col-span-2'>
                <textarea
                  name='description'
                  id='description'
                  value={product.description}
                  onChange={handleChange}
                  rows='4'
                  placeholder='Map description (Optional)'
                  className={inputStyles}
                />
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-center gap-3'>
                <Button type='button' text='Cancel' disabled={isUploading} />
                <Button
                  text={isUploading ? 'Uploading...' : 'Add Map'}
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

export default MapUploadForm;
