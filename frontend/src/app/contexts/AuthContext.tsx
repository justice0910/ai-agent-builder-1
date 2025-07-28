import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../services/authService';
import { authService } from '../services/authService';
import { supabase } from '../../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  isLoading: boolean;
  requiresEmailConfirmation: boolean;
  isAuthenticated: boolean; // New: indicates if auth check is complete
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New: track if auth check is complete
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);

  // Function to check and restore user session with enhanced logging
  const checkAndRestoreSession = async () => {
    try {
      console.log('🔄 Checking for existing user session...');
      
      // First check Supabase session directly
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('✅ Supabase session found:', session.user.email);
        console.log('📅 Session expires at:', new Date(session.expires_at! * 1000));
        
        // Check if session is expired
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
          console.log('⚠️ Session expired, attempting token refresh...');
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
          if (refreshedSession) {
            console.log('✅ Session refreshed successfully');
          } else {
            console.log('❌ Failed to refresh session');
            setUser(null);
            setIsLoading(false);
            setIsAuthenticated(true);
            return;
          }
        }
      } else {
        console.log('ℹ️ No Supabase session found');
      }
      
      // Now get user through our service
        const currentUser = await authService.getCurrentUser();
      console.log('📋 Current user found:', currentUser);
      
      if (currentUser) {
        console.log('✅ Restoring user session:', currentUser.email);
        setUser(currentUser);
      } else {
        console.log('ℹ️ No active session found or user email not confirmed');
        setUser(null);
      }
      } catch (error) {
      console.error('❌ Error checking user session:', error);
      setUser(null);
      } finally {
        setIsLoading(false);
        // Don't set isAuthenticated here - let the useEffect handle it
      }
    };

  useEffect(() => {
    // Initial session check
    checkAndRestoreSession();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session);
        
        if (event === 'SIGNED_IN' && session && typeof session === 'object' && 'user' in session) {
          const sessionUser = (session as { user: any }).user;
          
          // Check if email is confirmed before setting user
          const emailConfirmed = sessionUser.email_confirmed_at !== null;
          
          if (!emailConfirmed) {
            console.log('⚠️ User signed in but email not confirmed, not setting user');
            setUser(null);
            return;
          }
          
          const userData: User = {
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: sessionUser.email?.split('@')[0] || 'User',
            emailConfirmed,
          };
          console.log('✅ Setting user from auth state change:', userData);
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setUser(null);
          setRequiresEmailConfirmation(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed, rechecking session...');
          // Recheck session after token refresh
          setTimeout(checkAndRestoreSession, 100);
        }
      }
    );

    // Enhanced page visibility and focus handling
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page became visible, rechecking session...');
        // Add a small delay to ensure Supabase has time to refresh tokens
        setTimeout(checkAndRestoreSession, 500);
      }
    };

    const handleFocus = () => {
      console.log('🎯 Window focused, rechecking session...');
      // Add a small delay to ensure Supabase has time to refresh tokens
      setTimeout(checkAndRestoreSession, 500);
    };

    // Listen for beforeunload to save session state
    const handleBeforeUnload = () => {
      console.log('📤 Page unloading, session should persist...');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Add a debug effect to log user state changes and update isAuthenticated
  useEffect(() => {
    console.log('👤 User state changed:', user ? `Logged in as ${user.email}` : 'Not logged in');
    console.log('🔍 Email confirmed:', user?.emailConfirmed);
    // Only set isAuthenticated to true if user exists and email is confirmed
    const shouldBeAuthenticated = !!user && !!user.emailConfirmed;
    console.log('🔐 Setting isAuthenticated to:', shouldBeAuthenticated);
    setIsAuthenticated(shouldBeAuthenticated);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setRequiresEmailConfirmation(false);
    
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await authService.signIn(email, password);
      
      if (response.requiresEmailConfirmation) {
        setRequiresEmailConfirmation(true);
        setUser(null); // Ensure user is not set when email confirmation is required
        throw new Error(response.error || 'Email confirmation required');
      }
      
      if (response.error) throw new Error(response.error);
      
      console.log('✅ Login successful, setting user:', response.user);
      setUser(response.user);
    } catch (error) {
      console.error('❌ Login error:', error);
      setUser(null); // Ensure user is not set on error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setRequiresEmailConfirmation(false);
    
    try {
      console.log('📝 Attempting signup for:', email);
      const response = await authService.signUp(email, password);
      
      if (response.requiresEmailConfirmation) {
        setRequiresEmailConfirmation(true);
        setUser(null); // Ensure user is not set when email confirmation is required
        throw new Error(response.error || 'Email confirmation required');
      }
      
      if (response.error) throw new Error(response.error);
      
      console.log('✅ Signup successful, setting user:', response.user);
      setUser(response.user);
    } catch (error) {
      console.error('❌ Signup error:', error);
      setUser(null); // Ensure user is not set on error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('🚪 Attempting logout');
      const response = await authService.signOut();
      
      if (response.error) throw new Error(response.error);
      
      console.log('✅ Logout successful');
      setUser(null);
      setRequiresEmailConfirmation(false);
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if there's an error, clear the local state
      setUser(null);
      setRequiresEmailConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const response = await authService.resendConfirmationEmail(email);
      if (response.error) throw new Error(response.error);
    } catch (error) {
      console.error('❌ Resend confirmation error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      resendConfirmationEmail,
      isLoading, 
      requiresEmailConfirmation,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};