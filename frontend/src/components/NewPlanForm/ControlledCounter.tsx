import { MinusIcon, PlusIcon } from "lucide-react";

type ControlledCounterProps = {
    count: number;
    increment: () => void;
    decrement: () => void;
    min?: number;
    max?: number;
};

export default function ControlledCounter(props: ControlledCounterProps) {
    console.log("displaying controlled counter", props.count);

    const min = props.min ?? 0;
    const max = props.max ?? Infinity;

    return (
        <div className="flex gap-3 items-center">
            <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-Fluiva-purple-600 text-white cursor-pointer z-10"
                onClick={props.increment}
                disabled={props.count >= max}
                type="button"
            >
                <PlusIcon className="w-5 h-5" color="white" />
            </button>
            <span className="mx-2 text-lg font-semibold">{props.count}</span>
            <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-Fluiva-purple-600 text-white"
                onClick={props.decrement}
                disabled={props.count <= min}
                type="button"
            >
                <MinusIcon className="w-5 h-5" color="white" />
            </button>
        </div>
    );
}
