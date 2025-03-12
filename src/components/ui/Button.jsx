import React from 'react';

export default function Button({ text, onClick, disabled, icon, className }) {
  const IconComponent = icon ? require('react-icons/fa')[icon] : null;

  return (
    <button
      className={`flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-3 
                  rounded transition-all hover:brightness-125 active:translate-y-0.5 
                  active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed 
                  ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {IconComponent && <IconComponent className='text-lg' />}
      {text}
    </button>
  );
}
