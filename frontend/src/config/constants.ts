console.log("[frontend constants]: Final values:");
console.log(
  "[frontend constants]: VITE_API_URL =",
  import.meta.env.VITE_API_URL,
);
console.log(
  "[frontend constants]: VITE_SUPABASE_URL =",
  import.meta.env.VITE_SUPABASE_URL,
);
console.log(
  "[frontend constants]: VITE_SUPABASE_ANON_KEY =",
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// export const VITE_API_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:3000";
export const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
export const VITE_SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://your-supabase-url.supabase.co";
export const VITE_SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";
