import { planApi } from "@/api/plan";
import { PlanType } from "@/api/types";
import AuthGuard from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import OverwhelmedPopCard from "@/components/OverwhelmOrganizer/OverwhelmedPopCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle, Calendar, Clock, List, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  // Fetch user plans
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: planApi.getUserPlans,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <OverwhelmedPopCard />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-plansync-purple-900 font-lilita-one">
                My Plans
              </h1>
              <p className="text-muted-foreground">
                View and manage all your productivity plans
              </p>
            </div>
            <Link to="/plans/new">
              <Button className="gradient-bg">New Plan <ArrowRightCircle className="w-4 h-4" /></Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-gray-100"></CardHeader>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">Failed to load plans</div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : plans?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="w-16 h-16 mb-4 rounded-full gradient-bg flex items-center justify-center">
                <PlusCircle className="w-8 h-8 text-white" />
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans?.map((plan) => (
                <Link key={plan.id} to={`/plans/${plan.id}`} className="h-full">
                  <Card className="relative p-4 rounded-xl shadow-sm border border-purple-100 bg-[linear-gradient(135deg,rgba(128,90,213,0.09),rgba(168,85,247,0.03))] hover:shadow-md transition-all h-full">
                    <div className="text-xs font-semibold text-purple-600 uppercase mb-2 tracking-wider">
                      {plan.type}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {plan.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {plan.description || "No description provided."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-gray-500 flex justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(plan.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <List size={14} /> {plan._count.todos} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {plan._count.periods} periods
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
              <Link to="/plans/new" className="h-full">
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
            </div>
          )}
          
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default Home;
