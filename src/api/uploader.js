console.log('Cloudinary Environment Variables Check:', {
  preset: process.env.REACT_APP_CLOUDINARY_PRESET ? 'Set' : 'Not Set',
  url: process.env.REACT_APP_CLOUDINARY_URL ? 'Set' : 'Not Set'
});

export async function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
  console.log('Cloudinary Environment Variables Check:', {
    preset: process.env.REACT_APP_CLOUDINARY_PRESET ? 'Set' : 'Not Set',
    url: process.env.REACT_APP_CLOUDINARY_URL ? 'Set' : 'Not Set'
  });

  try {
    console.log('Uploading image to Cloudinary...');
    const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
      method: 'POST',
      body: data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log('Cloudinary success response:', result);

    const imageUrl = result.secure_url || result.url;
    const optimizedUrl = imageUrl.replace(
      '/upload/',
      '/upload/w_auto,c_fill,q_auto,f_auto/'
    );
    console.log('Optimized image URL:', optimizedUrl);

    return optimizedUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}
