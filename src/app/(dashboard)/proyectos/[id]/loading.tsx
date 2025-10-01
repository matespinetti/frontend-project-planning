import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProyectoDetailLoading() {
	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			{/* Header Skeleton */}
			<div className="mb-8">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<Skeleton className="h-10 w-2/3" />
							<Skeleton className="h-6 w-20" />
						</div>
						<Skeleton className="h-6 w-full max-w-3xl" />
					</div>
				</div>

				{/* Quick Info Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-lg" />
									<div className="flex-1">
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-24" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Tabs Skeleton */}
			<div className="space-y-6">
				<Skeleton className="h-10 w-full md:w-96" />

				{/* Content Skeleton */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-64" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{[1, 2, 3, 4].map((i) => (
									<div key={i}>
										<Skeleton className="h-4 w-24 mb-2" />
										<Skeleton className="h-5 w-40" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{[1, 2].map((i) => (
									<div key={i}>
										<Skeleton className="h-4 w-32 mb-2" />
										<Skeleton className="h-5 w-48" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
