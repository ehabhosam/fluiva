import { Priority, TaskInput, RoutineInput } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

type ItemType = TaskInput | RoutineInput;

interface ItemFormProps<T extends ItemType> {
    newItem: T;
    setNewItem: React.Dispatch<React.SetStateAction<T>>;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleAddItem: () => void;
    itemTypeName: string; // "Task" or "Routine"
}

function isTaskInput(item: ItemType): item is TaskInput {
    return 'priority' in item && 'isBreakable' in item;
}

export default function ItemForm<T extends ItemType>(props: ItemFormProps<T>) {
    const { newItem, setNewItem, handleAddItem, errors, setErrors, itemTypeName } = props;

    const handleTitleChange = (value: string) => {
        setNewItem({ ...newItem, title: value } as T);
    };

    const handleDescriptionChange = (value: string) => {
        setNewItem({ ...newItem, description: value } as T);
    };

    const handleRequiredTimeChange = (value: number) => {
        setNewItem({ ...newItem, requiredTime: value } as T);
    };

    const handlePriorityChange = (value: Priority) => {
        if (isTaskInput(newItem)) {
            setNewItem({ ...newItem, priority: value } as T);
        }
    };

    const handleBreakableChange = (checked: boolean) => {
        if (isTaskInput(newItem)) {
            setNewItem({ ...newItem, isBreakable: checked } as T);
        }
    };

    const isTask = isTaskInput(newItem);

    return (
        <Card className="bg-gray-50 rounded-3xl">
            <CardContent className="p-4">
                <h4 className="font-medium mb-4">Add New {itemTypeName}</h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`${itemTypeName.toLowerCase()}-title`}>Title</Label>
                            <Input
                                id={`${itemTypeName.toLowerCase()}-title`}
                                placeholder={`${itemTypeName} title`}
                                value={newItem.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`${itemTypeName.toLowerCase()}-time`}>Required Time</Label>
                            <Input
                                id={`${itemTypeName.toLowerCase()}-time`}
                                type="number"
                                placeholder="30"
                                value={newItem.requiredTime}
                                onChange={(e) => handleRequiredTimeChange(parseInt(e.target.value) || 0)}
                                className={
                                    errors.requiredTime ? "border-red-500" : ""
                                }
                            />
                            {errors.requiredTime && (
                                <p className="text-sm text-red-500">
                                    {errors.requiredTime}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${itemTypeName.toLowerCase()}-description`}>
                            Description (optional)
                        </Label>
                        <Textarea
                            id={`${itemTypeName.toLowerCase()}-description`}
                            placeholder={`${itemTypeName} description`}
                            value={newItem.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            className="resize-none min-h-[80px]"
                        />
                    </div>

                    {isTask && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`${itemTypeName.toLowerCase()}-priority`}>Priority</Label>
                                <Select
                                    value={newItem.priority || Priority.NORMAL}
                                    onValueChange={(value) =>
                                        handlePriorityChange(value as Priority)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Priority.HIGH}>
                                            High
                                        </SelectItem>
                                        <SelectItem value={Priority.NORMAL}>
                                            Normal
                                        </SelectItem>
                                        <SelectItem value={Priority.LOW}>
                                            Low
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor={`${itemTypeName.toLowerCase()}-breakable`}>
                                    Breakable {itemTypeName}
                                </Label>
                                <Switch
                                    id={`${itemTypeName.toLowerCase()}-breakable`}
                                    checked={newItem.isBreakable}
                                    onCheckedChange={(checked) =>
                                        handleBreakableChange(checked)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="next"
                        onClick={handleAddItem}
                        className="w-full btn-primary"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add {itemTypeName}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
