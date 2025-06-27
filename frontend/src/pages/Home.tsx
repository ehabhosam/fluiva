import { planApi } from "@/api/plan";
import { PlanSummary, PlanType } from "@/api/types";
import AuthGuard from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PlanTypeIcon = ({ type }: { type: PlanType }) => {
  switch (type) {
    case PlanType.DAILY:
      return (
        <div className="rounded-full p-2 bg-plansync-purple-100 text-plansync-purple-600">
          D
        </div>
      );
    case PlanType.WEEKLY:
      return (
        <div className="rounded-full p-2 bg-plansync-teal-100 text-plansync-teal-600">
          W
        </div>
      );
    case PlanType.MONTHLY:
      return (
        <div className="rounded-full p-2 bg-blue-100 text-blue-600">M</div>
      );
  }
};

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

  console.log(error);

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-plansync-purple-900">
                My Plans
              </h1>
              <p className="text-muted-foreground">
                View and manage all your productivity plans
              </p>
            </div>
            <Link to="/plans/new">
              <Button className="gradient-bg">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
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
          ) : plans.length === 0 ? (
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
              {plans.map((plan) => (
                <Link key={plan.id} to={`/plans/${plan.id}`}>
                  <Card className="h-full card-hover overflow-hidden">
                    <div
                      className={`h-2 ${
                        plan.type === PlanType.DAILY
                          ? "gradient-bg"
                          : plan.type === PlanType.WEEKLY
                            ? "gradient-bg-teal"
                            : "bg-blue-600"
                      }`}
                    ></div>
                    <CardHeader className="flex flex-row items-center gap-3">
                      <PlanTypeIcon type={plan.type} />
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {plan.type.toLowerCase()} plan
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(parseISO(plan.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {plan._count.todos} items • {plan._count.periods}{" "}
                            periods
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default Home;
