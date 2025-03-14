import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';
import OutlineButton from '../components/ui/OutlineButton';
import CustomSelect from './Select/CustomSelect';
import ModifiableSelect from './Select/ModifiableSelect';
import { uploadImage } from '../api/uploader';
import { addNewProduct } from '../api/firebase';
import { initialBookState } from '../config/productState';
import CommonProductFields from './CommonProductFields';

const BookUploadForm = () => {
  const [product, setProduct] = useState(initialBookState);
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

    const uploadPromises = images.map((image) => uploadImage(image.file));

    Promise.all(uploadPromises)
      .then((urls) => {
        console.log('All images uploaded successfully:', urls);
        const productWithUnit = {
          ...product,
          stockUnit: 'PCS'
        };
        return addNewProduct(productWithUnit, urls);
      })
      .then(() => {
        setSuccess('Book successfully added!');

        setTimeout(() => {
          setProduct(initialBookState);
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

  const categoryOptions = (
    <>
      <option value='' disabled>
        Select Product Category
      </option>
      <option value='rare-books'>Rare Books</option>
      <option value='periodicals'>Periodicals</option>
      <option value='first-editions'>First Editions</option>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Add New Book | Britannicus BMS</title>
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
                allowCustomOption={false}
              />

              {/* Book-specific Fields */}
              <div className='sm:col-span-1'>
                <ModifiableSelect
                  name='genre'
                  value={product.genre}
                  onChange={handleChange}
                  required
                  allowCustomOption={true}
                >
                  <option value='' disabled>
                    Genre
                  </option>
                  <option value='Fiction'>Fiction</option>
                  <option value='Non-Fiction'>Non-Fiction</option>
                  <option value='History'>History</option>
                  <option value='Science'>Science</option>
                  <option value='Literature'>Literature</option>
                  <option value='Philosophy'>Philosophy</option>
                  <option value='Biography'>Biography</option>
                  <option value='Art'>Art</option>
                  <option value='Travel'>Travel</option>
                  <option value='Other'>Other</option>
                </ModifiableSelect>
              </div>

              <div className='sm:col-span-1'>
                <CustomSelect
                  name='format'
                  value={product.format}
                  onChange={handleChange}
                  required
                  allowCustomOption={true}
                >
                  <option value='' disabled>
                    Format
                  </option>
                  <option value='Hardcover'>Hardcover</option>
                  <option value='Paperback'>Paperback</option>
                  <option value='Leather Bound'>Leather Bound</option>
                  <option value='Special Edition'>Special Edition</option>
                  <option value='Illustrated'>Illustrated</option>
                  <option value='Folio'>Folio</option>
                  <option value='Manuscript'>Manuscript</option>
                </CustomSelect>
              </div>

              <div className='sm:col-span-1'>
                <CustomSelect
                  name='language'
                  value={product.language}
                  onChange={handleChange}
                  required
                  allowCustomOption={true}
                >
                  <option value='' disabled>
                    Language
                  </option>
                  <option value='English'>English</option>
                  <option value='French'>French</option>
                  <option value='German'>German</option>
                  <option value='Italian'>Italian</option>
                  <option value='Spanish'>Spanish</option>
                  <option value='Latin'>Latin</option>
                  <option value='Greek'>Greek</option>
                  <option value='Other'>Other</option>
                </CustomSelect>
              </div>

              <div className='sm:col-span-1'>
                <input
                  type='text'
                  name='publishedby'
                  id='publishedby'
                  value={product.publishedby}
                  onChange={handleChange}
                  placeholder='Published by (Optional)'
                  className={inputStyles}
                />
              </div>

              {/* Description at the bottom */}
              <div className='sm:col-span-2'>
                <textarea
                  name='description'
                  id='description'
                  value={product.description}
                  onChange={handleChange}
                  rows='4'
                  placeholder='Book description'
                  required
                  className={inputStyles}
                />
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-center gap-3'>
                <OutlineButton
                  type='button'
                  text='Cancel'
                  disabled={isUploading}
                />
                <Button
                  text={isUploading ? 'Uploading...' : 'Add Book'}
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

export default BookUploadForm;
