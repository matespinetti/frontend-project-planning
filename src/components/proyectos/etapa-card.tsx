"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { EtapaProyecto } from "@/types/proyecto";
import { TIPOS_PEDIDO } from "@/consts/proyectos/form-options";

interface EtapaCardProps {
	etapa: EtapaProyecto;
	index: number;
	onEdit: () => void;
	onDelete: () => void;
}

export function EtapaCard({ etapa, index, onEdit, onDelete }: EtapaCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<Badge variant="outline">Etapa {index + 1}</Badge>
							<h4 className="font-semibold">{etapa.nombre}</h4>
						</div>
						<p className="text-sm text-muted-foreground">
							{etapa.descripcion}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={onEdit}
							type="button"
						>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={onDelete}
							type="button"
						>
							<Trash2 className="h-4 w-4 text-destructive" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>
							{format(
								new Date(etapa.fecha_inicio),
								"dd MMM yyyy",
								{ locale: es }
							)}
						</span>
					</div>
					<span>→</span>
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>
							{format(new Date(etapa.fecha_fin), "dd MMM yyyy", {
								locale: es,
							})}
						</span>
					</div>
				</div>

				{etapa.pedidos && etapa.pedidos.length > 0 && (
					<div className="mt-3 pt-3 border-t">
						<p className="text-sm font-medium mb-2">
							Pedidos de Cobertura ({etapa.pedidos.length}):
						</p>
						<div className="flex flex-wrap gap-2">
							{etapa.pedidos.map((pedido) => {
								const tipoPedido = TIPOS_PEDIDO.find(
									(t) => t.value === pedido.tipo
								);
								return (
									<Badge key={pedido.id} variant="secondary">
										{tipoPedido?.icon} {tipoPedido?.label}
									</Badge>
								);
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
