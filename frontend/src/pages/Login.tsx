
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user was redirected from OAuth
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Welcome to PlanSync!",
          description: "You have successfully signed in",
        });
        navigate('/');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // The page will be redirected to Google's OAuth page
      // After successful authentication, the user will be redirected back
      // and the onAuthStateChange listener above will handle the success case
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Authentication error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-plansync-purple-100 to-plansync-teal-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-5 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">PS</span>
            </div>
            <h2 className="text-4xl font-bold text-plansync-purple-900 tracking-tight">
              PlanSync
            </h2>
            <p className="mt-3 text-plansync-purple-700">
              Optimize your day, maximize your productivity
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-center">Sign in to your account</h3>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39904 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#1976D2"
                  />
                </svg>
                <span className="text-gray-700">
                  {isLoading ? "Signing in..." : "Sign in with Google"}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to PlanSync's Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center space-y-6">
          <div>
            <h3 className="text-xl font-bold text-plansync-purple-700">Organize your workflow</h3>
            <p className="mt-2 text-plansync-purple-600">
              Create daily, weekly, and monthly plans that work for you
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-plansync-teal-700">Visualize your time</h3>
            <p className="mt-2 text-plansync-teal-600">
              See how your tasks and routines fit together perfectly
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-plansync-purple-700">Stay flexible</h3>
            <p className="mt-2 text-plansync-purple-600">
              Easily adjust your plans with drag-and-drop simplicity
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Login;
