import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || !user.yetki) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.yetki)) {
    return <Navigate to={user.yetki === 'admin' ? '/admin' : '/'} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute; 