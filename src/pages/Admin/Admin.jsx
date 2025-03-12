import React, { useState } from 'react';
import './Admin.style.css';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button';
import { uploadImage } from '../../api/uploader';
import { addNewProduct } from '../../api/firebase';

export default function Admin() {
  const initialProductState = {
    category: '',
    title: '',
    price: '',
    publishedby: '',
    year: '',
    seller: '',
    location: '',
    description: '',
    options: ''
  };

  const [product, setProduct] = useState(initialProductState);
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFile(files && files[0]);
      return; // if file, dont execute setProduct
    }
    setProduct((product) => ({ ...product, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Add product to Cloudinary
    uploadImage(file)
      .then((url) => {
        // Add product to firebase with img url
        return addNewProduct(product, url);
      })
      .then(() => {
        setSuccess('Product successfully added!');
        // Reset form
        setProduct(initialProductState);
        setFile(null);
        setTimeout(() => {
          setSuccess(null);
        }, 4000);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Admin | Britannicus BMS</title>
      </Helmet>
      <section>
        <div>Admin</div>
        <div>Add new products</div>
        {success && <p className='success-message'>{success}</p>}
        {file && (
          <div className='image-preview'>
            <img
              src={URL.createObjectURL(file)}
              alt='Product'
              style={{ width: '200px', height: '200px', objectFit: 'contain' }}
            />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <select
            name='category'
            value={product.category}
            required
            onChange={handleChange}
          >
            <option value='' disabled>
              Select Product Category
            </option>
            <option value='Rare Books'>Rare Books</option>
            <option value='Vintage maps'>Vintage maps</option>
            <option value='Periodicals'>Periodicals</option>
            <option value='First Editions'>First Editions</option>
          </select>

          <input
            type='file'
            accept='image/*'
            name='file'
            required
            onChange={handleChange}
          />

          <input
            type='text'
            name='title'
            value={product.title}
            placeholder='Product Title'
            required
            onChange={handleChange}
          />

          <input
            type='number'
            name='price'
            value={product.price}
            placeholder='Product Price USD'
            required
            onChange={handleChange}
          />

          <input
            type='text'
            name='publishedby'
            value={product.publishedby}
            placeholder='Published by (optional)'
            onChange={handleChange}
          />

          <input
            type='text'
            name='year'
            value={product.year}
            placeholder='Year (optional)'
            onChange={handleChange}
          />

          <input
            type='text'
            name='seller'
            value={product.seller}
            placeholder='Seller (optional)'
            onChange={handleChange}
          />

          <input
            type='text'
            name='location'
            value={product.location}
            placeholder='Seller Location'
            onChange={handleChange}
          />

          <input
            type='text'
            name='description'
            value={product.description}
            placeholder='Product description'
            required
            onChange={handleChange}
          />

          <select
            name='options'
            value={product.options}
            required
            onChange={handleChange}
          >
            <option value='' disabled>
              Select Product Options
            </option>
            <option value='Individual'>Individual</option>
            <option value='Auction'>Auction</option>
            <option value='Real estate'>Real estate</option>
            <option value='Library'>Library</option>
          </select>

          <Button
            text={isUploading ? 'Uploading...' : 'Add Product'}
            disabled={isUploading}
          />
        </form>
      </section>
    </>
  );
}
