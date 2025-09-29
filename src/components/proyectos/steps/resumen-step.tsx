"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Clock, Target, DollarSign, Package } from "lucide-react";
import { TIPOS_PROYECTO, TIPOS_PEDIDO, PAISES } from "@/consts/proyectos/form-options";
import type { ProyectoFormValues } from "@/schemas/proyecto";

export function ResumenStep() {
	const form = useFormContext<ProyectoFormValues>();
	const data = form.getValues();

	// Helper functions
	const getTipoProyectoLabel = (tipo: string) => {
		return TIPOS_PROYECTO.find(t => t.value === tipo)?.label || tipo;
	};

	const getPaisName = (code: string) => {
		return PAISES.find(p => p.code === code)?.name || code;
	};

	const getTipoPedidoInfo = (tipo: string) => {
		return TIPOS_PEDIDO.find(t => t.value === tipo) || { label: tipo, icon: "📦" };
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	const calculateProjectDuration = () => {
		if (!data.etapas || data.etapas.length === 0) return null;

		const startDates = data.etapas.map(e => new Date(e.fecha_inicio));
		const endDates = data.etapas.map(e => new Date(e.fecha_fin));

		const projectStart = new Date(Math.min(...startDates.map(d => d.getTime())));
		const projectEnd = new Date(Math.max(...endDates.map(d => d.getTime())));

		const diffTime = projectEnd.getTime() - projectStart.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return {
			start: projectStart,
			end: projectEnd,
			duration: diffDays
		};
	};

	const getResourcesSummary = () => {
		const summary = new Map<string, { count: number; totalMonto: number; currencies: Set<string> }>();

		data.etapas?.forEach(etapa => {
			etapa.pedidos.forEach(pedido => {
				const existing = summary.get(pedido.tipo) || { count: 0, totalMonto: 0, currencies: new Set() };
				existing.count += 1;
				if (pedido.monto) {
					existing.totalMonto += pedido.monto;
					if (pedido.moneda) {
						existing.currencies.add(pedido.moneda);
					}
				}
				summary.set(pedido.tipo, existing);
			});
		});

		return summary;
	};

	const projectDuration = calculateProjectDuration();
	const resourcesSummary = getResourcesSummary();
	const totalPedidos = data.etapas?.reduce((total, etapa) => total + etapa.pedidos.length, 0) || 0;

	return (
		<ScrollArea className="h-[500px]">
			<div className="space-y-6 pr-4">
			<div>
				<h3 className="text-lg font-semibold mb-2">Resumen del Proyecto</h3>
				<p className="text-sm text-muted-foreground">
					Revisa toda la información antes de crear el proyecto
				</p>
			</div>

			{/* Project Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Información General
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="text-xl font-semibold text-primary mb-2">{data.titulo}</h4>
						<Badge variant="secondary" className="mb-3">
							{getTipoProyectoLabel(data.tipo)}
						</Badge>
						<p className="text-muted-foreground leading-relaxed">{data.descripcion}</p>
					</div>
				</CardContent>
			</Card>

			{/* Location */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MapPin className="h-5 w-5" />
						Ubicación
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-lg">
						<span className="font-medium">{data.ciudad}</span>
						{data.barrio && (
							<>
								<span className="text-muted-foreground">•</span>
								<span>{data.barrio}</span>
							</>
						)}
						<span className="text-muted-foreground">•</span>
						<span>{data.provincia}</span>
						<span className="text-muted-foreground">•</span>
						<span className="font-medium">{getPaisName(data.pais)}</span>
					</div>
				</CardContent>
			</Card>

			{/* Project Timeline */}
			{projectDuration && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Cronograma
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Fecha de Inicio</p>
								<p className="font-medium">{formatDate(projectDuration.start.toISOString())}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Fecha de Finalización</p>
								<p className="font-medium">{formatDate(projectDuration.end.toISOString())}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Duración Total</p>
								<p className="font-medium flex items-center gap-1">
									<Clock className="h-4 w-4" />
									{projectDuration.duration} días
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Stages Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Package className="h-5 w-5" />
						Etapas del Proyecto ({data.etapas?.length || 0})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data.etapas?.map((etapa, index) => (
							<div key={etapa.id} className="border rounded-lg p-4">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h5 className="font-medium text-lg">{etapa.nombre}</h5>
										<p className="text-sm text-muted-foreground">{etapa.descripcion}</p>
									</div>
									<Badge variant="outline">Etapa {index + 1}</Badge>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
									<div>
										<p className="text-xs text-muted-foreground">Período</p>
										<p className="text-sm">
											{formatDate(etapa.fecha_inicio)} - {formatDate(etapa.fecha_fin)}
										</p>
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Pedidos de Cobertura</p>
										<p className="text-sm font-medium">{etapa.pedidos.length} solicitudes</p>
									</div>
								</div>

								{etapa.pedidos.length > 0 && (
									<div className="mt-3">
										<p className="text-xs text-muted-foreground mb-2">Tipos de pedidos:</p>
										<div className="flex flex-wrap gap-2">
											{etapa.pedidos.map((pedido, pidx) => {
												const tipoInfo = getTipoPedidoInfo(pedido.tipo);
												return (
													<Badge key={pidx} variant="secondary" className="text-xs">
														{tipoInfo.icon} {tipoInfo.label}
													</Badge>
												);
											})}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Resources Summary */}
			{totalPedidos > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="h-5 w-5" />
							Resumen de Recursos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h5 className="font-medium mb-3">Total de Pedidos: {totalPedidos}</h5>
								<div className="space-y-2">
									{Array.from(resourcesSummary.entries()).map(([tipo, info]) => {
										const tipoInfo = getTipoPedidoInfo(tipo);
										return (
											<div key={tipo} className="flex items-center justify-between p-2 bg-muted/50 rounded">
												<span className="text-sm">
													{tipoInfo.icon} {tipoInfo.label}
												</span>
												<Badge variant="outline">{info.count}</Badge>
											</div>
										);
									})}
								</div>
							</div>

							<div>
								<h5 className="font-medium mb-3">Presupuesto Estimado</h5>
								<div className="space-y-2">
									{Array.from(resourcesSummary.entries()).map(([tipo, info]) => {
										if (info.totalMonto > 0) {
											return (
												<div key={`budget-${tipo}`} className="flex items-center justify-between text-sm">
													<span>{getTipoPedidoInfo(tipo).label}:</span>
													<span className="font-medium">
														{Array.from(info.currencies).map(currency =>
															`${info.totalMonto.toLocaleString()} ${currency}`
														).join(', ')}
													</span>
												</div>
											);
										}
										return null;
									})}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Final Note */}
			<Card className="border-primary/20 bg-primary/5">
				<CardContent className="pt-6">
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Al crear este proyecto, se iniciará el proceso de coordinación con las organizaciones para cubrir los pedidos solicitados.
						</p>
					</div>
				</CardContent>
				</Card>
			</div>
		</ScrollArea>
	);
}