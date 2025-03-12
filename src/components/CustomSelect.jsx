import React from 'react';

const CustomSelect = ({ name, value, onChange, required, children }) => {
  return (
    <div className='mb-2'>
      <div className='relative'>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className='block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm appearance-none'
        >
          {children}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
          <svg
            className='h-4 w-4 fill-current'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
          >
            <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
