import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

console.log('🔧 Supabase client initialized with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase-auth-token',
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-agent-builder'
    }
  }
})

// Enhanced session persistence check
if (typeof window !== 'undefined') {
  // Check for existing session on page load
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      console.log('🔍 Found existing session on page load');
      console.log('📅 Session expires at:', new Date(session.expires_at! * 1000));
    } else {
      console.log('ℹ️ No existing session found on page load');
    }
  });

  // Listen for token refresh events
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED' && session) {
      console.log('🔄 Token refreshed successfully');
      console.log('📅 New session expires at:', new Date(session.expires_at! * 1000));
    }
  });
}
