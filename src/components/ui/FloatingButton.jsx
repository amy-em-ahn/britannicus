import React from 'react';
import { Link } from 'react-router-dom';

export default function FloatingButton({
  text,
  path,
  disabled,
  icon: Icon,
  className
}) {
  return (
    <Link
      to={path}
    >
    <button
      className={`absolute flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-5 
                  rounded transition-all hover:brightness-125 active:translate-y-0.5 
                  active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed 
                  ${className}`}
      // onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className='text-lg' />}
      {text}
    </button>
    </Link>
  );
}
