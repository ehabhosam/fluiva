
import { useState } from "react";
import { RoutineInput } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface RoutinesStepProps {
  routines: RoutineInput[];
  onUpdate: (routines: RoutineInput[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const RoutinesStep: React.FC<RoutinesStepProps> = ({
  routines,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [newRoutine, setNewRoutine] = useState<RoutineInput>({
    title: "",
    description: "",
    requiredTime: 30,
  });
  
  const [errors, setErrors] = useState<{
    title?: string;
    requiredTime?: string;
  }>({});

  const handleAddRoutine = () => {
    // Validate new routine
    const newErrors: {
      title?: string;
      requiredTime?: string;
    } = {};
    
    if (!newRoutine.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (newRoutine.requiredTime <= 0) {
      newErrors.requiredTime = "Time must be greater than 0";
    }
    
    setErrors(newErrors);
    
    // If no errors, add routine
    if (Object.keys(newErrors).length === 0) {
      onUpdate([...routines, { ...newRoutine }]);
      // Reset form
      setNewRoutine({
        title: "",
        description: "",
        requiredTime: 30,
      });
    }
  };

  const handleRemoveRoutine = (index: number) => {
    const updatedRoutines = [...routines];
    updatedRoutines.splice(index, 1);
    onUpdate(updatedRoutines);
  };

  const handleMoveRoutine = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === routines.length - 1)
    ) {
      return;
    }
    
    const updatedRoutines = [...routines];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updatedRoutines[index], updatedRoutines[targetIndex]] = [
      updatedRoutines[targetIndex],
      updatedRoutines[index],
    ];
    onUpdate(updatedRoutines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Routine list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Routines</h3>
          <span className="text-sm text-muted-foreground">
            {routines.length} routine{routines.length !== 1 && "s"}
          </span>
        </div>
        
        {routines.length === 0 ? (
          <div className="border border-dashed rounded-lg p-6 text-center bg-gray-50">
            <p className="text-muted-foreground">
              No routines added yet. Routines are recurring activities in your plan.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {routines.map((routine, index) => (
              <Card key={index} className="overflow-hidden bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{routine.title}</h4>
                      {routine.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {routine.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {routine.requiredTime} min
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveRoutine(index, "up")}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveRoutine(index, "down")}
                        disabled={index === routines.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRoutine(index)}
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
      </div>

      {/* Add new routine form */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-4">Add New Routine</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routine-title">Title</Label>
                <Input
                  id="routine-title"
                  placeholder="Routine title"
                  value={newRoutine.title}
                  onChange={(e) =>
                    setNewRoutine({ ...newRoutine, title: e.target.value })
                  }
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="routine-time">Required Time (minutes)</Label>
                <Input
                  id="routine-time"
                  type="number"
                  placeholder="30"
                  value={newRoutine.requiredTime}
                  onChange={(e) =>
                    setNewRoutine({
                      ...newRoutine,
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
              <Label htmlFor="routine-description">Description (optional)</Label>
              <Textarea
                id="routine-description"
                placeholder="Routine description"
                value={newRoutine.description}
                onChange={(e) =>
                  setNewRoutine({ ...newRoutine, description: e.target.value })
                }
                className="resize-none min-h-[80px]"
              />
            </div>
            
            <Button
              type="button"
              onClick={handleAddRoutine}
              className="w-full btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Routine
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Tasks
        </Button>
        <Button type="submit" className="btn-primary">
          Continue to Time Constraints
        </Button>
      </div>
    </form>
  );
};

export default RoutinesStep;
