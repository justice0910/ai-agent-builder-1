import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Remember the intended path when component mounts
  useEffect(() => {
    if (location.pathname !== '/auth' && location.pathname !== '/') {
      console.log('🎯 Remembering intended path:', location.pathname);
    }
  }, [location.pathname]);

  // Show loading while authentication is being checked
  if (isLoading) {
    console.log('⏳ ProtectedRoute - Waiting for authentication to load...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and email is confirmed, show the intended content
  if (user && user.emailConfirmed) {
    console.log('✅ ProtectedRoute - User authenticated and email confirmed, showing content');
    return <>{children}</>;
  }

  // If user is authenticated but email not confirmed, redirect to auth with message
  if (user && !user.emailConfirmed) {
    console.log('⚠️ ProtectedRoute - User authenticated but email not confirmed, redirecting to auth');
    toast.error('Please confirm your email before accessing the dashboard.');
    return <Navigate to="/auth?emailConfirmation=true" replace />;
  }

  // If user is not authenticated, redirect to auth page
  console.log('🔐 ProtectedRoute - User not authenticated, redirecting to auth');
  return <Navigate to="/auth" replace />;
}; 