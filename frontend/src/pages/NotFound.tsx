import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname,
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br">
            <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl gradient-bg mx-auto flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">404</span>
                </div>
                <h1 className="text-3xl font-bold text-Fluiva-purple-900">
                    Page not found
                </h1>
                <p className="text-Fluiva-purple-700 max-w-md mx-auto">
                    The page you are looking for doesn't exist or has been
                    moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
