import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallbackPath = '/auth' 
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Remember the intended path when component mounts
  useEffect(() => {
    if (location.pathname !== '/auth' && location.pathname !== '/') {
      console.log('🎯 Remembering intended path:', location.pathname);
    }
  }, [location.pathname]);

  // Show loading while authentication is being checked
  if (isLoading || !isAuthenticated) {
    console.log('⏳ AuthGuard - Waiting for authentication to load...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the intended content
  if (user && user.emailConfirmed) {
    console.log('✅ AuthGuard - User authenticated and email confirmed, showing content');
    return <>{children}</>;
  }

  // If user is authenticated but email not confirmed, redirect to auth
  if (user && !user.emailConfirmed) {
    console.log('⚠️ AuthGuard - User authenticated but email not confirmed, redirecting to auth');
    return <Navigate to="/auth?emailConfirmation=true" replace />;
  }

  // If user is not authenticated, redirect to auth page
  console.log('🔐 AuthGuard - User not authenticated, redirecting to auth');
  return <Navigate to={fallbackPath} replace />;
};

// Component for routes that should redirect authenticated users
export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading while authentication is being checked
  if (isLoading || !isAuthenticated) {
    console.log('⏳ GuestGuard - Waiting for authentication to load...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user && user.emailConfirmed) {
    console.log('🔀 GuestGuard - User authenticated and email confirmed, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but email not confirmed, show guest content
  if (user && !user.emailConfirmed) {
    console.log('⚠️ GuestGuard - User authenticated but email not confirmed, showing guest content');
    return <>{children}</>;
  }

  // If user is not authenticated, show the guest content
  console.log('👤 GuestGuard - User not authenticated, showing guest content');
  return <>{children}</>;
}; 