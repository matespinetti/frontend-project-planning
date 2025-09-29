// components/proyectos/step-indicator.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

const STEP_LABELS = [
	"Datos Básicos",
	"Etapas del Proyecto",
	"Resumen y Confirmación",
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
	return (
		<div className="flex items-center justify-between">
			{Array.from({ length: totalSteps }, (_, i) => i + 1).map(
				(step, index) => (
					<div key={step} className="flex items-center flex-1">
						<div className="flex flex-col items-center flex-1">
							<div
								className={cn(
									"flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
									step < currentStep &&
										"bg-primary border-primary text-primary-foreground",
									step === currentStep &&
										"border-primary text-primary",
									step > currentStep &&
										"border-muted text-muted-foreground"
								)}
							>
								{step < currentStep ? (
									<Check className="h-5 w-5" />
								) : (
									<span className="font-semibold">
										{step}
									</span>
								)}
							</div>
							<span
								className={cn(
									"text-sm mt-2 font-medium text-center",
									step <= currentStep
										? "text-foreground"
										: "text-muted-foreground"
								)}
							>
								{STEP_LABELS[index]}
							</span>
						</div>

						{index < totalSteps - 1 && (
							<div
								className={cn(
									"flex-1 h-0.5 mx-2 transition-all",
									step < currentStep
										? "bg-primary"
										: "bg-muted"
								)}
							/>
						)}
					</div>
				)
			)}
		</div>
	);
}
