import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Detect if keys are default placeholders or missing
export const isMockMode =
  !supabaseUrl ||
  supabaseUrl.includes('your-project-id') ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes('your-supabase-anon-public-key');

if (isMockMode) {
  console.warn(
    'Supabase credentials are not configured. The portfolio is running in Mock Mode using local data.'
  );
}

// Initializing the Supabase client
// Falls back to placeholder strings in mock mode to prevent library runtime crashes
export const supabase = createClient(
  isMockMode ? 'https://placeholder-project-id.supabase.co' : supabaseUrl,
  isMockMode ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key' : supabaseAnonKey
);
