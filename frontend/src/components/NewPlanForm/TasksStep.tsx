import { Priority, TaskInput } from "@/api/types";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import ItemCard from "./ItemCard";
import useNewItem from "./hooks/use-new-item";
import ItemForm from "./ItemForm";

interface TasksStepProps {
    tasks: TaskInput[];
    onUpdate: (tasks: TaskInput[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const TasksStep: React.FC<TasksStepProps> = ({
    tasks,
    onUpdate,
    onNext,
    onBack,
}) => {
    const [newTask, setNewTask] = useState<TaskInput>({
        title: "",
        description: "",
        requiredTime: 30,
        priority: Priority.NORMAL,
        isBreakable: true,
    });
    const [errors, setErrors] = useState<{
        title?: string;
        requiredTime?: string;
        tasks?: string;
    }>({});

    const createDefaultTask = (): TaskInput => ({
        title: "",
        description: "",
        requiredTime: 30,
        priority: Priority.NORMAL,
        isBreakable: true,
    });

    const { handleAddItem, handleRemoveItem, handleMoveItem } = useNewItem({
        items: tasks,
        newItem: newTask,
        setNewItem: setNewTask,
        onUpdate,
        setErrors,
        createDefaultItem: createDefaultTask,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one task
        if (tasks.length === 0) {
            setErrors({
                ...errors,
                tasks: "Please add at least one task",
            });
            return;
        }

        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task list */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Tasks</h3>
                    <span className="text-sm text-muted-foreground">
                        {tasks.length} task{tasks.length !== 1 && "s"}
                    </span>
                </div>

                {tasks.length === 0 ? (
                    <div className="border border-dashed rounded-3xl p-6 text-center bg-gray-50">
                        <p className="text-muted-foreground">
                            No tasks added yet. Add your first task below.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task, index) => (
                            <ItemCard
                                key={index} // TODO: index
                                item={task}
                                itemsLength={tasks.length}
                                index={index}
                                handleMoveItem={handleMoveItem}
                                handleRemoveItem={handleRemoveItem}
                            />
                        ))}
                    </div>
                )}

                {errors.tasks && (
                    <p className="text-sm text-red-500">{errors.tasks}</p>
                )}
            </div>

            {/* Add new task form */}
            <ItemForm
                newItem={newTask}
                setNewItem={setNewTask}
                errors={errors}
                setErrors={setErrors}
                handleAddItem={handleAddItem}
                itemTypeName="Task"
            />

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back to Details
                </Button>
                <Button type="submit" className="btn-primary">
                    Continue to Routines
                </Button>
            </div>
        </form>
    );
};

export default TasksStep;
