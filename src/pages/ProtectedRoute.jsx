import React from 'react';
import { useAuthContext } from '../components/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredAdmin }) {
  // check login user using AuthContext
  const { user } = useAuthContext();

  console.log('Protected Route:', {
    user,
    requiredAdmin,
    condition: !user || (requiredAdmin && !user.isAdmin)
  });

  // isAdmin?
  // requiredAdmin is true, login + Admin
  // if not redirect to home
  if (!user || (requiredAdmin && !user.isAdmin)) {
    return <Navigate to='/' replace />;
  }

  // if it is true, show children
  return children;
}
