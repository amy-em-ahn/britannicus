import React, { useRef, useState } from 'react';

const ImageUploader = ({ images, setImages }) => {
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [error, setError] = useState('');

  const MAX_IMAGES = 6;

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
  };

  const addFiles = (files) => {
    if (images.length >= MAX_IMAGES) {
      setError(`Maximum of ${MAX_IMAGES} images allowed.`);
      return;
    }

    // Calculate how many more images can be added
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setError(
        `Only ${remainingSlots} more image${
          remainingSlots === 1 ? '' : 's'
        } can be added.`
      );
    } else {
      setError('');
    }

    const newFiles = filesToAdd.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== id);
      // Revoke object URLs to avoid memory leaks
      const removedImage = prev.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      setError('');
      return updatedImages;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (images.length < MAX_IMAGES) {
      dropAreaRef.current.classList.add('border-blue-500');
    }
  };

  const handleDragLeave = () => {
    dropAreaRef.current.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.remove('border-blue-500');

    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleUploadClick = () => {
    if (images.length < MAX_IMAGES) {
      fileInputRef.current.click();
    }
  };

  // Image count display
  const imageCountText = `${images.length}/${MAX_IMAGES} images uploaded`;

  return (
    <div className='mb-6'>
      <div
        ref={dropAreaRef}
        className={`border-2 border-dashed rounded-md p-4 mt-1 flex flex-col items-center justify-center transition-colors ${
          images.length >= MAX_IMAGES
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
            : 'border-gray-300 cursor-pointer hover:border-gray-400'
        }`}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className='text-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`mx-auto h-12 w-12 ${
              images.length >= MAX_IMAGES ? 'text-gray-300' : 'text-gray-400'
            }`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
            />
          </svg>
          {images.length >= MAX_IMAGES ? (
            <p className='mt-1 text-sm text-gray-500 font-medium'>
              Maximum number of images reached
            </p>
          ) : (
            <>
              <p className='mt-1 text-sm text-blue-500 font-medium'>
                Click to upload images or drag and drop
              </p>
              <p className='mt-1 text-xs text-gray-500'>Any file up to 10MB</p>
            </>
          )}
          <p className='mt-2 text-xs font-medium text-gray-600'>
            {imageCountText}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
          disabled={images.length >= MAX_IMAGES}
        />
      </div>

      {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}

      {images.length > 0 && (
        <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4'>
          {images.map((image) => (
            <div
              key={image.id}
              className='relative border rounded-md overflow-hidden'
            >
              <img
                src={image.preview}
                alt='Product preview'
                className='h-24 w-full object-cover'
              />
              <button
                type='button'
                className='absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200'
                onClick={() => removeImage(image.id)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-gray-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              <div className='bg-gray-100 text-xs p-1 truncate'>
                {image.file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
