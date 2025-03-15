import React from 'react';

export default function GenreTag({ label, onClick, isActive = false }) {
  return (
    <button
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${
          isActive
            ? 'bg-slate-900 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
