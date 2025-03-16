import React from 'react';
import { Helmet } from 'react-helmet-async';
import './NotFound.style.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Not Found | Britannicus BMS</title>
      </Helmet>
      <div className='page'>
        <div className='fourofour'>
          <h1>404 - Page Not Found</h1>
          <p>Oops! The page you're looking for doesn't exist.</p>
          <p>It might have been moved, deleted, or perhaps it never existed.</p>
          <p>If you believe this is an error, please let us know.</p>
          <Button onClick={() => navigate('/')} text={"Go Home"} className={"w-fit m-auto text-[2rem]"}/>
        </div>
      </div>
    </>
  );
}
