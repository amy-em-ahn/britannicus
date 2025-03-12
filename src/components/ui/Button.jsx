import React from 'react';

export default function Button({ text, onClick, disabled }) {
  return (
    <button
      className='bg-slate-900 text-white py-2 px-3 
                rounded transition-all 
                hover:brightness-125 
                active:translate-y-0.5 active:shadow-inner 
                disabled:opacity-50 disabled:cursor-not-allowed'
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
