import { createClient } from '@supabase/supabase-js'

let supabaseClient

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const invalidUrl = !supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL'
  const invalidKey = !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY'

  if (invalidUrl || invalidKey) {
    throw new Error(
      'Supabase is not configured. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
    )
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })

  return supabaseClient
}