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
import { StepIndicator } from "./step-indicator";
import { Button } from "../ui/button";
import {
	CheckCircle2,
	ExternalLink,
	AlertCircle,
	PartyPopper,
} from "lucide-react";
import { DatosBasicosStep } from "./steps/datos-basicos-step";
import { EtapasStep } from "./steps/etapas-step";
import { ResumenStep } from "./steps/resumen-step";
import { useCreateProject } from "@/hooks/use-create-project";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const TOTAL_STEPS = 3;

interface CreatedProjectInfo {
	id: string;
	titulo: string;
}

export function CreateProjectForm() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [createdProject, setCreatedProject] =
		useState<CreatedProjectInfo | null>(null);

	const createProject = useCreateProject();
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
		try {
			const res = await createProject.mutateAsync(data);
			const projectId = res?.proyecto?.id as string | undefined;
			const projectTitle = data.titulo;

			if (projectId) {
				// Show success toast
				toast.success("¡Proyecto creado exitosamente!", {
					description: `El proyecto "${projectTitle}" ha sido creado.`,
					icon: <PartyPopper className="h-5 w-5" />,
					duration: 5000,
				});

				// Store project info for success state
				setCreatedProject({
					id: projectId,
					titulo: projectTitle,
				});

				// Reset form for next project
				form.reset();
				setCurrentStep(1);
			} else {
				throw new Error("No se recibió el ID del proyecto");
			}
		} catch (error) {
			const errorMessage = getErrorMessage(error);

			// Show error toast
			toast.error("Error al crear el proyecto", {
				description: errorMessage,
				icon: <AlertCircle className="h-5 w-5" />,
				duration: 6000,
			});

			console.error("Error al crear proyecto:", error);
		}
	};

	const handleCreateAnother = () => {
		setCreatedProject(null);
		form.reset();
		setCurrentStep(1);
	};

	const handleViewProject = () => {
		if (createdProject) {
			router.push(`/proyectos/${createdProject.id}`);
		}
	};

	// Show success message if project was created
	if (createdProject) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<Card className="border-green-200 bg-green-50">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="p-3 bg-green-100 rounded-full">
								<CheckCircle2 className="h-6 w-6 text-green-600" />
							</div>
							<div>
								<CardTitle className="text-green-900">
									¡Proyecto creado exitosamente!
								</CardTitle>
								<CardDescription className="text-green-700">
									El proyecto &ldquo;{createdProject.titulo}&rdquo; ha
									sido creado correctamente
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<CheckCircle2 className="h-4 w-4" />
							<AlertTitle>¿Qué deseas hacer ahora?</AlertTitle>
							<AlertDescription>
								Puedes ver el proyecto creado o crear un nuevo
								proyecto
							</AlertDescription>
						</Alert>

						<div className="flex gap-3">
							<Button
								onClick={handleViewProject}
								className="flex-1"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Ver Proyecto
							</Button>
							<Button
								onClick={handleCreateAnother}
								variant="outline"
								className="flex-1"
							>
								Crear Otro Proyecto
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

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
										disabled={createProject.isPending}
										onClick={form.handleSubmit(onSubmit)}
									>
										{createProject.isPending ? (
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
