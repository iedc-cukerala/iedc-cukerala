import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-2 gradient-text">Verifying Access...</div>
          <p className="text-slate-400">Please wait</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      // If user doesn't have the right role, redirect to login or home
      return <Navigate to="/admin/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;