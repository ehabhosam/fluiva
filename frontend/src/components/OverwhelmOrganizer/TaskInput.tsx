import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { forwardRef } from "react";

interface TaskInputProps {
  taskText: string;
  taskHours: number;
  onTaskTextChange: (value: string) => void;
  onTaskHoursChange: (hours: number) => void;
  onAddTask: () => void;
}

const TaskInput = forwardRef<HTMLDivElement, TaskInputProps>(
  ({ taskText, taskHours, onTaskTextChange, onTaskHoursChange, onAddTask }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <Card className="shadow-lg border-2 border-plansync-purple-200">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="What do you need to do?"
                  value={taskText}
                  onChange={(e) => onTaskTextChange(e.target.value)}
                  className="border-2 focus:border-plansync-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && taskText.trim() !== "") {
                      onAddTask();
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 min-w-20">
                <button
                  type="button"
                  onClick={() => taskHours > 1 && onTaskHoursChange(taskHours - 1)}
                  className="text-gray-500 hover:text-plansync-purple-700 px-2 py-1"
                >
                  -
                </button>
                <span className="min-w-8 text-center">{taskHours}h</span>
                <button
                  type="button"
                  onClick={() => onTaskHoursChange(taskHours + 1)}
                  className="text-gray-500 hover:text-plansync-purple-700 px-2 py-1"
                >
                  +
                </button>
              </div>
              <Button
                onClick={onAddTask}
                className="gradient-bg"
                disabled={!taskText.trim() || taskHours <= 0}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

TaskInput.displayName = "TaskInput";

export default TaskInput;
