import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header>
      <Link to='/'>
        <h1>Britannicus BMS</h1>
      </Link>
      <nav>
        <Link to='/admin'>Admin</Link>
        <Link to='/products'>Products</Link>
        <Link to='/products/new'>New Products</Link>
        <Link to='/carts'>My Cart</Link>
        <Link to='/auth/login'>Login</Link>
        <Link to='/auth/register'>Register</Link>
      </nav>
    </header>
  );
}
