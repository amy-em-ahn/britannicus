import React from 'react';

export default function User({ user: { photoURL, displayName } }) {
  return (
    <div className='flex items-center'>
      {photoURL && (
        <img
          className='w-10 h-10 rounded-full mr-2 shrink-0'
          src={photoURL}
          alt={displayName || 'User'}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <span className='hidden md:block'>{displayName || 'User'}</span>
    </div>
  );
}
