import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from './env'

export function createAdminClient() {
  const { url } = getSupabasePublicEnv()
  const serviceKey = getSupabaseServiceRoleKey()

  return createSupabaseClient(url, serviceKey);
}
