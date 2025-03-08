import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  // useEffect(() => {
  //   document.title = 'All Products | Britannicus BMS';
  // }, []);

  return (
    <>
      <Helmet>
        <title>Home | Britannicus BMS</title>
      </Helmet>
      <div>Home</div>
    </>
  );
}
