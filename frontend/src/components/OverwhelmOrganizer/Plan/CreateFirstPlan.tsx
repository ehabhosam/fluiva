import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateFirstPlan() {
    return (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="w-16 h-16 mb-4 rounded-full gradient-bg flex items-center justify-center">
                <PlusCircle className="w-20 h-20 text-Fluiva-purple" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No plans yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
                Create your first plan to start organizing your tasks and
                routines effectively
            </p>
            <Link to="/plans/new">
                <Button className="gradient-bg">Create Your First Plan</Button>
            </Link>
        </div>
    );
}
