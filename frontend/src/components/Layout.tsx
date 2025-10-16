import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import UserClickableAvatar from "./UserClickableAvatar";

interface LayoutProps {
    children: React.ReactNode;
    header?: boolean;
    footer?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    header = true,
    footer = true,
}) => {
    return (
        <div className="min-h-screen flex flex-col bg-background font-primary">
            {/* Header */}
            {header && (
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
            )}

            {/* Main Content */}
            <main className="container px-4 py-6 mx-auto flex-grow">
                {children}
            </main>

            {/* Desktop Footer */}

            {footer && (
                <footer className="bg-header-gradient border-t border-white/10 mt-auto">
                    <div className="container px-4 py-8 mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Logo and Brand */}
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6">
                                    <Logo white />
                                </span>
                                <span className="text-lg font-bold text-white">
                                    Fluiva
                                </span>
                            </div>

                            {/* Copyright */}
                            <div className="text-sm text-white/60">
                                © 2025 Fluiva. All rights reserved.
                            </div>

                            {/* Links */}
                            <nav className="flex items-center gap-6">
                                <a
                                    href="https://github.com/ehabhosam/fluiva"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white text-sm transition-colors"
                                >
                                    Source Code
                                </a>
                                <a
                                    href="https://ehabhosam.netlify.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white text-sm transition-colors"
                                >
                                    Developer
                                </a>
                            </nav>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
