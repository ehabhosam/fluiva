import { Layout } from "@/components/Layout";
import ConfirmationPopup from "@/components/OverwhelmOrganizer/ConfirmationPopup";
import { LAYOUT } from "@/components/OverwhelmOrganizer/constants";
import { useOverwhelmFlow } from "@/components/OverwhelmOrganizer/hooks/useOverwhelmFlow";
import { useTaskDragging } from "@/components/OverwhelmOrganizer/hooks/useTaskDragging";
import { useTaskInput } from "@/components/OverwhelmOrganizer/hooks/useTaskInput";
import PlanCustomizationPopup from "@/components/OverwhelmOrganizer/PlanCustomizationPopup";
import TaskCard from "@/components/OverwhelmOrganizer/TaskCard";
import TaskInputComponent from "@/components/OverwhelmOrganizer/TaskInput";
import TimeConstraintsPopup from "@/components/OverwhelmOrganizer/TimeConstraintsPopup";
import { Button } from "@/components/ui/button";
import useTasks from "@/hooks/use-tasks";
import { mapTasksToTaskInputs } from "@/lib/overwhelm";
import React, { useRef } from "react";

const OverwhelmOrganizer: React.FC = () => {
    // Core task management
    const { tasks, addTask, updateTask, updateTasks, removeTask, clearTasks } =
        useTasks();

    // Custom hooks for different concerns
    const overwhelmFlow = useOverwhelmFlow(tasks);
    const taskDragging = useTaskDragging(tasks, updateTask, updateTasks);
    const taskInput = useTaskInput(tasks, addTask, updateTask);

    // Refs for DOM elements
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    // Handler for adding tasks
    const handleAddTask = () => {
        taskInput.handleAddTask(containerRef, inputRef);
    };

    return (
        <Layout footer={false}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-lilita-one bg-button-primary bg-clip-text text-transparent">
                            Overwhelm Organizer
                        </h1>
                        <p className="text-muted-foreground max-md:text-sm">
                            Visualize all your tasks to organize them.
                        </p>
                    </div>
                    {tasks.length > 0 && (
                        <div className="flex gap-5">
                            <Button
                                variant="outline"
                                onClick={clearTasks}
                                className="text-sm px-3 py-1 border border-red-300 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>

                <div
                    ref={containerRef}
                    className={`relative w-full !h-[70vh] bg-white/70 border-2 border-dashed border-gray-200 rounded-[2rem] overflow-hidden`}
                >
                    {/* Tasks */}
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={{
                                ...task,
                                position:
                                    taskDragging.dragPositionRef.current[
                                        task.id
                                    ] || task.position,
                            }}
                            containerRef={containerRef}
                            isSelected={taskDragging.currentTask === task.id}
                            onDragStart={taskDragging.handleDragStart}
                            onDrag={taskDragging.handleDrag}
                            onDragEnd={taskDragging.handleDragEnd}
                            dragElastic={0}
                            dragTransition={{ power: 0, timeConstant: 0 }}
                            onDelete={removeTask}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <img
                                src="assets/idea.png"
                                alt="No tasks"
                                className="w-32 mx-auto"
                            />
                            <p className="text-center text-muted-foreground mt-2">
                                Start clearing your mind ...
                            </p>
                        </div>
                    )}
                    <Button
                        onClick={overwhelmFlow.handleHandleTheMess}
                        disabled={
                            overwhelmFlow.isCreatingPlan || tasks.length === 0
                        }
                        className="absolute right-5 max-md:top-5 bottom-10 md:right-10 z-50"
                        // variant="p"
                    >
                        {overwhelmFlow.isCreatingPlan
                            ? "Creating Plan..."
                            : "Organize !"}
                    </Button>
                </div>

                {/* Spacer */}
                <div className="h-[10vh]"></div>

                {/* Task Input */}
                <TaskInputComponent
                    ref={inputRef}
                    taskText={taskInput.taskText}
                    taskHours={taskInput.taskHours}
                    onTaskTextChange={taskInput.setTaskText}
                    onTaskHoursChange={taskInput.setTaskHours}
                    onAddTask={handleAddTask}
                    shouldFocus={!overwhelmFlow.isPlanCustomizationOpen}
                />

                {/* Step 1: Confirmation Popup */}
                <ConfirmationPopup
                    isOpen={overwhelmFlow.isConfirmationOpen}
                    onClose={overwhelmFlow.handleConfirmationClose}
                    onYes={overwhelmFlow.handleConfirmationYes}
                    onNo={overwhelmFlow.handleConfirmationNo}
                    taskCount={tasks.length}
                    totalHours={overwhelmFlow.totalHours}
                />

                {/* Step 2: Time Constraints Popup (only if user chose "No") */}
                <TimeConstraintsPopup
                    isOpen={overwhelmFlow.isTimeConstraintsOpen}
                    onClose={overwhelmFlow.handleTimeConstraintsClose}
                    tasks={mapTasksToTaskInputs(tasks)}
                    onComplete={overwhelmFlow.handleTimeConstraintsComplete}
                />

                {/* Step 3: Plan Customization Popup */}
                <PlanCustomizationPopup
                    isOpen={overwhelmFlow.isPlanCustomizationOpen}
                    onClose={overwhelmFlow.handlePlanCustomizationClose}
                    onComplete={overwhelmFlow.handlePlanCustomizationComplete}
                    defaultTitle={overwhelmFlow.defaultPlanInfo.title}
                    defaultDescription={
                        overwhelmFlow.defaultPlanInfo.description
                    }
                    taskCount={tasks.length}
                    isCreating={overwhelmFlow.isCreatingPlan}
                />
            </div>
        </Layout>
    );
};

export default OverwhelmOrganizer;
