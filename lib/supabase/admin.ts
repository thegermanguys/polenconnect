// Privileged Supabase client using the SERVICE ROLE key. This bypasses Row
// Level Security entirely, so it can read pending/rejected rows and write to
// any table regardless of the RLS policies in supabase/schema.sql.
//
// SERVER-ONLY. Never import this file from a "use client" component, and
// never send SUPABASE_SERVICE_ROLE_KEY to the browser. It's only ever read
// here, from process.env, on the server. This client is meant to be used
// exclusively inside Server Actions (see app/admin/actions.ts,
// app/submit/actions.ts) and admin-only data loaders (lib/admin/queries.ts).
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. " +
        "Set both in .env.local (see .env.example)."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
