"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
	// useState para que el QueryClient no se recree en cada render
	const [client] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	);
}
