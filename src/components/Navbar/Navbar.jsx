import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.style.css';
import User from '../User';
import Button from '../ui/Button';
import { useAuthContext } from '../../context/AuthContext';
import DropdownMenu from '../../components/ui/DropdownMenu/DropdownMenu';
import CartStatus from '../Cart/CartStatus';

export default function Navbar() {
  // check user using authContext
  const { user, logout } = useAuthContext();
  const checkboxRef = useRef(null);
  const navigate = useNavigate();

  const closeMenu = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
  };

  const handleLogin = () => {
    // Navigate to login page
    navigate('/auth/login');
  };

  // Products dropdown menu items
  const productsMenuItems = [
    { label: 'Rare Books', path: '/products/rare-books' },
    { label: 'Vintage Maps', path: '/products/maps' },
    { label: 'Periodicals', path: '/products/periodicals' },
    { label: 'First Editions', path: '/products/first-editions' }
  ];

  // Admin dropdown menu items
  const adminMenuItems = [
    { label: 'Add Books', path: '/admin/books' },
    { label: 'Add maps', path: '/admin/maps' }
  ];

  return (
    <header className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-left'>
          <Link to='/' className='navbar-logo'>
            Britannicus
          </Link>

          <nav className='navbar-primary-links'>
            {/* Admin dropdown */}
            {user && <DropdownMenu title='Admin' menuItems={adminMenuItems} />}

            {/* Products dropdown */}
            <DropdownMenu title='Products' menuItems={productsMenuItems} />
          </nav>
        </div>

        <div className='navbar-right'>
          <div className='navbar-auth'>
            {user && (
              <Link to='/cart' className='navbar-cart'>
                <CartStatus />
              </Link>
            )}
            {!user && (
              <Link to='/auth/register' className='navbar-link'>
                Register
              </Link>
            )}
            {user && <User user={user} />}
            {!user && <Button text={'Login'} onClick={handleLogin} />}
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
            <div className='navbar-mobile-menu-header'>
              <div className='navbar-mobile-menu-title'>Britannicus</div>
              <button className='navbar-mobile-close-btn' onClick={closeMenu}>
                ✕
              </button>
            </div>

            <div className='navbar-mobile-nav'>
              <Link to='/' className='navbar-mobile-link' onClick={closeMenu}>
                Home
              </Link>

              {/* Admin dropdown */}
              {user && (
                <div className='navbar-mobile-dropdown'>
                  <button className='navbar-mobile-dropdown-toggle'>
                    Admin
                    <svg
                      className='navbar-mobile-dropdown-icon'
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
                  </button>
                  <div className='navbar-mobile-dropdown-menu'>
                    <Link
                      to='/admin/books'
                      className='navbar-mobile-dropdown-item'
                      onClick={closeMenu}
                    >
                      Add Books
                    </Link>
                    <Link
                      to='/admin/maps'
                      className='navbar-mobile-dropdown-item'
                      onClick={closeMenu}
                    >
                      Add Maps
                    </Link>
                  </div>
                </div>
              )}

              {/* Products dropdown */}
              <div className='navbar-mobile-dropdown'>
                <button className='navbar-mobile-dropdown-toggle'>
                  Products
                  <svg
                    className='navbar-mobile-dropdown-icon'
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
                </button>
                <div className='navbar-mobile-dropdown-menu'>
                  <Link
                    to='/products'
                    className='navbar-mobile-dropdown-item'
                    onClick={closeMenu}
                  >
                    All Products
                  </Link>
                  <Link
                    to='/products/rare-books'
                    className='navbar-mobile-dropdown-item'
                    onClick={closeMenu}
                  >
                    Rare Books
                  </Link>
                  <Link
                    to='/products/maps'
                    className='navbar-mobile-dropdown-item'
                    onClick={closeMenu}
                  >
                    Vintage Maps
                  </Link>
                  <Link
                    to='/products/periodicals'
                    className='navbar-mobile-dropdown-item'
                    onClick={closeMenu}
                  >
                    Periodicals
                  </Link>
                  <Link
                    to='/products/first-editions'
                    className='navbar-mobile-dropdown-item'
                    onClick={closeMenu}
                  >
                    First Editions
                  </Link>
                </div>
              </div>

              {user && (
                <Link
                  to='/cart'
                  className='navbar-mobile-link'
                  onClick={closeMenu}
                >
                  <CartStatus />
                </Link>
              )}
            </div>

            <div className='navbar-mobile-auth'>
              {!user && (
                <>
                  <Link
                    to='/auth/register'
                    className='navbar-mobile-link'
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                  <Button
                    text={'Login'}
                    onClick={() => {
                      handleLogin();
                      closeMenu();
                    }}
                  />
                </>
              )}

              {user && (
                <>
                  <User user={user} />
                  <Button
                    text={'Logout'}
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
