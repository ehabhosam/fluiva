import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NewPlan from "@/pages/NewPlan";
import NotFound from "@/pages/NotFound";
import OverwhelmOrganizer from "@/pages/OverwhelmOrganizer";
import PlanDetail from "@/pages/PlanDetail";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/plans/new" element={<NewPlan />} />
                <Route path="/plans/:id" element={<PlanDetail />} />
                <Route
                    path="/overwhelm-organizer"
                    element={<OverwhelmOrganizer />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
