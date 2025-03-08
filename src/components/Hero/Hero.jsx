import React from 'react';
import './Hero.style.css';
// import Search from '../../common/Search/Search';
// import FilterButton from '../../common/FilterButton/FilterButton';

export default function Hero() {
  // const filterCategories = [
  //   { id: 'rare', label: 'Rare Books' },
  //   { id: 'vintage', label: 'Vintage Items' },
  //   { id: 'first', label: 'First Editions' },
  //   { id: 'used', label: 'Used Books' },
  //   { id: 'periodicals', label: 'Periodicals' }
  // ];

  return (
    <section className='hero'>
      <div className='hero-content'>
        <h1 className='hero-title'>Discover, Collect, Cherish.</h1>
        <p className='hero-subtitle'>
          Where Every Book Finds Its Rightful Home
        </p>

        {/* <div className='hero-search-container'>
          <Search />
        </div>

        <div className='hero-filters'>
          {filterCategories.map((category) => (
            <FilterButton
              key={category.id}
              id={category.id}
              label={category.label}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}
