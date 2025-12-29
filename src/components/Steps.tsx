import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/common/utils.ts"; // Assuming cn utility is available for conditional class names

interface StepItem {
  title: string;
  subtitle: string;
}

interface StepsProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
}

const Steps: React.FC<StepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between space-x-4 p-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                {
                  "bg-[#0F172A]": index === currentStep, // Active step
                  "bg-gray-700": index < currentStep, // Completed step
                  "bg-gray-200 text-gray-500": index > currentStep, // Inactive step
                }
              )}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="ml-2 flex flex-col">
              <span
                className={cn("text-sm font-medium", {
                  "text-gray-800": index === currentStep,
                  "text-gray-600": index < currentStep,
                  "text-gray-400": index > currentStep,
                })}
              >
                {step.title}
              </span>
              <span
                className={cn("text-xs", {
                  "text-gray-800": index === currentStep,
                  "text-gray-600": index < currentStep,
                  "text-gray-400": index > currentStep,
                })}
              >
                {step.subtitle}
              </span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn("flex-1 h-px mx-4", {
                "bg-gray-800": index === currentStep,
                "bg-gray-600": index < currentStep,
                "bg-gray-400": index > currentStep,
              })}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Steps;
