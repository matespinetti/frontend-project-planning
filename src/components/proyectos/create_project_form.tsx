"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proyectoSchema, type ProyectoFormValues } from "@/schemas/proyecto";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Progress } from "@radix-ui/react-progress";
import { StepIndicator } from "./step-indicator";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";
import { DatosBasicosStep } from "./steps/datos-basicos-step";
import { EtapasStep } from "./steps/etapas-step";
import { ResumenStep } from "./steps/resumen-step";

const TOTAL_STEPS = 3;
export function CreateProjectForm() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ProyectoFormValues>({
		resolver: zodResolver(proyectoSchema),
		defaultValues: {
			titulo: "",
			descripcion: "",
			tipo: "",
			pais: "",
			provincia: "",
			ciudad: "",
			barrio: "",
			etapas: [],
		},
		mode: "onChange",
	});

	const progress = (currentStep / TOTAL_STEPS) * 100;

	const validateCurrentStep = async () => {
		let fieldsToValidate: (keyof ProyectoFormValues)[] = [];

		switch (currentStep) {
			case 1:
				fieldsToValidate = [
					"titulo",
					"descripcion",
					"tipo",
					"pais",
					"provincia",
					"ciudad",
				];
				break;
			case 2:
				fieldsToValidate = ["etapas"];
				break;
		}

		const isValid = await form.trigger(fieldsToValidate, {
			shouldFocus: true,
		});
		return isValid;
	};

	const handleNext = async () => {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < TOTAL_STEPS) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: ProyectoFormValues) => {
		setIsSubmitting(true);
		try {
			// Aquí irá la llamada a tu API
			console.log("Datos del proyecto:", data);

			// Simular llamada API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// // Redirigir al proyecto creado
			// router.push("/proyectos");
		} catch (error) {
			console.error("Error al crear proyecto:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Indicador de pasos */}
			<StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
			{/* Contenido del formulario */}
			<FormProvider {...form}>
				<form onSubmit={(e) => e.preventDefault()}>
					<Card>
						<CardContent className="pt-6">
							{currentStep === 1 && <DatosBasicosStep />}

							{currentStep === 2 && <EtapasStep />}

							{currentStep === 3 && <ResumenStep />}
						</CardContent>
					</Card>

					{/* Botones de navegación */}
					<Card className="mt-6">
						<CardContent className="pt-6">
							<div className="flex justify-between">
								<Button
									type="button"
									variant="outline"
									onClick={handlePrevious}
									disabled={currentStep === 1}
								>
									Anterior
								</Button>

								{currentStep < TOTAL_STEPS ? (
									<Button type="button" onClick={handleNext}>
										Siguiente
									</Button>
								) : (
									<Button
										type="button"
										disabled={isSubmitting}
										onClick={form.handleSubmit(onSubmit)}
									>
										{isSubmitting ? (
											<>
												<span className="animate-spin mr-2">
													⏳
												</span>
												Creando proyecto...
											</>
										) : (
											<>
												<CheckCircle2 className="mr-2 h-4 w-4" />
												Crear Proyecto
											</>
										)}
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</form>
			</FormProvider>
		</div>
	);
}
