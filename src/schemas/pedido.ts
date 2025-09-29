import { z } from "zod";
export const pedidoSchema = z.object({
	tipo: z.string().min(1, "Selecciona un tipo de pedido"),
	descripcion: z
		.string()
		.min(5, "La descripción debe tener al menos 5 caracteres"),
	monto: z.number().optional(),
	moneda: z.string().optional(),
	cantidad: z.number().optional(),
	unidad: z.string().optional(),
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;
