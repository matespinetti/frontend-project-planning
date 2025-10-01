"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProyectoDetailError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Error en página de proyecto:", error);
	}, [error]);

	// Determinar el tipo de error
	const is404 = error.message.includes("404") || error.message.includes("not found");
	const isNetworkError = error.message.includes("red") || error.message.includes("network");

	return (
		<div className="container mx-auto py-16 px-4 max-w-3xl">
			<Card className="border-destructive">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-3 bg-destructive/10 rounded-full">
							<AlertCircle className="h-8 w-8 text-destructive" />
						</div>
						<div>
							<CardTitle className="text-2xl">
								{is404
									? "Proyecto no encontrado"
									: isNetworkError
									? "Error de conexión"
									: "Error al cargar el proyecto"}
							</CardTitle>
							<p className="text-muted-foreground text-sm mt-1">
								{is404
									? "El proyecto que buscas no existe o fue eliminado"
									: isNetworkError
									? "No se pudo conectar con el servidor"
									: "Ocurrió un error al intentar cargar la información"}
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Error Details */}
					<div className="bg-muted p-4 rounded-lg">
						<p className="text-sm font-mono text-muted-foreground">
							{error.message}
						</p>
						{error.digest && (
							<p className="text-xs font-mono text-muted-foreground mt-2">
								Código: {error.digest}
							</p>
						)}
					</div>

					{/* Suggestions */}
					<div className="space-y-2">
						<h4 className="font-semibold text-sm">Sugerencias:</h4>
						<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
							{is404 ? (
								<>
									<li>Verifica que el ID del proyecto sea correcto</li>
									<li>El proyecto puede haber sido eliminado</li>
									<li>Intenta buscar el proyecto desde la lista</li>
								</>
							) : isNetworkError ? (
								<>
									<li>Verifica tu conexión a internet</li>
									<li>El servidor puede estar temporalmente inaccesible</li>
									<li>Intenta recargar la página en unos momentos</li>
								</>
							) : (
								<>
									<li>Intenta recargar la página</li>
									<li>Verifica tu conexión a internet</li>
									<li>Si el problema persiste, contacta al soporte</li>
								</>
							)}
						</ul>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						{!is404 && (
							<Button onClick={reset} className="flex-1">
								<RefreshCcw className="mr-2 h-4 w-4" />
								Reintentar
							</Button>
						)}
						<Button
							onClick={() => router.push("/proyectos")}
							variant={is404 ? "default" : "outline"}
							className="flex-1"
						>
							<Home className="mr-2 h-4 w-4" />
							Ver todos los proyectos
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
