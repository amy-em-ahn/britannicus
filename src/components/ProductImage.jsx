import React from 'react';

const SIZE_PRESETS = {
  xsmall: {
    containerClass: 'w-full max-w-[70px] aspect-[3/4]',
    imgClass: 'object-cover hover:scale-105'
  },
  small: {
    containerClass: 'w-full max-w-[140px] aspect-[3/4]',
    imgClass: 'object-cover hover:scale-105'
  },
  medium: {
    containerClass: 'w-full max-w-[300px] aspect-[3/4]',
    imgClass: 'object-cover hover:scale-110'
  },
  large: {
    containerClass: 'w-full max-w-[500px] aspect-[3/4]'
  }
};

export default function ProductImage({
  image,
  title,
  size = 'small',
  onClick,
  className = ''
}) {
  // default img size
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.small;

  // Use a placeholder image if no image is provided
  const imageUrl = image || 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <div
      className={`${preset.containerClass} ${className} overflow-hidden rounded-md cursor-pointer`}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={title || 'Product image'}
        className={`w-full h-full ${preset.imgClass} transition-transform duration-300`}
        crossOrigin='anonymous'
      />
    </div>
  );
}
