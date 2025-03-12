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
import AllProducts from './pages/Products/AllProducts';
import RareBooks from './pages/Products/RareBooks';
import Maps from './pages/Products/Maps';
import Periodicals from './pages/Products/Periodicals';
import FirstEditions from './pages/Products/FirstEditions';
import NewProduct from './pages/Products/NewProduct';
import ProductDetail from './pages/Products/ProductDetail';
import MyCart from './pages/MyCart/MyCart';
import NotFound from './pages/NotFount/NotFound';
import Admin from './pages/Admin/Admin';
import AdminBooks from './pages/Admin/AdminBooks';
import AdminMaps from './pages/Admin/AdminMaps';
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
        element: <AllProducts />
      },
      {
        path: '/products/rare-books',
        element: <RareBooks />
      },
      {
        path: '/products/maps',
        element: <Maps />
      },
      {
        path: '/products/periodicals',
        element: <Periodicals />
      },
      {
        path: '/products/first-editions',
        element: <FirstEditions />
      },
      {
        path: '/products/new',
        element: <NewProduct />
      },
      {
        path: '/products/:productsId',
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
        path: '/admin/books',
        element: (
          <ProtectedRoute requiredAdmin={true}>
            <AdminBooks />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/maps',
        element: (
          <ProtectedRoute requiredAdmin={true}>
            <AdminMaps />
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
