"use client";

import { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PedidosSection } from "./pedidos-section";
import type { EtapaProyecto } from "@/types/proyecto";
import type { ProyectoFormValues, EtapaFormValues } from "@/schemas/proyecto";

interface EtapaDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: () => void;
	etapaIndex?: number | null; // Index para editar, null para agregar
}

export function EtapaDialog({
	open,
	onOpenChange,
	onSave,
	etapaIndex,
}: EtapaDialogProps) {
	const form = useFormContext<ProyectoFormValues>();
	const [currentEtapa, setCurrentEtapa] = useState<EtapaFormValues>({
		id: "",
		nombre: "",
		descripcion: "",
		fecha_inicio: "",
		fecha_fin: "",
		pedidos: [],
	});

	useEffect(() => {
		if (open) {
			if (etapaIndex !== null && etapaIndex !== undefined) {
				// Modo edición
				const etapas = form.getValues("etapas");
				const etapa = etapas[etapaIndex];
				if (etapa) {
					setCurrentEtapa(etapa);
				}
			} else {
				// Modo agregar
				setCurrentEtapa({
					id: crypto.randomUUID(),
					nombre: "",
					descripcion: "",
					fecha_inicio: "",
					fecha_fin: "",
					pedidos: [],
				});
			}
		}
	}, [open, etapaIndex, form]);

	const handleSave = () => {
		const etapas = form.getValues("etapas") || [];

		if (etapaIndex !== null && etapaIndex !== undefined) {
			// Editar etapa existente
			const updatedEtapas = [...etapas];
			updatedEtapas[etapaIndex] = currentEtapa;
			form.setValue("etapas", updatedEtapas, { shouldValidate: true });
		} else {
			// Agregar nueva etapa
			form.setValue("etapas", [...etapas, currentEtapa], {
				shouldValidate: true,
			});
		}

		onSave();
		onOpenChange(false);
	};

	const updateEtapaField = (field: keyof EtapaFormValues, value: any) => {
		setCurrentEtapa((prev) => ({ ...prev, [field]: value }));
	};

	const updatePedidos = (pedidos: any[]) => {
		setCurrentEtapa((prev) => ({ ...prev, pedidos }));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{etapaIndex !== null && etapaIndex !== undefined
							? "Editar Etapa"
							: "Agregar Nueva Etapa"}
					</DialogTitle>
					<DialogDescription>
						Define la etapa del proyecto y sus pedidos de cobertura
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Nombre */}
					<div>
						<FormLabel>Nombre de la Etapa *</FormLabel>
						<FormControl>
							<Input
								placeholder="Ej: Evaluación estructural"
								value={currentEtapa.nombre}
								onChange={(e) =>
									updateEtapaField("nombre", e.target.value)
								}
							/>
						</FormControl>
					</div>

					{/* Descripción */}
					<div>
						<FormLabel>Descripción *</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Describe las actividades de esta etapa..."
								className="min-h-[80px]"
								value={currentEtapa.descripcion}
								onChange={(e) =>
									updateEtapaField(
										"descripcion",
										e.target.value
									)
								}
							/>
						</FormControl>
					</div>

					{/* Fechas */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<FormLabel>Fecha de Inicio *</FormLabel>
							<FormControl>
								<Input
									type="date"
									value={currentEtapa.fecha_inicio}
									onChange={(e) =>
										updateEtapaField(
											"fecha_inicio",
											e.target.value
										)
									}
								/>
							</FormControl>
						</div>

						<div>
							<FormLabel>Fecha de Fin *</FormLabel>
							<FormControl>
								<Input
									type="date"
									value={currentEtapa.fecha_fin}
									onChange={(e) =>
										updateEtapaField(
											"fecha_fin",
											e.target.value
										)
									}
								/>
							</FormControl>
						</div>
					</div>

					{/* Sección de Pedidos */}
					<PedidosSection
						pedidos={currentEtapa.pedidos}
						setPedidos={updatePedidos}
					/>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button onClick={handleSave}>
							<Plus className="mr-2 h-4 w-4" />
							{etapaIndex !== null && etapaIndex !== undefined
								? "Guardar Cambios"
								: "Agregar Etapa"}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
