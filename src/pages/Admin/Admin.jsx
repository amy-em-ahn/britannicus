import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation } from 'react-router-dom';
import BookUploadForm from '../../components/BookUploadForm';
import MapUploadForm from '../../components/MapUploadForm/MapUploadForm';
import FloatingButton from '../../components/ui/FloatingButton';

export default function Admin() {
  const location = useLocation();
  const currentPath = location.pathname;

  let title = 'Admin Dashboard';
  let formType = '';

  if (currentPath.includes('/admin/books')) {
    title = 'Add New Book';
    formType = 'book';
  } else if (currentPath.includes('/admin/maps')) {
    title = 'Add New Map';
    formType = 'map';
  }

  return (
    <>
      <Helmet>
        <title>{title} | Britannicus BMS</title>
      </Helmet>
      <section className='w-full'>
        <h1 className='text-2xl font-bold mt-4 text-center'>{title}</h1>
        
        {formType === 'book' && <BookUploadForm />}
        {formType === 'map' && <MapUploadForm />}
        {!formType && (
          <div className='mt-8 text-center'>
            <p className='text-lg'>Welcome to the admin dashboard.</p>
            <p className='mt-2'>
              Please select an option from the admin menu to get started.
            </p>
            <FloatingButton className={'m-[60px] bottom-[60px] right-0'} text={"+ New Map"} path={"/admin/maps"}/>
            <FloatingButton className={'m-[60px] bottom-0 right-0'} text={"+ New Book"} path={"/admin/books"}/>
          </div>
        )}
      </section>
    </>
  );
}
