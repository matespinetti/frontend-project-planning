import createClient from "openapi-fetch";
import type { paths } from "@/types/openapi";
export const apiServer = createClient<paths>({
	baseUrl: process.env.API_BASE_URL,
});
export const apiClient = createClient<paths>({
	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});
