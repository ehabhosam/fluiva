import userApi from "@/api/user";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create authentication context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Transform Supabase user data to our app's user format
  const transformUser = (session: Session | null): User | null => {
    if (!session?.user) return null;

    const supaUser = session.user;
    return {
      id: supaUser.id,
      email: supaUser.email || "",
      name: supaUser.user_metadata?.full_name,
      avatar_url: supaUser.user_metadata?.avatar_url,
    };
  };

  useEffect(() => {
    // Set up initial session
    const setupUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(transformUser(session));
      setLoading(false);
    };

    setupUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(transformUser(session));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Separate effect to handle user upsert when user changes
  useEffect(() => {
    const handleUserUpsert = async () => {
      if (user && !loading) {
        try {
          await userApi.upsertUser();
        } catch (error) {
          console.error("Error upserting user:", error);
        }
      }
    };

    handleUserUpsert();
  }, [user, loading]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
