import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If user is authenticated, redirect to home
        // If not, redirect to login
        if (!loading) {
            if (user) {
                navigate("/", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        }
    }, [user, loading, navigate]);

    // Render a loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br">
            <div className="text-center">
                <div className="w-16 h-16 mb-8 rounded-xl gradient-bg mx-auto flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">PS</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-Fluiva-purple-900">
                    Fluiva
                </h1>
                <div className="animate-pulse">
                    <p className="text-Fluiva-purple-700">
                        Loading your productivity journey...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Index;
