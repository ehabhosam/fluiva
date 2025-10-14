import { TimeConstraintsResponse } from "@/api/types";
import { Card, CardContent } from "../ui/card";
import ControlledCounter from "./ControlledCounter";
import { Label } from "../ui/label";

interface CounterContainerProps {
    name: string;
    count: number;
    increment: () => void;
    decrement: () => void;
    max: number;
    min: number;
    error: string;
    label: string;
}

export default function CounterContainer(props: CounterContainerProps) {
    const { name, count, label, increment, decrement, min, max, error } = props;
    return (
        <Card className="rounded-3xl bg-Fluiva-yellow/5">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium capitalize">{name}</h4>
                    <div className="inline-flex items-center rounded-full bg-Fluiva-yellow/50 px-3 py-1 text-xs font-medium text-Fluiva-purple-800">
                        between {min} and {max}
                    </div>
                </div>

                <Label className="text-neutral-600">{label}</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <ControlledCounter
                            count={count}
                            increment={increment}
                            decrement={decrement}
                            min={min}
                            max={max}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
