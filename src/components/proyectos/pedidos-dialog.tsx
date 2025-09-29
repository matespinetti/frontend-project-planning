"use client";

import { useEffect } from "react";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TIPOS_PEDIDO } from "@/consts/proyectos/form-options";
import type { PedidoCobertura } from "@/types/proyecto";
import { PedidoFormValues, pedidoSchema } from "@/schemas/pedido";

interface PedidoDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (pedido: PedidoCobertura) => void;
	pedido?: PedidoCobertura | null;
}

export function PedidoDialog({
	open,
	onOpenChange,
	onSave,
	pedido,
}: PedidoDialogProps) {
	const form = useForm<PedidoFormValues>({
		resolver: zodResolver(pedidoSchema),
		defaultValues: {
			tipo: "",
			descripcion: "",
			moneda: "USD",
		},
	});

	const tipoPedido = form.watch("tipo");

	useEffect(() => {
		if (pedido) {
			form.reset({
				tipo: pedido.tipo,
				descripcion: pedido.descripcion,
				monto: pedido.monto,
				moneda: pedido.moneda || "USD",
				cantidad: pedido.cantidad,
				unidad: pedido.unidad,
			});
		} else {
			form.reset({
				tipo: "",
				descripcion: "",
				moneda: "USD",
			});
		}
	}, [pedido, form, open]);

	const onSubmit = (data: PedidoFormValues) => {
		const pedidoData: PedidoCobertura = {
			id: pedido?.id || crypto.randomUUID(),
			tipo: data.tipo as any,
			descripcion: data.descripcion,
			...(data.monto && { monto: data.monto, moneda: data.moneda }),
			...(data.cantidad && {
				cantidad: data.cantidad,
				unidad: data.unidad,
			}),
		};
		onSave(pedidoData);
		form.reset();
	};

	const esEconomico = tipoPedido === "economico";
	const esMaterial =
		tipoPedido === "materiales" || tipoPedido === "equipamiento";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{pedido
							? "Editar Pedido"
							: "Agregar Pedido de Cobertura"}
					</DialogTitle>
					<DialogDescription>
						Define el tipo y detalles del recurso necesario
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						{/* Tipo de Pedido */}
						<FormField
							control={form.control}
							name="tipo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de Pedido *</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona el tipo" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TIPOS_PEDIDO.map((tipo) => (
												<SelectItem
													key={tipo.value}
													value={tipo.value}
												>
													<span className="flex items-center gap-2">
														{tipo.icon} {tipo.label}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
											placeholder="Describe lo que necesitas..."
											className="min-h-[80px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Campos condicionales según el tipo */}
						{esEconomico && (
							<div className="grid grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="monto"
									render={({ field }) => (
										<FormItem className="col-span-2">
											<FormLabel>Monto</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="10000"
													{...field}
													onChange={(e) =>
														field.onChange(
															Number(
																e.target.value
															)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="moneda"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Moneda</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="USD">
														USD
													</SelectItem>
													<SelectItem value="EUR">
														EUR
													</SelectItem>
													<SelectItem value="ARS">
														ARS
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						{esMaterial && (
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="cantidad"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cantidad</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="100"
													{...field}
													onChange={(e) =>
														field.onChange(
															Number(
																e.target.value
															)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="unidad"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Unidad</FormLabel>
											<FormControl>
												<Input
													placeholder="kg, m², unidades"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

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
								{pedido ? "Guardar" : "Agregar"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
