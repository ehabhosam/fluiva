import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Home, LogOut, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of PlanSync",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(30deg,rgba(221,214,254,0.8),rgba(237,221,83,0)100%)] font-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-7 h-7">
                <img
                  src="/assets/logo.png"
                  width="100%"
                  height="100%"
                  className="scale-150"
                  alt="PlanSync Logo"
                />
              </span>
              <h1 className="text-xl font-bold text-plansync-purple-900">
                PlanSync
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Hello,</span>
                  <span className="font-medium text-foreground">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto flex-grow">{children}</main>

      {/* Bottom Navigation (mobile) */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <div className="bg-white border-t border-gray-200">
            <div className="flex items-center justify-around h-16">
              <Link
                to="/"
                className={`flex flex-col items-center justify-center w-full py-2 ${
                  location.pathname === "/"
                    ? "text-plansync-purple-600"
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
                    ? "text-plansync-purple-600"
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
      <footer className="py-6 bg-white border-t border-gray-200 mt-auto">
        <div className="container px-4 mx-auto text-center">
          <div className="mb-2">
            <span className="text-plansync-purple-900 font-bold">PlanSync</span>
            <span className="text-gray-600"> - Your Personal Productivity Companion</span>
          </div>
          <div className="text-sm text-gray-500">
            Developed with ❤️ by{" "}
            <a
              href="https://github.com/ehabhosam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plansync-purple-600 hover:underline"
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
