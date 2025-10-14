import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

/**
 * Auth guard component to protect routes
 * @param requireAuth - If true, redirect to login if user is not authenticated
 *                     If false, redirect to home if user is authenticated
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    requireAuth = true,
}) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !user) {
                // Redirect to login if authentication is required but user is not logged in
                navigate("/login", { replace: true });
            } else if (!requireAuth && user) {
                // Redirect to home if authentication is not required but user is logged in
                navigate("/", { replace: true });
            }
        }
    }, [user, loading, requireAuth, navigate, location]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse-gentle text-lg font-medium text-Fluiva-purple-600">
                    Loading...
                </div>
            </div>
        );
    }

    // Render children only if authentication check passes
    if ((requireAuth && user) || (!requireAuth && !user)) {
        return <>{children}</>;
    }

    // Return null during redirect
    return null;
};

export default AuthGuard;
