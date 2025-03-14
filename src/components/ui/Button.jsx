import React from 'react';

export default function Button({
  text,
  onClick,
  disabled,
  icon: Icon,
  className
}) {
  return (
    <button
      className={`flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-5 
                  rounded transition-all hover:brightness-125 active:translate-y-0.5 
                  active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed 
                  ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className='text-lg' />}
      {text}
    </button>
  );
}
