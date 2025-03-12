import React from 'react';

export default function Input({type, placeholder, className}) {
  return (
      <input type={type} placeholder={placeholder} className={`flex items-center justify-center gap-2 py-2 px-3 
        rounded transition-all hover:brightness-125 active:translate-y-0.5 
        active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed 
        ${className}`}/>
  );
}
