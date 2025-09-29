"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
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
import type { EtapaProyecto, PedidoCobertura } from "@/types/proyecto";
import { EtapaFormValues, etapaSchema } from "@/schemas/etapa";

interface EtapaDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (etapa: EtapaProyecto) => void;
	etapa?: EtapaProyecto | null;
}

export function EtapaDialog({
	open,
	onOpenChange,
	onSave,
	etapa,
}: EtapaDialogProps) {
	const [pedidos, setPedidos] = useState<PedidoCobertura[]>([]);

	const form = useForm<EtapaFormValues>({
		resolver: zodResolver(etapaSchema),
		defaultValues: {
			nombre: "",
			descripcion: "",
			fecha_inicio: "",
			fecha_fin: "",
		},
	});

	useEffect(() => {
		if (etapa) {
			form.reset({
				nombre: etapa.nombre,
				descripcion: etapa.descripcion,
				fecha_inicio: etapa.fecha_inicio,
				fecha_fin: etapa.fecha_fin,
			});
			setPedidos(etapa.pedidos || []);
		} else {
			form.reset({
				nombre: "",
				descripcion: "",
				fecha_inicio: "",
				fecha_fin: "",
			});
			setPedidos([]);
		}
	}, [etapa, form, open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		form.handleSubmit((data) => {
			const etapaData: EtapaProyecto = {
				id: etapa?.id || crypto.randomUUID(),
				...data,
				pedidos,
			};
			onSave(etapaData);
			form.reset();
			setPedidos([]);
		})(e);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{etapa ? "Editar Etapa" : "Agregar Nueva Etapa"}
					</DialogTitle>
					<DialogDescription>
						Define la etapa del proyecto y sus pedidos de cobertura
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Nombre */}
						<FormField
							control={form.control}
							name="nombre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre de la Etapa *</FormLabel>
									<FormControl>
										<Input
											placeholder="Ej: Evaluación estructural"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Descripción */}
						<FormField
							control={form.control}
							name="descripcion"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción *</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe las actividades de esta etapa..."
											className="min-h-[80px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Fechas */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="fecha_inicio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fecha de Inicio *</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fecha_fin"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fecha de Fin *</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Sección de Pedidos */}
						<PedidosSection
							pedidos={pedidos}
							setPedidos={setPedidos}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancelar
							</Button>
							<Button type="submit">
								<Plus className="mr-2 h-4 w-4" />
								{etapa ? "Guardar Cambios" : "Agregar Etapa"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
