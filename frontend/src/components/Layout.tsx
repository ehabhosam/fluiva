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
            )}
        </div>
    );
};

export default Layout;
