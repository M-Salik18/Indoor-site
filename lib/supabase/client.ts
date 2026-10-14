import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for use in browser/client components.
 * 
 * Uses createBrowserClient from @supabase/ssr which manages auth session
 * tokens in browser cookies instead of localStorage, allowing the server
 * to read the session on subsequent requests.
 */
export function createClient<Database = any>(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseKey) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
