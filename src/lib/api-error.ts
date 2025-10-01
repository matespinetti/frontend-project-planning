/**
 * API Error handling utilities
 * Provides typed error handling and message extraction for API responses
 */

export interface ApiErrorDetail {
	message: string;
	status: number;
	statusText?: string;
	field?: string;
	code?: string;
}

export class ApiError extends Error {
	public readonly status: number;
	public readonly statusText?: string;
	public readonly details?: unknown;
	public readonly timestamp: Date;

	constructor(
		message: string,
		status: number,
		statusText?: string,
		details?: unknown
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.statusText = statusText;
		this.details = details;
		this.timestamp = new Date();
	}

	/**
	 * Returns a user-friendly error message
	 */
	getUserMessage(): string {
		// Prioritize specific error messages from the API
		if (this.details && typeof this.details === "object") {
			const detailsObj = this.details as Record<string, unknown>;

			// Check for common API error message formats
			if (detailsObj.message && typeof detailsObj.message === "string") {
				return detailsObj.message;
			}

			if (detailsObj.error && typeof detailsObj.error === "string") {
				return detailsObj.error;
			}

			if (detailsObj.detail && typeof detailsObj.detail === "string") {
				return detailsObj.detail;
			}

			// Handle validation errors array
			if (Array.isArray(detailsObj.errors)) {
				const errorMessages = detailsObj.errors
					.map((err: { message?: string }) => err.message)
					.filter(Boolean);
				if (errorMessages.length > 0) {
					return errorMessages.join(", ");
				}
			}
		}

		// Fallback to status-based messages
		return this.getStatusMessage();
	}

	/**
	 * Returns a status-based error message
	 */
	private getStatusMessage(): string {
		switch (this.status) {
			case 400:
				return "Los datos enviados son inválidos. Por favor, revisa el formulario.";
			case 401:
				return "No estás autenticado. Por favor, inicia sesión.";
			case 403:
				return "No tienes permisos para realizar esta acción.";
			case 404:
				return "El recurso solicitado no fue encontrado.";
			case 409:
				return "Ya existe un recurso con estos datos.";
			case 422:
				return "Los datos enviados no cumplen con las validaciones requeridas.";
			case 429:
				return "Demasiadas solicitudes. Por favor, intenta más tarde.";
			case 500:
				return "Error interno del servidor. Por favor, intenta más tarde.";
			case 503:
				return "El servicio no está disponible temporalmente.";
			default:
				return this.message || "Ocurrió un error inesperado.";
		}
	}

	/**
	 * Returns whether the error is a client error (4xx)
	 */
	isClientError(): boolean {
		return this.status >= 400 && this.status < 500;
	}

	/**
	 * Returns whether the error is a server error (5xx)
	 */
	isServerError(): boolean {
		return this.status >= 500;
	}

	/**
	 * Returns whether the error is a network error
	 */
	isNetworkError(): boolean {
		return this.status === 0 || this.status === undefined;
	}
}

/**
 * Extracts a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof ApiError) {
		return error.getUserMessage();
	}

	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === "string") {
		return error;
	}

	return "Ocurrió un error inesperado";
}

/**
 * Creates an ApiError from an openapi-fetch error response
 */
export function createApiError(
	error: unknown,
	status: number,
	response?: Response
): ApiError {
	const statusText = response?.statusText;

	// Try to extract error details
	let details: unknown;
	if (error && typeof error === "object") {
		details = error;
	}

	const message =
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string"
			? error.message
			: "Request failed";

	return new ApiError(message, status, statusText, details);
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}
