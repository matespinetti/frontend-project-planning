import { z } from "zod";
export const etapaSchema = z
	.object({
		nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
		descripcion: z
			.string()
			.min(10, "La descripción debe tener al menos 10 caracteres"),
		fecha_inicio: z.string().min(1, "Selecciona una fecha de inicio"),
		fecha_fin: z.string().min(1, "Selecciona una fecha de fin"),
	})
	.refine(
		(data) => {
			return new Date(data.fecha_fin) >= new Date(data.fecha_inicio);
		},
		{
			message: "La fecha de fin debe ser posterior a la fecha de inicio",
			path: ["fechaFin"],
		}
	);

export type EtapaFormValues = z.infer<typeof etapaSchema>;
