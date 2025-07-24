import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewPlanCard() {
    return <Link to="/plans/new" className="h-full">
        <Card className="flex flex-col items-center justify-center p-6 bg-white border-2 border-dashed border-gray-200 cursor-pointer hover:border-plansync-purple-300 hover:bg-gray-50 transition-colors h-full">
            <PlusCircle className="w-12 h-12 mb-2 text-plansync-purple-600" />
            <h3 className="text-lg font-lilita-one text-plansync-purple-900">
                Create New Plan
            </h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
                Add a new productivity plan to your collection
            </p>
        </Card>
    </Link>
}