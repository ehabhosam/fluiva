
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-7 h-7">
                <img 
                  src="/assets/logo.png"
                  width='100%'
                  height='100%'
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
                    {user.name || user.email.split('@')[0]}
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
      <main className="container px-4 py-6 mx-auto">
        {children}
      </main>
      
      {/* Bottom Navigation (mobile) */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <div className="bg-white border-t border-gray-200">
            <div className="flex items-center justify-around h-16">
              <Link 
                to="/" 
                className={`flex flex-col items-center justify-center w-full py-2 ${
                  location.pathname === "/" ? "text-plansync-purple-600" : "text-gray-500"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link 
                to="/plans/new" 
                className={`flex flex-col items-center justify-center w-full py-2 ${
                  location.pathname === "/plans/new" ? "text-plansync-purple-600" : "text-gray-500"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="text-xs mt-1">New Plan</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
