import React from 'react';
import { useAuthContext } from '../components/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, reequiredAdmin }) {
  // check login user using AuthContext
  const { user } = useAuthContext();

  // if user does not have permission, they can't enter the webpage and redirect to home
  if (!user || (reequiredAdmin && !user.isAdmin)) {
    return <Navigate to='/' replace />;
  }

  // isAdmin?
  return children;

  // requiredAdmin is true, login + Admin
  // if not redirect to previous path
  // if it is true, show children
  return <div></div>;
}
