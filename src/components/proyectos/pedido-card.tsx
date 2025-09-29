"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { TIPOS_PEDIDO } from "@/consts/proyectos/form-options";
import type { PedidoCobertura } from "@/types/proyecto";

interface PedidoCardProps {
	pedido: PedidoCobertura;
	onEdit: () => void;
	onDelete: () => void;
}

export function PedidoCard({ pedido, onEdit, onDelete }: PedidoCardProps) {
	const tipoPedido = TIPOS_PEDIDO.find((t) => t.value === pedido.tipo);

	return (
		<div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
			<div className="flex items-center gap-3 flex-1">
				<span className="text-2xl">{tipoPedido?.icon}</span>
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<p className="font-medium text-sm">
							{tipoPedido?.label}
						</p>
						{pedido.monto && (
							<Badge variant="secondary">
								{pedido.moneda} {pedido.monto.toLocaleString()}
							</Badge>
						)}
						{pedido.cantidad && (
							<Badge variant="secondary">
								{pedido.cantidad} {pedido.unidad}
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						{pedido.descripcion}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-1">
				<Button variant="ghost" size="icon" onClick={onEdit}>
					<Edit className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" onClick={onDelete}>
					<Trash2 className="h-4 w-4 text-destructive" />
				</Button>
			</div>
		</div>
	);
}
