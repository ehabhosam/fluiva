import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewPlanCard() {
    return (
        <Link to="/plans/new" className="h-full">
            <Card className="flex flex-col items-center justify-center p-6 bg-card-new border-0 cursor-pointer scale-90 hover:scale-100 transition-all duration-200 h-full rounded-2xl shadow-lg">
                <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center">
                    <Plus className="w-10 h-10 text-Fluiva-blue" />
                </div>
                <h3 className="text-2xl font-lilita-one text-white">
                    New Plan
                </h3>
            </Card>
        </Link>
    );
}
