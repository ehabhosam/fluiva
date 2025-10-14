import { Priority, TaskInput, RoutineInput } from "@/api/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

type ItemType = TaskInput | RoutineInput;

interface ItemCardProps<T extends ItemType> {
    item: T;
    itemsLength: number;
    index: number;
    handleMoveItem: (index: number, direction: "up" | "down") => void;
    handleRemoveItem: (index: number) => void;
}

function isTaskInput(item: ItemType): item is TaskInput {
    return 'priority' in item && 'isBreakable' in item;
}

export default function ItemCard<T extends ItemType>(props: ItemCardProps<T>) {
    const { item, itemsLength, index, handleMoveItem, handleRemoveItem } = props;

    return (
        <Card
            key={index}
            className="overflow-hidden rounded-3xl border-Fluiva-blue border-2"
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                {item.requiredTime} min
                            </span>
                            {isTaskInput(item) && (
                                <>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            item.priority === Priority.HIGH
                                                ? "bg-red-100 text-red-800"
                                                : item.priority === Priority.NORMAL
                                                  ? "bg-blue-100 text-blue-800"
                                                  : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {item.priority?.toLowerCase()}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            item.isBreakable
                                                ? "bg-Fluiva-purple-100 text-Fluiva-purple-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {item.isBreakable
                                            ? "breakable"
                                            : "not breakable"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveItem(index, "up")}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveItem(index, "down")}
                            disabled={index === itemsLength - 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
