import { CheckCircle } from "lucide-react";
import React from "react";

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    currentStep,
    steps,
}) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-10 px-20">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        {/* Step Circle with Number */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full
                  ${
                      index < currentStep
                          ? "bg-secondary/80 text-white"
                          : index === currentStep
                            ? "bg-Fluiva-blue text-white"
                            : "bg-gray-100 text-gray-500"
                  }`}
                            >
                                {index < currentStep ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-bold">
                                        {index + 1}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`absolute translate-y-[35px] text-xs font-medium mt-2 max-w-[80px] text-center
                  ${index < currentStep ? "text-secondary" : index === currentStep ? "text-Fluiva-blue font-semibold" : "text-gray-500"}`}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 rounded
                    ${index < currentStep ? "bg-secondary/80" : "bg-gray-200"}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
