import { z } from "zod";

// Schema para pedidos de cobertura
const pedidoSchema = z.object({
	id: z.string(),
	tipo: z.string().min(1, "Selecciona un tipo de pedido"),
	descripcion: z
		.string()
		.min(5, "La descripción debe tener al menos 5 caracteres"),
	monto: z.number().positive("El monto debe ser positivo").optional(),
	moneda: z.string().optional(),
	cantidad: z.number().positive("La cantidad debe ser positiva").optional(),
	unidad: z.string().optional(),
});

// Schema para etapas con validación de fechas
const etapaSchema = z
	.object({
		id: z.string(),
		nombre: z
			.string()
			.min(3, "El nombre debe tener al menos 3 caracteres"),
		descripcion: z
			.string()
			.min(10, "La descripción debe tener al menos 10 caracteres"),
		fecha_inicio: z.string().min(1, "Selecciona una fecha de inicio"),
		fecha_fin: z.string().min(1, "Selecciona una fecha de fin"),
		pedidos: z.array(pedidoSchema),
	})
	.refine(
		(data) => {
			return new Date(data.fecha_fin) >= new Date(data.fecha_inicio);
		},
		{
			message: "La fecha de fin debe ser posterior a la fecha de inicio",
			path: ["fecha_fin"],
		}
	);

// Schema principal del proyecto
export const proyectoSchema = z.object({
	titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
	descripcion: z
		.string()
		.min(20, "La descripción debe tener al menos 20 caracteres"),
	tipo: z.string().min(1, "Selecciona un tipo de proyecto"),
	pais: z.string().min(1, "Selecciona un país"),
	provincia: z.string().min(1, "Ingresa la provincia"),
	ciudad: z.string().min(1, "Ingresa la ciudad"),
	barrio: z.string().optional(),
	etapas: z
		.array(etapaSchema)
		.min(1, "Agrega al menos una etapa"),
});

// Tipos derivados para usar en componentes
export type ProyectoFormValues = z.infer<typeof proyectoSchema>;
export type EtapaFormValues = z.infer<typeof etapaSchema>;
export type PedidoFormValues = z.infer<typeof pedidoSchema>;
