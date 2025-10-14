import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

export default function UserClickableAvatar() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of Fluiva",
            });
        } catch (error) {
            toast({
                title: "Error signing out",
                description: "There was a problem signing you out",
                variant: "destructive",
            });
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="relative border-2 border-white rounded-full p-[0.1rem]">
            <input
                type="checkbox"
                id="user-menu-toggle"
                className="hidden peer"
            />
            <label
                htmlFor="user-menu-toggle"
                className="w-8 h-8 rounded-full bg-Fluiva-purple-600 flex items-center justify-center text-white font-medium text-sm hover:bg-Fluiva-purple-700 transition-colors cursor-pointer"
            >
                {user.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </label>

            {/* close on click outside the menu */}
            <label
                htmlFor="user-menu-toggle"
                className="fixed inset-0 z-10 hidden peer-checked:block cursor-default"
            />

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-20 hidden peer-checked:block">
                <div className="px-3 py-2 text-sm text-muted-foreground border-b border-gray-100">
                    <span>Hello,</span>
                    <span className="font-medium text-foreground ml-1">
                        {user.name || user.email.split("@")[0]}.
                    </span>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
