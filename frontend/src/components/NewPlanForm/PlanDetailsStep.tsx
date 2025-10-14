import { useState } from "react";
import { PlanType } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface PlanDetailsStepProps {
    formData: {
        title: string;
        description: string;
        type: PlanType;
    };
    onUpdate: (
        data: Partial<{ title: string; description: string; type: PlanType }>,
    ) => void;
    onNext: () => void;
}

const PlanDetailsStep: React.FC<PlanDetailsStepProps> = ({
    formData,
    onUpdate,
    onNext,
}) => {
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const newErrors: {
            title?: string;
            description?: string;
        } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);

        // If no errors, proceed to next step
        if (Object.keys(newErrors).length === 0) {
            onNext();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="title"
                        className="text-Fluiva-foreground font-medium"
                    >
                        Plan Title
                    </Label>
                    <Input
                        id="title"
                        placeholder="Enter a title for your plan"
                        value={formData.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className={`bg-white border-2 transition-colors ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 animate-fade-in">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="description"
                        className="text-Fluiva-foreground font-medium"
                    >
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="What is this plan for?"
                        value={formData.description}
                        onChange={(e) =>
                            onUpdate({ description: e.target.value })
                        }
                        className={`resize-none min-h-[100px] bg-white border-2 transition-colors ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 animate-fade-in">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label className="text-Fluiva-foreground font-medium">
                        Plan Type
                    </Label>
                    <RadioGroup
                        value={formData.type}
                        onValueChange={(value) =>
                            onUpdate({ type: value as PlanType })
                        }
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-3xl p-4 hover:border-Fluiva-green hover:bg-gradient-to-br hover:from-green-50 hover:to-teal-50 cursor-pointer transition-all duration-200 hover:shadow-md">
                            <RadioGroupItem
                                value={PlanType.DAILY}
                                id="daily"
                                className="text-Fluiva-green"
                            />
                            <Label
                                htmlFor="daily"
                                className="cursor-pointer flex-1"
                            >
                                <div className="font-semibold text-Fluiva-foreground">
                                    Daily
                                </div>
                                <div className="text-sm text-Fluiva-muted-foreground">
                                    For short-term, daily planning
                                </div>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-3xl p-4 hover:border-Fluiva-purple hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 hover:shadow-md">
                            <RadioGroupItem
                                value={PlanType.WEEKLY}
                                id="weekly"
                                className="text-Fluiva-purple"
                            />
                            <Label
                                htmlFor="weekly"
                                className="cursor-pointer flex-1"
                            >
                                <div className="font-semibold text-Fluiva-foreground">
                                    Weekly
                                </div>
                                <div className="text-sm text-Fluiva-muted-foreground">
                                    For medium-term planning
                                </div>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-3xl p-4 hover:border-Fluiva-blue hover:bg-gradient-to-br hover:from-blue-50 hover:to-yellow-50 cursor-pointer transition-all duration-200 hover:shadow-md">
                            <RadioGroupItem
                                value={PlanType.MONTHLY}
                                id="monthly"
                                className="text-Fluiva-blue"
                            />
                            <Label
                                htmlFor="monthly"
                                className="cursor-pointer flex-1"
                            >
                                <div className="font-semibold text-Fluiva-foreground">
                                    Monthly
                                </div>
                                <div className="text-sm text-Fluiva-muted-foreground">
                                    For long-term planning
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Continue to Tasks</Button>
            </div>
        </form>
    );
};

export default PlanDetailsStep;
