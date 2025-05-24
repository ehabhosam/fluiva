
import { useState } from "react";
import { TaskInput, Priority } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

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

  const handleAddTask = () => {
    // Validate new task
    const newErrors: {
      title?: string;
      requiredTime?: string;
    } = {};
    
    if (!newTask.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (newTask.requiredTime <= 0) {
      newErrors.requiredTime = "Time must be greater than 0";
    }
    
    setErrors(newErrors);
    
    // If no errors, add task
    if (Object.keys(newErrors).length === 0) {
      onUpdate([...tasks, { ...newTask }]);
      // Reset form
      setNewTask({
        title: "",
        description: "",
        requiredTime: 30,
        priority: Priority.NORMAL,
        isBreakable: true,
      });
    }
  };

  const handleRemoveTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    onUpdate(updatedTasks);
  };

  const handleMoveTask = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === tasks.length - 1)
    ) {
      return;
    }
    
    const updatedTasks = [...tasks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updatedTasks[index], updatedTasks[targetIndex]] = [
      updatedTasks[targetIndex],
      updatedTasks[index],
    ];
    onUpdate(updatedTasks);
  };

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
          <div className="border border-dashed rounded-lg p-6 text-center bg-gray-50">
            <p className="text-muted-foreground">
              No tasks added yet. Add your first task below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <Card key={index} className="overflow-hidden bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {task.requiredTime} min
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            task.priority === Priority.HIGH
                              ? "bg-red-100 text-red-800"
                              : task.priority === Priority.NORMAL
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority?.toLowerCase()}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            task.isBreakable
                              ? "bg-plansync-purple-100 text-plansync-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.isBreakable ? "breakable" : "not breakable"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveTask(index, "up")}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveTask(index, "down")}
                        disabled={index === tasks.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {errors.tasks && <p className="text-sm text-red-500">{errors.tasks}</p>}
      </div>

      {/* Add new task form */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-4">Add New Task</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-time">Required Time (minutes)</Label>
                <Input
                  id="task-time"
                  type="number"
                  placeholder="30"
                  value={newTask.requiredTime}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requiredTime: parseInt(e.target.value) || 0,
                    })
                  }
                  className={errors.requiredTime ? "border-red-500" : ""}
                />
                {errors.requiredTime && (
                  <p className="text-sm text-red-500">{errors.requiredTime}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Description (optional)</Label>
              <Textarea
                id="task-description"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="resize-none min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={newTask.priority || Priority.NORMAL}
                  onValueChange={(value) =>
                    setNewTask({
                      ...newTask,
                      priority: value as Priority,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Priority.HIGH}>High</SelectItem>
                    <SelectItem value={Priority.NORMAL}>Normal</SelectItem>
                    <SelectItem value={Priority.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="task-breakable">Breakable Task</Label>
                <Switch
                  id="task-breakable"
                  checked={newTask.isBreakable}
                  onCheckedChange={(checked) =>
                    setNewTask({ ...newTask, isBreakable: checked })
                  }
                />
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleAddTask}
              className="w-full btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

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
