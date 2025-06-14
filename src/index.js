import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Products from './pages/Products/Products';
import NewProduct from './pages/Products/NewProduct';
import ProductDetail from './pages/Products/ProductDetail';
import MyCart from './pages/MyCart/MyCart';
import NotFound from './pages/NotFound/NotFound';
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './pages/ProtectedRoute';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/auth/register',
        element: <Register />
      },
      {
        path: '/auth/login',
        element: <Login />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/products/rare-books',
        element: <Products />
      },
      {
        path: '/products/maps',
        element: <Products />
      },
      {
        path: '/products/periodicals',
        element: <Products />
      },
      {
        path: '/products/first-editions',
        element: <Products />
      },
      {
        path: '/products/new',
        element: <NewProduct />
      },
      {
        path: '/products/:productId',
        element: <ProductDetail />
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute>
            <MyCart />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredAdmin={true}>
            <Admin />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/:productType',
        element: (
          <ProtectedRoute requiredAdmin={true}>
            <Admin />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
console.log('Router loaded:', router);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* title */}
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* dev tool */}
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
