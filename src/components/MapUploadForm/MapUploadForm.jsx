import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button';
import OutlineButton from '../../components/ui/OutlineButton';
import { uploadImage } from '../../api/uploader';
import { addNewProduct } from '../../api/firebase';
import { initialMapState } from '../../config/productState';
import CommonProductFields from '../CommonProductFields';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

const MapUploadForm = () => {
  const defaultColorOptions = [
    'Original Color',
    'Black & White',
    'Sepia',
    'Hand Colored',
    'Woodcut'
  ];

  const defaultSizeOptions = [
    'Small (Up to 8x10")',
    'Medium (11x14" to 16x20")',
    'Large (17x22" to 24x36")',
    'Extra Large (Larger than 24x36")',
    'Folding Map'
  ];

  const initialState = {
    ...initialMapState,
    category: 'maps',
    colors: [],
    sizes: []
  };

  const [product, setProduct] = useState(initialState);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [colorOptions, setColorOptions] = useState(defaultColorOptions);
  const [sizeOptions, setSizeOptions] = useState(defaultSizeOptions);
  const [isAddingColorOption, setIsAddingColorOption] = useState(false);
  const [isAddingSizeOption, setIsAddingSizeOption] = useState(false);
  const [newColorOption, setNewColorOption] = useState('');
  const [newSizeOption, setNewSizeOption] = useState('');
  const [editingColor, setEditingColor] = useState(null);
  const [editingSize, setEditingSize] = useState(null);
  const [editingColorValue, setEditingColorValue] = useState('');
  const [editingSizeValue, setEditingSizeValue] = useState('');
  const [selectedColorOptions, setSelectedColorOptions] = useState({});
  const [selectedSizeOptions, setSelectedSizeOptions] = useState({});

  // New state for notifications and delete confirmation
  const [colorMessage, setColorMessage] = useState('');
  const [sizeMessage, setColorSizeMessage] = useState('');
  const [colorDeleteMessage, setColorDeleteMessage] = useState('');
  const [sizeDeleteMessage, setSizeDeleteMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: '',
    item: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorCheckChange = (color) => {
    const newSelected = { ...selectedColorOptions };
    newSelected[color] = !newSelected[color];
    setSelectedColorOptions(newSelected);

    const selectedColors = Object.keys(newSelected).filter(
      (key) => newSelected[key]
    );
    setProduct((prev) => ({
      ...prev,
      colors: selectedColors
    }));
  };

  const handleSizeCheckChange = (size) => {
    const newSelected = { ...selectedSizeOptions };
    newSelected[size] = !newSelected[size];
    setSelectedSizeOptions(newSelected);

    const selectedSizes = Object.keys(newSelected).filter(
      (key) => newSelected[key]
    );
    setProduct((prev) => ({
      ...prev,
      sizes: selectedSizes
    }));
  };

  const handleAddColorOption = () => {
    if (newColorOption.trim()) {
      const updatedOptions = [...colorOptions, newColorOption.trim()];
      setColorOptions(updatedOptions);
      setNewColorOption('');
      setIsAddingColorOption(false);
    }
  };

  const handleAddSizeOption = () => {
    if (newSizeOption.trim()) {
      const updatedOptions = [...sizeOptions, newSizeOption.trim()];
      setSizeOptions(updatedOptions);
      setNewSizeOption('');
      setIsAddingSizeOption(false);
    }
  };

  const confirmDeleteOption = (type, item) => {
    setDeleteModal({ show: true, type, item });
  };

  const handleDeleteOption = () => {
    const itemName = deleteModal.item;

    if (deleteModal.type === 'color') {
      handleDeleteColorOption(itemName);
      setColorDeleteMessage(
        `Option "${itemName}" has been deleted successfully`
      );
      setTimeout(() => setColorDeleteMessage(''), 3000);
    } else if (deleteModal.type === 'size') {
      handleDeleteSizeOption(itemName);
      setSizeDeleteMessage(
        `Option "${itemName}" has been deleted successfully`
      );
      setTimeout(() => setSizeDeleteMessage(''), 3000);
    }
    setDeleteModal({ show: false, type: '', item: '' });
  };

  const handleDeleteColorOption = (colorToDelete) => {
    const updatedOptions = colorOptions.filter(
      (color) => color !== colorToDelete
    );
    setColorOptions(updatedOptions);

    const newSelected = { ...selectedColorOptions };
    delete newSelected[colorToDelete];
    setSelectedColorOptions(newSelected);

    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== colorToDelete)
    }));

    if (editingColor === colorToDelete) {
      setEditingColor(null);
      setEditingColorValue('');
    }
  };

  const handleDeleteSizeOption = (sizeToDelete) => {
    const updatedOptions = sizeOptions.filter((size) => size !== sizeToDelete);
    setSizeOptions(updatedOptions);

    const newSelected = { ...selectedSizeOptions };
    delete newSelected[sizeToDelete];
    setSelectedSizeOptions(newSelected);

    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToDelete)
    }));

    if (editingSize === sizeToDelete) {
      setEditingSize(null);
      setEditingSizeValue('');
    }
  };

  const startEditingColor = (color) => {
    setEditingColor(color);
    setEditingColorValue(color);
  };

  const startEditingSize = (size) => {
    setEditingSize(size);
    setEditingSizeValue(size);
  };

  const finishEditingColor = () => {
    if (editingColorValue.trim() && editingColorValue !== editingColor) {
      const updatedOptions = colorOptions.map((c) =>
        c === editingColor ? editingColorValue : c
      );
      setColorOptions(updatedOptions);

      const newSelected = { ...selectedColorOptions };
      if (newSelected[editingColor]) {
        newSelected[editingColorValue] = true;
        delete newSelected[editingColor];
      }
      setSelectedColorOptions(newSelected);

      setProduct((prev) => ({
        ...prev,
        colors: prev.colors.map((c) =>
          c === editingColor ? editingColorValue : c
        )
      }));

      // Show success message
      setColorMessage(
        `Option "${editingColor}" updated to "${editingColorValue}"`
      );
      setTimeout(() => setColorMessage(''), 3000);
    }

    setEditingColor(null);
    setEditingColorValue('');
  };

  const finishEditingSize = () => {
    if (editingSizeValue.trim() && editingSizeValue !== editingSize) {
      const updatedOptions = sizeOptions.map((s) =>
        s === editingSize ? editingSizeValue : s
      );
      setSizeOptions(updatedOptions);

      const newSelected = { ...selectedSizeOptions };
      if (newSelected[editingSize]) {
        newSelected[editingSizeValue] = true;
        delete newSelected[editingSize];
      }
      setSelectedSizeOptions(newSelected);

      setProduct((prev) => ({
        ...prev,
        sizes: prev.sizes.map((s) => (s === editingSize ? editingSizeValue : s))
      }));

      // Show success message
      setColorSizeMessage(
        `Option "${editingSize}" updated to "${editingSizeValue}"`
      );
      setTimeout(() => setColorSizeMessage(''), 3000);
    }

    setEditingSize(null);
    setEditingSizeValue('');
  };

  // New functions for reordering
  const moveColorOption = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === colorOptions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newOptions = [...colorOptions];
    const temp = newOptions[index];
    newOptions[index] = newOptions[newIndex];
    newOptions[newIndex] = temp;
    setColorOptions(newOptions);
  };

  const moveSizeOption = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sizeOptions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newOptions = [...sizeOptions];
    const temp = newOptions[index];
    newOptions[index] = newOptions[newIndex];
    newOptions[newIndex] = temp;
    setSizeOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (images.length === 0) {
      alert('Please upload an image');
      setIsUploading(false);
      return;
    }

    // Prepare colors and sizes arrays
    let submittingColors = [];
    let submittingSizes = [];

    // Get selected colors from checkboxes
    if (Object.keys(selectedColorOptions).length > 0) {
      submittingColors = Object.keys(selectedColorOptions).filter(
        (color) => selectedColorOptions[color]
      );
    } else if (product.color) {
      // Fallback to single color if available
      submittingColors = Array.isArray(product.color)
        ? product.color.filter((c) => c)
        : [product.color];
    }

    // Get selected sizes from checkboxes
    if (Object.keys(selectedSizeOptions).length > 0) {
      submittingSizes = Object.keys(selectedSizeOptions).filter(
        (size) => selectedSizeOptions[size]
      );
    } else if (product.size) {
      // Fallback to single size if available
      submittingSizes = Array.isArray(product.size)
        ? product.size.filter((s) => s)
        : [product.size];
    }

    // Create a clean product object without undefined values
    const submittingProduct = {
      ...product,
      category: product.category || 'maps',
      // Remove single values in favor of arrays
      color: undefined,
      size: undefined,
      // Ensure arrays are not undefined
      colors: submittingColors.length > 0 ? submittingColors : [],
      sizes: submittingSizes.length > 0 ? submittingSizes : []
    };

    console.log('Submitting product:', submittingProduct);

    // Process all images instead of just the first one
    const uploadPromises = images.map((image) => uploadImage(image.file));

    Promise.all(uploadPromises)
      .then((urls) => {
        console.log('All images uploaded successfully:', urls);
        const productWithUnit = {
          ...submittingProduct,
          stockUnit: 'PCS'
        };
        return addNewProduct(productWithUnit, urls);
      })
      .then(() => {
        setSuccess('Map successfully added!');

        setTimeout(() => {
          setProduct(initialState);
          setImages([]);
          setSelectedColorOptions({});
          setSelectedSizeOptions({});
        }, 500);

        setTimeout(() => {
          setSuccess('');
        }, 4000);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Error: ${error.message || 'Unknown error occurred'}`);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const inputStyles =
    'block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  const categoryOptions = <option value='maps'>Vintage Maps</option>;

  return (
    <>
      <Helmet>
        <title>Add New Map | Britannicus BMS</title>
      </Helmet>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          {success && (
            <div className='m-4 p-4 text-sm text-green-700 bg-green-100 rounded-md'>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className='px-4 py-5 sm:p-6 space-y-6'>
            <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
              {/* Common Fields */}
              <CommonProductFields
                product={product}
                setProduct={setProduct}
                images={images}
                setImages={setImages}
                inputStyles={inputStyles}
                handleChange={handleChange}
                categoryOptions={categoryOptions}
                allowCustomOption={false}
                isCategoryDisabled={true}
              />

              {/* Color Options */}
              <div className='sm:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Available Colors (Optional)
                </label>

                {/* Add option button moved here */}
                <div className='mb-2'>
                  <button
                    type='button'
                    onClick={() => setIsAddingColorOption(true)}
                    className='flex items-center text-blue-500 hover:text-blue-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-xs'>Add option</span>
                  </button>
                </div>

                {/* Messages for color edits and deletions */}
                {colorMessage && (
                  <div className='mb-2 p-2 text-sm text-green-700 bg-green-100 rounded-md'>
                    {colorMessage}
                  </div>
                )}
                {colorDeleteMessage && (
                  <div className='mb-2 p-2 text-sm text-amber-700 bg-amber-100 rounded-md'>
                    {colorDeleteMessage}
                  </div>
                )}

                {/* Color input when adding */}
                {isAddingColorOption && (
                  <div className='flex items-center mb-2'>
                    <input
                      type='text'
                      value={newColorOption}
                      onChange={(e) => setNewColorOption(e.target.value)}
                      placeholder='Enter new option'
                      className='block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-l-md'
                      autoFocus
                    />
                    <div className='flex'>
                      <Button
                        icon='FaCheck'
                        className='py-1 px-2 rounded-none'
                        onClick={handleAddColorOption}
                      />
                      <OutlineButton
                        icon='FaTimes'
                        className='rounded-l-none py-1 px-2'
                        onClick={() => setIsAddingColorOption(false)}
                      />
                    </div>
                  </div>
                )}

                <div className='relative border rounded-md'>
                  <div className='max-h-48 overflow-y-auto p-2'>
                    {colorOptions.map((color, idx) => (
                      <div
                        key={idx}
                        className='flex items-center py-1 border-b last:border-b-0'
                      >
                        <input
                          type='checkbox'
                          id={`color-${idx}`}
                          checked={!!selectedColorOptions[color]}
                          onChange={() => handleColorCheckChange(color)}
                          className='mr-2'
                        />
                        {editingColor === color ? (
                          <div className='flex-grow flex items-center'>
                            <input
                              type='text'
                              value={editingColorValue}
                              onChange={(e) =>
                                setEditingColorValue(e.target.value)
                              }
                              onBlur={finishEditingColor}
                              onKeyDown={(e) =>
                                e.key === 'Enter' && finishEditingColor()
                              }
                              className='flex-grow border border-gray-300 rounded px-2 py-1 text-sm'
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <span
                              className='text-sm flex-grow cursor-pointer'
                              onClick={() => startEditingColor(color)}
                            >
                              {color}
                            </span>
                            <div className='flex items-center'>
                              {/* Reordering buttons */}
                              <button
                                type='button'
                                onClick={() => moveColorOption(idx, 'up')}
                                className='text-gray-500 hover:text-blue-500 px-1'
                                disabled={idx === 0}
                              >
                                <FaArrowUp size={12} />
                              </button>
                              <button
                                type='button'
                                onClick={() => moveColorOption(idx, 'down')}
                                className='text-gray-500 hover:text-blue-500 px-1'
                                disabled={idx === colorOptions.length - 1}
                              >
                                <FaArrowDown size={12} />
                              </button>
                              <button
                                type='button'
                                onClick={() =>
                                  confirmDeleteOption('color', color)
                                }
                                className='text-gray-500 hover:text-red-500 px-1'
                              >
                                <TiDelete size={20} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-3'>
                  <p className='text-sm text-gray-500 mb-2'>Selected Colors:</p>
                  <div className='flex flex-wrap gap-2 mt-1'>
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className='bg-gray-100 rounded-md px-3 py-1 flex items-center'
                      >
                        <span>{color}</span>
                      </div>
                    ))}
                    {product.colors.length === 0 && (
                      <p className='text-sm text-gray-400 italic'>
                        No colors selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Options */}
              <div className='sm:col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Available Sizes (Optional)
                </label>

                {/* Add option button moved here */}
                <div className='mb-2'>
                  <button
                    type='button'
                    onClick={() => setIsAddingSizeOption(true)}
                    className='flex items-center text-blue-500 hover:text-blue-700'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-xs'>Add option</span>
                  </button>
                </div>

                {/* Messages for size edits and deletions */}
                {sizeMessage && (
                  <div className='mb-2 p-2 text-sm text-green-700 bg-green-100 rounded-md'>
                    {sizeMessage}
                  </div>
                )}
                {sizeDeleteMessage && (
                  <div className='mb-2 p-2 text-sm text-amber-700 bg-amber-100 rounded-md'>
                    {sizeDeleteMessage}
                  </div>
                )}

                {/* Size input when adding */}
                {isAddingSizeOption && (
                  <div className='flex items-center mb-2'>
                    <input
                      type='text'
                      value={newSizeOption}
                      onChange={(e) => setNewSizeOption(e.target.value)}
                      placeholder='Enter new option'
                      className='block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-l-md'
                      autoFocus
                    />
                    <div className='flex'>
                      <Button
                        icon='FaCheck'
                        className='py-1 px-2 rounded-none'
                        onClick={handleAddSizeOption}
                      />
                      <OutlineButton
                        icon='FaTimes'
                        className='rounded-l-none py-1 px-2'
                        onClick={() => setIsAddingSizeOption(false)}
                      />
                    </div>
                  </div>
                )}

                <div className='relative border rounded-md'>
                  <div className='max-h-48 overflow-y-auto p-2'>
                    {sizeOptions.map((size, idx) => (
                      <div
                        key={idx}
                        className='flex items-center py-1 border-b last:border-b-0'
                      >
                        <input
                          type='checkbox'
                          id={`size-${idx}`}
                          checked={!!selectedSizeOptions[size]}
                          onChange={() => handleSizeCheckChange(size)}
                          className='mr-2'
                        />
                        {editingSize === size ? (
                          <div className='flex-grow flex items-center'>
                            <input
                              type='text'
                              value={editingSizeValue}
                              onChange={(e) =>
                                setEditingSizeValue(e.target.value)
                              }
                              onBlur={finishEditingSize}
                              onKeyDown={(e) =>
                                e.key === 'Enter' && finishEditingSize()
                              }
                              className='flex-grow border border-gray-300 rounded px-2 py-1 text-sm'
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <span
                              className='text-sm flex-grow cursor-pointer'
                              onClick={() => startEditingSize(size)}
                            >
                              {size}
                            </span>
                            <div className='flex items-center'>
                              {/* Reordering buttons */}
                              <button
                                type='button'
                                onClick={() => moveSizeOption(idx, 'up')}
                                className='text-gray-500 hover:text-blue-500 px-1'
                                disabled={idx === 0}
                              >
                                <FaArrowUp size={12} />
                              </button>
                              <button
                                type='button'
                                onClick={() => moveSizeOption(idx, 'down')}
                                className='text-gray-500 hover:text-blue-500 px-1'
                                disabled={idx === sizeOptions.length - 1}
                              >
                                <FaArrowDown size={12} />
                              </button>
                              <button
                                type='button'
                                onClick={() =>
                                  confirmDeleteOption('size', size)
                                }
                                className='text-gray-500 hover:text-red-500 px-1'
                              >
                                <TiDelete size={20} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-3'>
                  <p className='text-sm text-gray-500 mb-2'>Selected Sizes:</p>
                  <div className='flex flex-wrap gap-2 mt-1'>
                    {product.sizes.map((size, index) => (
                      <div
                        key={index}
                        className='bg-gray-100 rounded-md px-3 py-1 flex items-center'
                      >
                        <span>{size}</span>
                      </div>
                    ))}
                    {product.sizes.length === 0 && (
                      <p className='text-sm text-gray-400 italic'>
                        No sizes selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description at the bottom */}
              <div className='sm:col-span-2'>
                <textarea
                  name='description'
                  id='description'
                  value={product.description}
                  onChange={handleChange}
                  rows='4'
                  placeholder='Map description (Optional)'
                  className={inputStyles}
                />
              </div>
            </div>

            <div className='pt-5'>
              <div className='flex justify-center gap-3'>
                <OutlineButton
                  type='button'
                  text='Cancel'
                  disabled={isUploading}
                />
                <Button
                  text={isUploading ? 'Uploading...' : 'Add Map'}
                  disabled={isUploading}
                  type='submit'
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {deleteModal.show && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm mx-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Confirm Deletion
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              Are you sure you want to delete "{deleteModal.item}"? This action
              cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <OutlineButton
                text='Cancel'
                onClick={() =>
                  setDeleteModal({ show: false, type: '', item: '' })
                }
              />
              <Button text='Delete' onClick={handleDeleteOption} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapUploadForm;
