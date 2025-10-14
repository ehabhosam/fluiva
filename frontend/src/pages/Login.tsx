import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";

const Login = () => {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user was redirected from OAuth
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN" && session) {
                    toast({
                        title: "Welcome to Fluiva!",
                        description: "You have successfully in!",
                    });
                    navigate("/");
                }
            },
        );

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
            <div className='min-h-screen relative bg-[url("assets/bg.png")] bg-no-repeat bg-cover bg-center flex items-center justify-center p-4'>
                {/* Liquid Glass Floating Square */}
                <div className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2.5rem] shadow-2xl p-8 space-y-2 lg:space-y-4">
                    {/* Logo and Branding */}
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 mb-5 rounded-xl flex items-center justify-center">
                            <img
                                src="/assets/logo.png"
                                width="100%"
                                height="100%"
                                alt="Fluiva Logo"
                            />
                        </div>
                        <h2 className="text-4xl font-bold text-neutral-700 tracking-tight drop-shadow-lg">
                            Fluiva
                        </h2>
                        <p className="mt-3 text-indigo-600 drop-shadow">
                            Organize Your Future, Effortlessly.
                        </p>
                    </div>

                    {/* Login Content */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-medium text-center text-neutral-600">
                            Join Fluiva to start Planning!
                        </h3>

                        <LoginWithGoogleButton
                            handleLogin={handleGoogleLogin}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Terms */}
                    <div className="text-center text-[0.45rem] lg:text-[0.6rem] text-neutral-800/70">
                        <p>
                            By signing in, you agree to Fluiva's Terms of
                            Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
};

export default Login;
