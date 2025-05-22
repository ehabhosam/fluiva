import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import TestApiResponse from "./TestApiResponse";

function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setToken(data.session?.access_token ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        console.log({
          user: session?.user,
          accessToken: session?.access_token,
        });
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!user ? (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
            borderRadius: "1rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "2rem 1.5rem",
            maxWidth: "320px",
            margin: "2rem auto",
          }}
        >
          <img
            src={
              user.user_metadata?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  user.email ||
                  "User",
              )}&background=0D8ABC&color=fff&size=128`
            }
            alt="User avatar"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "1rem",
              border: "3px solid #3b82f6",
              background: "#fff",
            }}
          />
          <h2
            style={{
              margin: "0 0 0.25rem 0",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            {user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              "User"}
          </h2>
          <p
            style={{
              margin: "0 0 1.25rem 0",
              color: "#64748b",
              fontSize: "1rem",
              wordBreak: "break-all",
            }}
          >
            {user.email}
          </p>
          <button
            onClick={signOut}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
              transition: "background 0.2s",
            }}
          >
            Sign out
          </button>
        </div>
      )}
      <TestApiResponse token={token} />
    </>
  );
}

export default App;
