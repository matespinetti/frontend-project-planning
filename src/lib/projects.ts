import { apiClient } from "@/lib/apiClient";
import { createApiError } from "@/lib/api-error";
import { paths } from "@/types/openapi";

type GetProjectOutput =
	paths["/api/v1/projects/{project_id}"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * Server-side function to fetch project details by ID
 * Use this in Server Components
 */
export async function getProject(projectId: string): Promise<GetProjectOutput> {
	try {
		const { data, error, response } = await apiClient.GET(
			"/api/v1/projects/{project_id}",
			{
				params: {
					path: {
						project_id: projectId,
					},
				},
			}
		);

		if (error) {
			throw createApiError(error, response.status ?? 500, response);
		}

		if (!data) {
			throw createApiError({ message: "Project not found" }, 404, response);
		}

		return data as GetProjectOutput;
	} catch (error) {
		// Re-throw ApiErrors as-is
		if (error instanceof Error && error.name === "ApiError") {
			throw error;
		}

		// Handle network errors
		if (error instanceof TypeError) {
			throw createApiError(
				{
					message: "Error de red. Verifica tu conexión a internet.",
				},
				0,
				undefined
			);
		}

		// Handle unexpected errors
		throw createApiError(
			{
				message:
					error instanceof Error ? error.message : "Error inesperado",
			},
			500,
			undefined
		);
	}
}
