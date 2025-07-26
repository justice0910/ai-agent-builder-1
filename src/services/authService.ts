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
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Using Supabase for signup');
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
      console.error('❌ Supabase signup error:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Using Supabase for signin');
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
        console.log('✅ Supabase signin successful:', user);
        return { user };
      }
      return { user: null };
    } catch (error) {
      console.error('❌ Supabase signin error:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    }
  }

  async signOut(): Promise<AuthResponse> {
    try {
      console.log('🚪 Using Supabase for signout');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Supabase signout successful');
      return { user: null };
    } catch (error) {
      console.error('❌ Supabase signout error:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('🔍 Getting current user from Supabase');
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('❌ Error getting session:', sessionError);
        return null;
      }
      
      if (!session) {
        console.log('ℹ️ No active Supabase session found');
        return null;
      }
      
      console.log('✅ Supabase session found, checking user...');
      
      // Get user from session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('❌ Error getting user:', userError);
        return null;
      }
      
      if (user) {
        const emailConfirmed = user.email_confirmed_at !== null;
        
        // Only return user if email is confirmed
        if (!emailConfirmed) {
          console.log('⚠️ User email not confirmed, returning null');
          return null;
        }
        
        const userData = {
          id: user.id,
          email: user.email || '',
          name: user.email?.split('@')[0] || 'User',
          emailConfirmed,
        };
        console.log('✅ Current Supabase user found:', userData);
        return userData;
      }
      console.log('ℹ️ No Supabase user found');
      return null;
    } catch (error) {
      console.error('❌ Error getting current Supabase user:', error);
      return null;
    }
  }

  async resendConfirmationEmail(email: string): Promise<AuthResponse> {
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
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    console.log('🔧 Setting up Supabase auth state listener');
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService(); 