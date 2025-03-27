import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategoryInfo } from '../../api/firebase';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductListItem from '../../components/ProductListItem';
import CategorySidebar from '../../components/CategorySidebar';
import GenreTag from '../../components/ui/GenreTag';
import Pagination from '../../components/Pagination';
import SortSelector from '../../components/SortSelector';
import DropdownMenu from '../../components/ui/DropdownMenu/DropdownMenu';
import navbarbg from '../../assets/images/nav-bg.jpg'

export default function Products() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [categoryInfo, setCategoryInfo] = useState({
    title: 'All Products',
    description: 'Browse our complete collection of items from all categories.'
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('none');
  const itemsPerPage = 5;

  let categoryId = '';
  if (currentPath.includes('rare-books')) categoryId = 'rare-books';
  else if (currentPath.includes('maps')) categoryId = 'maps';
  else if (currentPath.includes('periodicals')) categoryId = 'periodicals';
  else if (currentPath.includes('first-editions'))
    categoryId = 'first-editions';

  const { data: categories } = useQuery(['categories'], getCategoryInfo);

  useEffect(() => {
    if (categories) {
      if (categoryId && categories[categoryId]) {
        setCategoryInfo(categories[categoryId]);
      } else {
        setCategoryInfo({
          title: 'All Products',
          description:
            'Browse our complete collection of items from all categories.'
        });
      }
    }
  }, [categories, categoryId]);

  const {
    isLoading,
    error,
    data: products
  } = useQuery([`products-${categoryId || 'all'}`], () =>
    getProducts(categoryId)
  );
  const sortProducts = (products) => {
    if (!products) return [];
    return [...products].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-asc': return a.yearPublished - b.yearPublished;
        case 'year-desc': return b.yearPublished - a.yearPublished;
        default: return 0;
      }
    });
  };

  const sortedProducts = sortProducts(products);
  const currentProducts = sortedProducts
    ? sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const sortMenuItems = [
    { label: 'None', onClick: () => setSortOrder('none') },
    { label: 'Price Ascending', onClick: () => setSortOrder('price-asc') },
    { label: 'Price Descending', onClick: () => setSortOrder('price-desc') },
    { label: 'Year Published Ascending', onClick: () => setSortOrder('year-asc') },
    { label: 'Year Published Descending', onClick: () => setSortOrder('year-desc') },
  ];
  // const currentProducts = products
  // ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  // : [];
  const getUniqueGenres = () => {
    if (!products) return [];
    const genres = products
      .flatMap((product) => {
        if (
          product.genres &&
          Array.isArray(product.genres) &&
          product.genres.length > 0
        ) {
          return product.genres;
        } else if (product.genre) {
          return [product.genre];
        }
        return [];
      })
      .filter((genre) => genre && genre.trim() !== '');

    return [...new Set(genres)].sort();
  };

  const availableGenres = getUniqueGenres();

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Handle status changes from cart operations
  const handleStatusChange = (status) => {
    setStatusMessage(status);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>{categoryInfo.title || 'Products'} | Britannicus BMS</title>
      </Helmet>

      <div className='w-full max-w-[1200px] mx-auto mt-8 px-4'>
        {/* Mobile Category Toggle Button */}
        <button
          className='md:hidden w-full py-2 px-4 bg-slate-900 text-white rounded-md mb-4 flex items-center justify-between'
          onClick={toggleMobileSidebar}
        >
          <span>Categories</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-5 w-5 transition-transform ${
              showMobileSidebar ? 'rotate-180' : ''
            }`}
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        <div className='flex flex-col md:flex-row'>
          {/* Sidebar */}
          <div
            className={`${
              showMobileSidebar ? 'block' : 'hidden'
            } md:block md:w-56 md:shrink-0 mb-6 md:mb-0`}
          >
            <CategorySidebar
              currentCategory={categoryId}
              onSelectCategory={() => setShowMobileSidebar(false)}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Main Content */}
          <div className='w-full md:ml-8'>
            {/* Genre Buttons Section */}
            <div className='mb-6'>
              <div className='flex flex-wrap gap-2 mb-4'>
                {availableGenres.map((genre) => (
                  <GenreTag key={genre} label={genre}/>
                ))}
              </div>

              <h1 className='text-2xl md:text-3xl font-bold mb-2 md:mb-3'>
                {categoryInfo.title}
              </h1>
              <p className='text-gray-600 mb-4 md:mb-6 text-sm md:text-base'>
                {categoryInfo.description}
              </p>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`mb-4 p-4 rounded-md ${
                    statusMessage.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : statusMessage.type === 'info'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {statusMessage.message}
                </div>
              )}

              {/* Product Count and Sorting */}
              <div className='flex flex-col md:flex-row md:justify-between md:items-center py-4 border-b border-gray-200 gap-3 bg-slate-900 text-white p-5 rounded-md items-center'
              >
                <div className='flex flex-wrap items-center gap-4'>
                  <span className='text-gray-600 text-sm md:text-base'>
                    {isLoading
                      ? 'Loading products...'
                      : `Total: ${products?.length || 0} items`}
                  </span>
                  {/* Pagination - hidden on small screens */}
                  <div className='hidden md:block'>
                    {products && products.length > 0 && <Pagination currentPage={currentPage} products={products} setCurrentPage={setCurrentPage}/>}
                  </div>
                </div>

                <div>
                  {/* <SortSelector /> */}
                  <DropdownMenu title={`Sort by: ${sortOrder}`} menuItems={sortMenuItems} className={'right-[0]'}/>
                  
                </div>
              </div>

              {error && (
                <p className='text-center text-red-500 my-8'>
                  Error: {error.message}
                </p>
              )}

              {isLoading && (
                <p className='text-center my-8'>Loading products...</p>
              )}

              {/* Product Listing */}
              <ul className='mt-6 divide-y divide-gray-200'>
                {currentProducts && currentProducts.length > 0
                  ? currentProducts.map((product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  : !isLoading && (
                      <p className='text-center py-8 text-gray-500'>
                        No products found in this category.
                      </p>
                    )}
              </ul>

              {/* Mobile Pagination */}
              <div className='flex justify-center mt-6 md:hidden'>
              {products && products.length > 0 && <Pagination currentPage={1} products={products} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
