import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.style.css';
import { login, logout, onUserStateChange } from '../../api/firebase';
import User from '../User';

export default function Navbar() {
  const [user, setUser] = useState();

  useEffect(() => {
    onUserStateChange((user) => {
      console.log('setUser:', user);
      setUser(user);
    });
  }, []);

  const checkboxRef = useRef(null);

  const closeMenu = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
  };

  return (
    <header className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-left'>
          <Link to='/' className='navbar-logo'>
            Britannicus
          </Link>

          <nav className='navbar-primary-links'>
            <Link to='/admin' className='navbar-link'>
              Admin
            </Link>
            <div className='navbar-dropdown'>
              <Link to='/products' className='navbar-link'>
                Products
                <svg
                  className='navbar-dropdown-icon'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </Link>
            </div>
          </nav>
        </div>

        <div className='navbar-right'>
          <div className='navbar-auth'>
            <Link to='/cart' className='navbar-cart'>
              <svg
                className='navbar-cart-icon'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='9' cy='21' r='1'></circle>
                <circle cx='20' cy='21' r='1'></circle>
                <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
              </svg>{' '}
              My Cart
            </Link>
            <Link to='/auth/register' className='navbar-link'>
              Register
            </Link>
            {user && <User user={user} />}
            {!user && <button onClick={login}> Login </button>}
            {user && <button onClick={logout}> Logout </button>}
          </div>
        </div>

        {/* Mobile menu */}
        <div className='navbar-mobile-toggle'>
          <input
            ref={checkboxRef}
            type='checkbox'
            id='menu-toggle'
            className='navbar-mobile-checkbox'
          />
          <label htmlFor='menu-toggle' className='navbar-mobile-icon'>
            <span className='navbar-mobile-icon-bar'></span>
            <span className='navbar-mobile-icon-bar'></span>
            <span className='navbar-mobile-icon-bar'></span>
          </label>

          {/* Mobile menu */}
          <div className='navbar-mobile-menu'>
            <Link
              to='/admin'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              Admin
            </Link>
            <Link
              to='/products'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              Products
            </Link>
            <Link to='/cart' className='navbar-mobile-link' onClick={closeMenu}>
              Cart
            </Link>
            <Link
              to='/auth/register'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              Register
            </Link>
            {user && <User user={user} />}
            {!user && <button onClick={login}> Login </button>}
            {user && <button onClick={logout}> Logout </button>}
          </div>
        </div>
      </div>
    </header>
  );
}
