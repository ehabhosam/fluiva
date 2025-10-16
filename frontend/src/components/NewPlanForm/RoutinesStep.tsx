import { RoutineInput } from "@/api/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ItemCard from "./ItemCard";
import useNewItem from "./hooks/use-new-item";
import ItemForm from "./ItemForm";

interface RoutinesStepProps {
    routines: RoutineInput[];
    onUpdate: (routines: RoutineInput[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const createDefaultRoutine = (): RoutineInput => ({
    title: "",
    description: "",
    requiredTime: 30,
});

const RoutinesStep: React.FC<RoutinesStepProps> = ({
    routines,
    onUpdate,
    onNext,
    onBack,
}) => {
    const [newRoutine, setNewRoutine] = useState<RoutineInput>(
        createDefaultRoutine(),
    );

    const [errors, setErrors] = useState<{
        title?: string;
        requiredTime?: string;
        items?: string;
    }>({});

    const { handleAddItem, handleRemoveItem, handleMoveItem } = useNewItem({
        items: routines,
        newItem: newRoutine,
        setNewItem: setNewRoutine,
        onUpdate,
        setErrors,
        createDefaultItem: createDefaultRoutine,
    });

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
                    <div className="border border-dashed rounded-3xl p-6 text-center bg-gray-50">
                        <p className="text-muted-foreground">
                            No routines added yet. Routines are recurring
                            activities in your plan.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {routines.map((routine, index) => (
                            <ItemCard
                                key={index}
                                item={routine}
                                itemsLength={routines.length}
                                index={index}
                                handleMoveItem={handleMoveItem}
                                handleRemoveItem={handleRemoveItem}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add new routine form */}
            <ItemForm
                newItem={newRoutine}
                setNewItem={setNewRoutine}
                errors={errors}
                setErrors={setErrors}
                handleAddItem={handleAddItem}
                itemTypeName="Routine"
            />

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
