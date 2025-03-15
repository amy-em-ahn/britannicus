import React from 'react';
import ImageUploader from './ImageUploader';
import CustomSelect from './Select/CustomSelect';

const CommonProductFields = ({
  product,
  setProduct,
  images,
  setImages,
  inputStyles,
  handleChange,
  categoryOptions,
  isCategoryDisabled = false,
  allowCustomOption = true
}) => {
  return (
    <>
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
          disabled={isCategoryDisabled}
          allowCustomOption={!isCategoryDisabled && allowCustomOption}
        >
          {categoryOptions}
        </CustomSelect>
      </div>

      <div className='sm:col-span-1'>
        <CustomSelect
          name='options'
          value={product.options}
          onChange={handleChange}
          required
          allowCustomOption={allowCustomOption}
        >
          <option value='' disabled>
            Seller type
          </option>
          <option value='Individual'>Individual</option>
          <option value='Auction'>Auction</option>
          <option value='Real estate'>Real Estate</option>
          <option value='Library'>Library</option>
        </CustomSelect>
      </div>

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
            <option value='CAN'>CAN</option>
            {allowCustomOption && <option value='EUR'>EUR</option>}
            {allowCustomOption && <option value='GBP'>GBP</option>}
          </select>
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

      <div className='sm:col-span-1'>
        <div className='relative'>
          <input
            type='number'
            name='stock'
            id='stock'
            value={product.stock}
            onChange={handleChange}
            placeholder='Stock (PCS)'
            required
            className={inputStyles}
          />
        </div>
      </div>

      <div className='sm:col-span-1'>
        <CustomSelect
          name='condition'
          value={product.condition}
          onChange={handleChange}
          required={product.category !== 'maps'}
          allowCustomOption={false}
        >
          <option value='' disabled>
            Condition (Optional)
          </option>
          <>
            <option value='Mint'>Mint</option>
            <option value='Excellent'>Excellent</option>
            <option value='Good'>Good</option>
            <option value='Fair'>Fair</option>
            <option value='Poor'>Poor</option>
          </>
        </CustomSelect>
      </div>

      <div className='sm:col-span-1'>
        <input
          type='text'
          name='year'
          id='year'
          value={product.year}
          onChange={handleChange}
          placeholder='Year (Optional)'
          className={inputStyles}
        />
      </div>

      <div className='sm:col-span-1'>
        <input
          type='text'
          name='seller'
          id='seller'
          value={product.seller}
          onChange={handleChange}
          placeholder='Seller (Optional)'
          className={inputStyles}
        />
      </div>

      <div className='sm:col-span-1'>
        <input
          type='text'
          name='location'
          id='location'
          value={product.location}
          onChange={handleChange}
          placeholder='Seller Location (Optional)'
          className={inputStyles}
        />
      </div>
    </>
  );
};

export default CommonProductFields;
