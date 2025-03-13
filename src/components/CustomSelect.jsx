import React, { useState } from 'react';
import Button from '../components/ui/Button';
import OutlineButton from '../components/ui/OutlineButton';

const CustomSelect = ({
  name,
  value,
  onChange,
  required,
  disabled,
  children,
  allowCustomOption = false
}) => {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [customOptions, setCustomOptions] = useState([]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCustomOptions([...customOptions, newOption.trim()]);
      // Automatically select the new option
      const event = {
        target: {
          name,
          value: newOption.trim()
        }
      };
      onChange(event);
      setNewOption('');
      setIsAddingOption(false);
    }
  };

  const selectStyles = `block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white ${
    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  }`;

  return (
    <div>
      {!isAddingOption ? (
        <div className='relative'>
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={selectStyles}
          >
            {children}
            {customOptions.map((option, index) => (
              <option key={`custom-${index}`} value={option}>
                {option}
              </option>
            ))}
            {allowCustomOption && (
              <option value='__add_custom__' disabled>
                --- Add New Option ---
              </option>
            )}
          </select>
          <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-500'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          {allowCustomOption && (
            <div className='absolute inset-y-0 right-10 flex items-center'>
              <button
                type='button'
                onClick={() => setIsAddingOption(true)}
                className='flex items-center text-blue-500 hover:text-blue-700'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-xs' style={{ fontSize: '11px' }}>
                  Add option
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='flex items-center'>
          <input
            type='text'
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder='Enter new option'
            className='block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-l-md'
            autoFocus
          />
          <div className='flex'>
            <Button
              icon='FaCheck'
              className='py-1 px-2 rounded-none'
              onClick={handleAddOption}
            />
            <OutlineButton
              icon='FaTimes'
              className='rounded-l-none py-1 px-2'
              onClick={() => setIsAddingOption(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
