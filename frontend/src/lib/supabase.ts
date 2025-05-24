import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from "@/config/constants";
import { createClient } from "@supabase/supabase-js";

// These environment variables will need to be set in .env.local
const supabaseUrl = VITE_SUPABASE_URL;
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL or Anon Key is missing. Make sure to define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.",
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
