import {
	type BackendCategory,
	type CategoryDetail,
	type BackendCategoryDetail,
	mapBackendCategoryDetail,
	generateCategorySlug,
} from "@/types/category";
import { buildApiUrl } from "./base-url";

// ─── Fetch All Categories (Server-Side) ───────────────────────────────────────

export async function fetchAllCategories(): Promise<BackendCategory[]> {
	try {
		const res = await fetch(buildApiUrl("/categories"), {
			next: { revalidate: 60 },
		});
		if (!res.ok) return [];

		const json = await res.json();
		const data =
			Array.isArray(json.data) ? json.data
			: Array.isArray(json.content) ? json.content
			: Array.isArray(json) ? json
			: [];
		return data;
	} catch (error) {
		console.error("Error fetching all categories:", error);
		return [];
	}
}

// ─── Fetch Category Detail by Slug (Server-Side) ───────────────────────────

export async function fetchCategoryBySlug(
	slug: string
): Promise<CategoryDetail | null> {
	try {
		// 1. Fetch all categories to resolve slug → id
		const categories = await fetchAllCategories();

		const decodedSlug = decodeURIComponent(slug);
		const matched = categories.find(
			(c) => generateCategorySlug(c.categoryName) === decodedSlug
		);

		if (!matched) return null;

		// 2. Fetch detail by id
		const res = await fetch(buildApiUrl(`/categories/${matched.id}`), {
			next: { revalidate: 60 },
		});

		if (!res.ok) return null;

		const json = await res.json();
		const raw: BackendCategoryDetail | null = json.data ?? json ?? null;
		if (!raw) return null;

		return mapBackendCategoryDetail(raw);
	} catch (error) {
		console.error("Error fetching category by slug:", error);
		return null;
	}
}
