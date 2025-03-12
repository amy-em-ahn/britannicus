import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.style.css';
import User from '../User';
import Button from '../ui/Button';
import { useAuthContext } from '../context/AuthContext';
import DropdownMenu from '../../components/ui/DropdownMenu/DropdownMenu';

export default function Navbar() {
  // check user using authContext
  const { user, login, logout } = useAuthContext();
  const checkboxRef = useRef(null);

  const closeMenu = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
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
            {user && user.isAdmin && (
              <DropdownMenu title='Admin' menuItems={adminMenuItems} />
            )}

            {/* Products dropdown */}
            <DropdownMenu title='Products' menuItems={productsMenuItems} />
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
              <>
                <Link to='/auth/register' className='navbar-link'>
                  Register
                </Link>
                <Link to='/auth/login2' className='navbar-link'>
                  Login2
                </Link>
              </>
            )}
            {user && <User user={user} />}
            {/* {!user && <Button icon={"FaGoogle"} text={'Login'} onClick={login} />}
            {!user && <Button text={'Login'} />  } */}
            {!user && (
              <Link
                to='/auth/login'
                className='navbar-mobile-link'
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
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
              <>
                <Link
                  to='/admin'
                  className='navbar-mobile-link'
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to='/admin/users'
                  className='navbar-mobile-link'
                  onClick={closeMenu}
                >
                  Manage Users
                </Link>
                <Link
                  to='/admin/orders'
                  className='navbar-mobile-link'
                  onClick={closeMenu}
                >
                  Orders
                </Link>
              </>
            )}
            <Link
              to='/products'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              All Products
            </Link>
            <Link
              to='/products/genre'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              Genre
            </Link>
            <Link
              to='/products/in-stock'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              In stock
            </Link>
            <Link
              to='/products/condition'
              className='navbar-mobile-link'
              onClick={closeMenu}
            >
              Condition
            </Link>
            <Link to='/cart' className='navbar-mobile-link' onClick={closeMenu}>
              Cart
            </Link>
            {!user && (
              <>
                <Link
                  to='/auth/register'
                  className='navbar-mobile-link'
                  onClick={closeMenu}
                >
                  Register
                </Link>
                <Link
                  to='/auth/login2'
                  className='navbar-mobile-link'
                  onClick={closeMenu}
                >
                  Login2
                </Link>
              </>
            )}
            {user && <User user={user} />}
            {!user && <Button text={'Login'} onClick={login} />}
            {user && <Button text={'Logout'} onClick={logout} />}
          </div>
        </div>
      </div>
    </header>
  );
}
