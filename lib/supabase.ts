import { auth } from "@clerk/nextjs/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and your publishable/anon key.",
    );
  }

  return { url, key };
}

/** Public reads (RLS policies allow select). Safe during static generation. */
export const createSupabaseAnonClient = (): SupabaseClient => {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key);
};

/** Inserts/updates that require the Clerk JWT (template: supabase). */
export const createSupabaseClient = (): SupabaseClient => {
  const { url, key } = getSupabaseConfig();

  return createClient(url, key, {
    async accessToken() {
      return (await auth()).getToken({ template: "supabase" });
    },
  });
};
