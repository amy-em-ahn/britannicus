import React from 'react';

export default function Button({ text, onClick }) {
  return (
    <button
      className='bg-slate-900 text-white py-2 px-3 rounded-sm brightness-125'
      onClick={onClick}
    >
      {text}
    </button>
  );
}
