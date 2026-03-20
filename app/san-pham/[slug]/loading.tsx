import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
	return (
		<main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
			{/* Breadcrumb Skeleton */}
			<div className="mb-6 flex items-center gap-2">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-4 w-4" />
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-4 w-4" />
				<Skeleton className="h-4 w-32" />
			</div>

			<div className="flex flex-col gap-10 lg:flex-row">
				{/* Left: Image Skeleton */}
				<div className="w-full lg:w-1/2">
					<Skeleton className="aspect-square w-full rounded-2xl" />
				</div>

				{/* Right: Info Skeletons */}
				<div className="flex w-full flex-col gap-6 lg:w-1/2">
					<div className="space-y-4">
						{/* Category */}
						<Skeleton className="h-6 w-24 rounded-md" />
						{/* Title */}
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-3/4" />
						{/* Price */}
						<Skeleton className="mt-4 h-12 w-48" />
						{/* Stock status */}
						<Skeleton className="h-5 w-32" />
					</div>

					<div className="h-px bg-border" />

					{/* Actions skeletons */}
					<div className="space-y-4">
						<Skeleton className="h-10 w-32" />
						<Skeleton className="h-14 w-full rounded-xl" />
					</div>

					<div className="h-px bg-border" />

					{/* Description skeletons */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>

					{/* Info box skeletons */}
					<div className="space-y-3 rounded-lg border border-border p-4">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-4 w-40" />
					</div>
				</div>
			</div>
		</main>
	);
}
