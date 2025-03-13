import React from 'react';

export default function OutlineButton({
  text,
  onClick,
  disabled,
  icon,
  className
}) {
  const IconComponent = icon ? require('react-icons/fa')[icon] : null;

  return (
    <button
      className={`flex items-center justify-center gap-2 bg-white text-slate-900 
                  border border-slate-300 py-2 px-5 
                  rounded transition-all hover:bg-slate-100 active:translate-y-0.5 
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
