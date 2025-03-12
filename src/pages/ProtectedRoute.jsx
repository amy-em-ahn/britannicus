import React from 'react';
import { useAuthContext } from '../components/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, reequiredAdmin }) {
  // check login user using AuthContext
  const { user } = useAuthContext();

  // isAdmin?
  // requiredAdmin is true, login + Admin
  // if not redirect to home
  if (!user || (reequiredAdmin && !user.isAdmin)) {
    return <Navigate to='/' replace />;
  }

  // if it is true, show children
  return children;
}
