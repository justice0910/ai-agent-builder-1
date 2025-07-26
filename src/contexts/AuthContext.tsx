import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  isLoading: boolean;
  requiresEmailConfirmation: boolean;
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
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session && typeof session === 'object' && 'user' in session) {
          const sessionUser = (session as { user: User }).user;
          const userData: User = {
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: sessionUser.email?.split('@')[0] || 'User',
            emailConfirmed: sessionUser.emailConfirmed,
          };
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRequiresEmailConfirmation(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setRequiresEmailConfirmation(false);
    
    try {
      const response = await authService.signIn(email, password);
      
      if (response.requiresEmailConfirmation) {
        setRequiresEmailConfirmation(true);
        throw new Error(response.error || 'Email confirmation required');
      }
      
      if (response.error) throw new Error(response.error);
      
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setRequiresEmailConfirmation(false);
    
    try {
      const response = await authService.signUp(email, password);
      
      if (response.requiresEmailConfirmation) {
        setRequiresEmailConfirmation(true);
        throw new Error(response.error || 'Email confirmation required');
      }
      
      if (response.error) throw new Error(response.error);
      
      setUser(response.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await authService.signOut();
      
      if (response.error) throw new Error(response.error);
      
      setUser(null);
      setRequiresEmailConfirmation(false);
    } catch (error) {
      console.error('Logout error:', error);
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
      console.error('Resend confirmation error:', error);
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
      requiresEmailConfirmation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};