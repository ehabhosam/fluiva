
import React from "react";
import { CheckCircle, Circle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle with Number */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full
                  ${
                    index < currentStep
                      ? "bg-plansync-purple-600 text-white"
                      : index === currentStep
                      ? "bg-plansync-purple-100 border-2 border-plansync-purple-600 text-plansync-purple-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium mt-2 max-w-[80px] text-center
                  ${
                    index <= currentStep
                      ? "text-plansync-purple-600"
                      : "text-gray-500"
                  }`}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2
                  ${
                    index < currentStep
                      ? "bg-plansync-purple-600"
                      : "bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
