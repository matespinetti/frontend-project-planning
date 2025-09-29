import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PAISES, TIPOS_PROYECTO } from "@/consts/proyectos/form-options";
import { useFormContext, UseFormReturn } from "react-hook-form";

export function DatosBasicosStep() {
	const form = useFormContext();
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold mb-4">
					Información del Proyecto
				</h3>

				{/* Título */}
				<FormField
					control={form.control}
					name="titulo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Título del Proyecto *</FormLabel>
							<FormControl>
								<Input
									placeholder="Ej: Mejora Habitacional Barrio San José"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Un título descriptivo y claro del proyecto
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Descripción */}
				<FormField
					control={form.control}
					name="descripcion"
					render={({ field }) => (
						<FormItem className="mt-4">
							<FormLabel>Descripción *</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe el alcance, objetivos y beneficiarios del proyecto..."
									className="min-h-[120px]"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Explica en detalle qué se va a realizar y a
								quiénes beneficiará
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Tipo de Proyecto */}
				<FormField
					control={form.control}
					name="tipo"
					render={({ field }) => (
						<FormItem className="mt-4">
							<FormLabel>Tipo de Proyecto *</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona el tipo de proyecto" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{TIPOS_PROYECTO.map((tipo) => (
										<SelectItem
											key={tipo.value}
											value={tipo.value}
										>
											{tipo.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-4 mt-6">Ubicación</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* País */}
					<FormField
						control={form.control}
						name="pais"
						render={({ field }) => (
							<FormItem>
								<FormLabel>País *</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona un país" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{PAISES.map((pais) => (
											<SelectItem
												key={pais.code}
												value={pais.code}
											>
												{pais.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Provincia */}
					<FormField
						control={form.control}
						name="provincia"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Provincia/Estado *</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Buenos Aires"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Ciudad */}
					<FormField
						control={form.control}
						name="ciudad"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ciudad *</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: La Plata"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Barrio */}
					<FormField
						control={form.control}
						name="barrio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Barrio/Zona</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: San José"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
