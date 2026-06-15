import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type { SupabaseClient };

export function createSupabaseClient(
  url: string,
  anonKey: string,
  options?: Parameters<typeof createClient>[2]
): SupabaseClient {
  return createClient(url, anonKey, options);
}
