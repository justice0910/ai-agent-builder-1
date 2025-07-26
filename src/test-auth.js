// Test script to verify authentication flow
// Run this in browser console

console.log('🔍 Testing Authentication Configuration...');

// Check environment variables
console.log('Environment Variables:');
console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

// Test Supabase client
import { supabase } from './lib/supabaseClient.js';

async function testAuth() {
  console.log('\n🔐 Testing Supabase Auth...');
  
  try {
    // Test current session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ Auth error:', error.message);
    } else if (user) {
      console.log('✅ User session found:', user.email);
    } else {
      console.log('ℹ️ No active session (this is normal for new users)');
    }
    
    // Test auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
    });
    
    console.log('✅ Auth state listener set up');
    
  } catch (error) {
    console.log('❌ Auth test failed:', error.message);
  }
}

testAuth(); 