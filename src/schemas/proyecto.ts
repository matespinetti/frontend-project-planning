import { z } from "zod";
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
		.array(
			z.object({
				id: z.string(),
				nombre: z
					.string()
					.min(3, "El nombre debe tener al menos 3 caracteres"),
				descripcion: z
					.string()
					.min(
						10,
						"La descripción debe tener al menos 10 caracteres"
					),
				fecha_inicio: z
					.string()
					.min(1, "Selecciona una fecha de inicio"),
				fecha_fin: z.string().min(1, "Selecciona una fecha de fin"),
				pedidos: z.array(
					z.object({
						id: z.string(),
						tipo: z.string(),
						descripcion: z.string(),
						cantidad: z.number().optional(),
						unidad: z.string().optional(),
					})
				),
			})
		)
		.min(1, "Agrega al menos una etapa"),
});
