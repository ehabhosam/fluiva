import { Priority, TaskInput, RoutineInput } from "@/api/types";

type ItemType = TaskInput | RoutineInput;

interface Params<T extends ItemType> {
    items: T[];
    newItem: T;
    setNewItem: React.Dispatch<React.SetStateAction<T>>;
    onUpdate: (items: T[]) => void;
    setErrors: React.Dispatch<
        React.SetStateAction<{
            title?: string;
            requiredTime?: string;
            items?: string;
        }>
    >;
    createDefaultItem: () => T;
}

function isTaskInput(item: ItemType): item is TaskInput {
    return 'priority' in item && 'isBreakable' in item;
}

export default function useNewItem<T extends ItemType>({
    items,
    newItem,
    setNewItem,
    onUpdate,
    setErrors,
    createDefaultItem,
}: Params<T>) {
    const handleAddItem = () => {
        // Validate new item
        const newErrors: {
            title?: string;
            requiredTime?: string;
        } = {};

        if (!newItem.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (newItem.requiredTime <= 0) {
            newErrors.requiredTime = "Time must be greater than 0";
        }

        setErrors(newErrors);

        // If no errors, add item
        if (Object.keys(newErrors).length === 0) {
            onUpdate([...items, { ...newItem }]);
            // Reset form
            setNewItem(createDefaultItem());
        }
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        onUpdate(updatedItems);
    };

    const handleMoveItem = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === items.length - 1)
        ) {
            return;
        }

        const updatedItems = [...items];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [updatedItems[index], updatedItems[targetIndex]] = [
            updatedItems[targetIndex],
            updatedItems[index],
        ];
        onUpdate(updatedItems);
    };

    return {
        handleAddItem,
        handleRemoveItem,
        handleMoveItem,
    };
}
