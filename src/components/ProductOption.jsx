import React from 'react';
import CustomSelect from './Select/CustomSelect';

export default function ProductOptions({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange
}) {
  return (
    <>
      {colors && colors.length > 0 && (
        <div className='mb-4'>
          <span className='text-sm font-medium block mb-2'>Color:</span>
          <CustomSelect
            name='color'
            value={selectedColor || ''}
            onChange={onColorChange}
          >
            <option value='' disabled>
              Select a color
            </option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </CustomSelect>
        </div>
      )}

      {sizes && sizes.length > 0 && (
        <div className='mb-4'>
          <span className='text-sm font-medium block mb-2'>Size:</span>
          <CustomSelect
            name='size'
            value={selectedSize || ''}
            onChange={onSizeChange}
          >
            <option value='' disabled>
              Select a size
            </option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </CustomSelect>
        </div>
      )}
    </>
  );
}
