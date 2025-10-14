import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Home, LogOut, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useState } from "react";
import UserClickableAvatar from "./UserClickableAvatar";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-[linear-gradient(30deg,rgba(221,214,254,0.8),rgba(237,221,83,0)100%)] font-primary">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-header-gradient">
                <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="w-7 h-7">
                                <Logo white />
                            </span>
                            <h1 className="text-xl font-bold text-white">
                                Fluiva
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <UserClickableAvatar />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container px-4 py-6 mx-auto flex-grow">
                {children}
            </main>

            {/* Bottom Navigation (mobile) */}
            {false && (
                <div className="fixed bottom-0 left-0 right-0 md:hidden">
                    <div className="bg-white border-t border-gray-200">
                        <div className="flex items-center justify-around h-16">
                            <Link
                                to="/"
                                className={`flex flex-col items-center justify-center w-full py-2 ${
                                    location.pathname === "/"
                                        ? "text-Fluiva-purple-600"
                                        : "text-gray-500"
                                }`}
                            >
                                <Home className="w-5 h-5" />
                                <span className="text-xs mt-1">Home</span>
                            </Link>
                            <Link
                                to="/plans/new"
                                className={`flex flex-col items-center justify-center w-full py-2 ${
                                    location.pathname === "/plans/new"
                                        ? "text-Fluiva-purple-600"
                                        : "text-gray-500"
                                }`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span className="text-xs mt-1">New Plan</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="py-6 bg-Fluiva-purple-950 border-t border-gray-800 mt-auto">
                <div className="container px-4 mx-auto text-center">
                    <div className="mb-2">
                        <span className="text-Fluiva-purple-100 font-bold">
                            Fluiva
                        </span>
                        <span className="text-gray-400">
                            {" "}
                            - Your Personal Productivity Companion
                        </span>
                    </div>
                    <div className="text-sm text-gray-400">
                        Developed with ❤️ by{" "}
                        <a
                            href="https://github.com/ehabhosam"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-Fluiva-purple-400 hover:underline"
                        >
                            @ehabhosam
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
