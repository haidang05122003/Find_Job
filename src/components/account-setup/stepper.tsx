"use client";

import React from "react";

interface Step {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const AccountSetupStepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
}) => {
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mb-8">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Tiến trình thiết lập
        </span>
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          {progress.toFixed(0)}% Hoàn thành
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-brand-600 dark:bg-brand-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <nav className="flex items-center justify-between" aria-label="Các bước thiết lập">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1"
            >
              {/* Step Indicator */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-brand-600 dark:bg-brand-500 text-white shadow-lg scale-110"
                    : isCompleted
                    ? "bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {step.icon}
              </div>

              {/* Step Name */}
              <span
                className={`mt-2 text-xs sm:text-sm font-medium text-center transition-colors duration-300 ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : isCompleted
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.name}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className="hidden sm:block absolute top-5 left-1/2 w-full h-0.5 -z-10"
                  style={{
                    transform: "translateX(50%)",
                    maxWidth: `calc(100% / ${steps.length} - 3rem)`,
                  }}
                >
                  <div
                    className={`h-full transition-colors duration-300 ${
                      isCompleted
                        ? "bg-brand-600 dark:bg-brand-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};
