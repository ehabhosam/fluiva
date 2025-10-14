import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAutoFocus from "@/hooks/use-auto-focus";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { forwardRef, useEffect, useRef } from "react";

interface TaskInputProps {
    taskText: string;
    taskHours: number;
    onTaskTextChange: (value: string) => void;
    onTaskHoursChange: (hours: number) => void;
    onAddTask: () => void;
    shouldFocus: boolean;
}

const TaskInput = forwardRef<HTMLDivElement, TaskInputProps>(
    (
        {
            taskText,
            taskHours,
            onTaskTextChange,
            onTaskHoursChange,
            onAddTask,
            shouldFocus,
        },
        ref,
    ) => {
        const inputRef = useRef(null);

        // auto focus input on char click
        useAutoFocus(inputRef, shouldFocus);

        // clicking up and down on hours should increment/decrement hours
        const handleHoursKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                onTaskHoursChange(taskHours + 1);
            } else if (e.key === "ArrowDown" && taskHours > 1) {
                onTaskHoursChange(taskHours - 1);
            }
        };

        useEffect(() => {
            window.addEventListener("keydown", handleHoursKeyDown);
            return () =>
                window.removeEventListener("keydown", handleHoursKeyDown);
        }, [taskHours]);

        return (
            <motion.div
                ref={ref}
                className="fixed bottom-16 md:bottom-10 left-0 right-0 mx-auto w-full max-w-lg px-4 z-50"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
            >
                <Card className="shadow-lg border-2 border-Fluiva-purple-200 floating-card">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="What do you need to do?"
                                    value={taskText}
                                    onChange={(e) =>
                                        onTaskTextChange(e.target.value)
                                    }
                                    className="border-2"
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            taskText.trim() !== ""
                                        ) {
                                            onAddTask();
                                        }
                                    }}
                                    ref={inputRef}
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center justify-center gap-2 min-w-20 my-2 sm:my-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            taskHours > 1 &&
                                            onTaskHoursChange(taskHours - 1)
                                        }
                                        className="text-gray-500 hover:text-Fluiva-purple-700 px-2 py-1"
                                    >
                                        -
                                    </button>
                                    <span className="min-w-8 text-center">
                                        {taskHours}h
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onTaskHoursChange(taskHours + 1)
                                        }
                                        className="text-gray-500 hover:text-Fluiva-purple-700 px-2 py-1"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-[0.6rem] text-muted-foreground w-full text-center hidden md:block">
                                    use up/down arrows
                                </span>
                            </div>
                            <Button
                                onClick={onAddTask}
                                className="gradient-bg w-full sm:w-auto"
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
    },
);

TaskInput.displayName = "TaskInput";

export default TaskInput;
