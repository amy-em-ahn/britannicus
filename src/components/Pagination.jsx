import React from 'react';

export default function Pagination({ products, currentPage, setCurrentPage }) {
  const pageCount = Math.ceil(products?.length / 5);

  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: pageCount }, (_, index) => (
        <button
          key={index + 1}
          className={`px-3 py-1 border rounded ${
            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}