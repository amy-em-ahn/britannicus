import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './DropdownMenu.style.css';

const DropdownMenu = ({ title, menuItems, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  if (!className || className === "") {
    className = 'left-[0]'
  }
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='navbar-dropdown' ref={dropdownRef}>
      <button className='navbar-link dropdown-toggle' onClick={toggleDropdown}>
        {title}
        <svg
          className={`navbar-dropdown-icon ${isOpen ? 'rotate' : ''}`}
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
      {isOpen && (
        <div className={`dropdown-menu ${className}`}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className='dropdown-item'
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                }
                setIsOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
