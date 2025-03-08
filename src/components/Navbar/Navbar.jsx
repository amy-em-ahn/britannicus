import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.style.css';
import User from '../User';
import Button from '../ui/Button';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar() {
  // check user using authContext
  const { user, login, logout } = useAuthContext();
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

          {/* if user is admin, show admin menu */}
          <nav className='navbar-primary-links'>
            {user && user.isAdmin && (
              <Link to='/admin' className='navbar-link'>
                Admin
              </Link>
            )}

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
            {user && (
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
            )}
            {!user && (
              <Link to='/auth/register' className='navbar-link'>
                Register
              </Link>
            )}
            {user && <User user={user} />}
            {!user && <Button text={'Login'} onClick={login} />}
            {user && <Button text={'Logout'} onClick={logout} />}
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
            {user && user.isAdmin && (
              <Link
                to='/admin'
                className='navbar-mobile-link'
                onClick={closeMenu}
              >
                Admin
              </Link>
            )}
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
            {!user && <Button text={'Login'} onClick={login} />}
            {user && <Button text={'Logout'} onClick={logout} />}
          </div>
        </div>
      </div>
    </header>
  );
}
