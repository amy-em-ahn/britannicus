// export async function uploadImage(file) {
//   const data = new FormData();
//   data.append('file', file);
//   data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);

//   return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
//     method: 'POST',
//     body: data
//   })
//     .then((res) => res.json())
//     .then((data) => data.url);
// }

export async function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'britannicus');

  return fetch('https://api.cloudinary.com/v1_1/doiqoi3of/image/upload', {
    method: 'POST',
    body: data
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Cloudinary response:', data);
      return data.secure_url;
    });
}
