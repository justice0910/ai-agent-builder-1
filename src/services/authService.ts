import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  email: string;
  name: string;
  emailConfirmed?: boolean;
}

export interface AuthResponse {
  user: User | null;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

class AuthService {
  private isSupabaseAvailable(): boolean {
    return import.meta.env.VITE_SUPABASE_URL && 
           import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co' &&
           import.meta.env.VITE_SUPABASE_ANON_KEY && 
           import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key';
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Check if email confirmation is required
          const emailConfirmed = data.user.email_confirmed_at !== null;
          
          const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.email?.split('@')[0] || 'User',
            emailConfirmed,
          };
          
          if (!emailConfirmed) {
            return { 
              user: null, 
              requiresEmailConfirmation: true,
              error: 'Please check your email and confirm your account before signing in.'
            };
          }
          
          return { user };
        }
        return { user: null };
      } catch (error) {
        return { 
          user: null, 
          error: error instanceof Error ? error.message : 'Signup failed' 
        };
      }
    } else {
      // Mock authentication for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = {
        id: 'dev-user-' + Date.now(),
        email,
        name: email.split('@')[0],
        emailConfirmed: true, // Mock users are automatically confirmed
      };
      localStorage.setItem('dev-user', JSON.stringify(user));
      return { user };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Check if email is confirmed
          const emailConfirmed = data.user.email_confirmed_at !== null;
          
          if (!emailConfirmed) {
            return { 
              user: null, 
              requiresEmailConfirmation: true,
              error: 'Please confirm your email before signing in.'
            };
          }
          
          const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.email?.split('@')[0] || 'User',
            emailConfirmed,
          };
          return { user };
        }
        return { user: null };
      } catch (error) {
        return { 
          user: null, 
          error: error instanceof Error ? error.message : 'Sign in failed' 
        };
      }
    } else {
      // Mock authentication for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = {
        id: 'dev-user-' + Date.now(),
        email,
        name: email.split('@')[0],
        emailConfirmed: true, // Mock users are automatically confirmed
      };
      localStorage.setItem('dev-user', JSON.stringify(user));
      return { user };
    }
  }

  async signOut(): Promise<AuthResponse> {
    if (this.isSupabaseAvailable()) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { user: null };
      } catch (error) {
        return { 
          user: null, 
          error: error instanceof Error ? error.message : 'Sign out failed' 
        };
      }
    } else {
      // Mock sign out for development
      localStorage.removeItem('dev-user');
      return { user: null };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const emailConfirmed = user.email_confirmed_at !== null;
          
          // Only return user if email is confirmed
          if (!emailConfirmed) {
            return null;
          }
          
          return {
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'User',
            emailConfirmed,
          };
        }
        return null;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    } else {
      // Mock user for development
      const storedUser = localStorage.getItem('dev-user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
  }

  async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    if (this.isSupabaseAvailable()) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
        });
        
        if (error) throw error;
        
        return { 
          user: null,
          error: 'Confirmation email sent. Please check your inbox.'
        };
      } catch (error) {
        return { 
          user: null, 
          error: error instanceof Error ? error.message : 'Failed to resend confirmation email' 
        };
      }
    } else {
      // Mock resend for development
      return { 
        user: null,
        error: 'Mock confirmation email sent. Please check your inbox.'
      };
    }
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    if (this.isSupabaseAvailable()) {
      return supabase.auth.onAuthStateChange(callback);
    } else {
      // Mock auth state change for development
      const checkUser = () => {
        const user = localStorage.getItem('dev-user');
        if (user) {
          callback('SIGNED_IN', { user: JSON.parse(user) });
        } else {
          callback('SIGNED_OUT', null);
        }
      };
      
      // Check initial state
      checkUser();
      
      // Listen for storage changes
      window.addEventListener('storage', checkUser);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener('storage', checkUser);
            }
          }
        }
      };
    }
  }
}

export const authService = new AuthService(); 