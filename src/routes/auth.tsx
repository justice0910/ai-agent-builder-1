import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Auth from '../pages/Auth';
import { toast } from 'sonner';

export const AuthRoute: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle email confirmation redirect
    const confirmed = searchParams.get('confirmed');
    const error = searchParams.get('error');
    
    if (confirmed === 'true') {
      toast.success('Email confirmed successfully! You can now sign in.');
    } else if (error) {
      toast.error('Email confirmation failed. Please try again.');
    }
  }, [searchParams]);

  return <Auth />;
}; 