import { Period, PlanDetail, Todo } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PlanChartProps {
  plan: PlanDetail;
  onPeriodClick: (periodId: number) => void;
  activePeriod: number | null;
}

interface ChartData {
  name: string;
  total: number;
  completed: number;
  periodId: number;
}

const PlanChart: React.FC<PlanChartProps> = ({
  plan,
  onPeriodClick,
  activePeriod,
}) => {
  const chartData: ChartData[] = useMemo(() => {
    if (!plan.periods) return [];

    return plan.periods.map((period) => {
      const totalTime = calculatePeriodTime(period);
      const completedTime = calculateCompletedTime(period);

      return {
        name: `Period ${period.index + 1}`,
        total: totalTime,
        completed: completedTime,
        periodId: period.id,
      };
    });
  }, [plan]);

  function calculatePeriodTime(period: Period): number {
    if (!period.blocks) return 0;

    return period.blocks.reduce((total, block) => {
      const todo = block.todo as Todo;
      return total + (todo ? todo.required_time : 0);
    }, 0);
  }

  function calculateCompletedTime(period: Period): number {
    if (!period.blocks) return 0;

    return period.blocks.reduce((total, block) => {
      if (block.done_at === null) return total;
      const todo = block.todo as Todo;
      return total + (todo ? todo.required_time : 0);
    }, 0);
  }

  const handleBarClick = (data: any) => {
    const { periodId } = data;
    onPeriodClick(periodId);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalTime = data.total;
      const completedTime = data.completed;
      const completionPercentage =
        Math.round((completedTime / totalTime) * 100) || 0;

      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Total time: {totalTime} minutes
          </p>
          <p className="text-sm text-muted-foreground">
            Completed: {completedTime} minutes ({completionPercentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Plan Progress Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                unit=" min"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                fill="#e2e8f0"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.periodId === activePeriod ? "#7C3AED" : "#e2e8f0"
                    }
                  />
                ))}
              </Bar>
              <Bar
                dataKey="completed"
                fill="#14B8A6"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center mt-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#e2e8f0]"></div>
            <span className="text-sm text-muted-foreground">Total Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#14B8A6]"></div>
            <span className="text-sm text-muted-foreground">
              Completed Time
            </span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Click on a bar to view the corresponding period
        </p>
      </CardContent>
    </Card>
  );
};

export default PlanChart;
