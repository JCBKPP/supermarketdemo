import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants.tsx';

// Initialize Supabase client
// If keys are missing, the client will still initialize but requests will fail gracefully
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const authService = {
  signInWithGitHub: async () => {
    if (!supabase) {
      alert("Supabase is not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to constants.tsx");
      return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
    
    if (error) throw error;
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
};