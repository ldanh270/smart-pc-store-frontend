import {
  type BackendCategory,
  type BackendCategoryDetail,
  type CategoryDetail,
  mapBackendCategoryDetail,
} from "@/types/category"

import { buildApiUrl } from "./base-url"

// ─── Fetch All Categories (Server-Side) ───────────────────────────────────────

export async function fetchAllCategories(): Promise<BackendCategory[]> {
  try {
    const res = await fetch(buildApiUrl("/categories"), {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Expected JSON but got ${contentType}. URL: ${buildApiUrl("/categories")}`)
      return []
    }

    const json = await res.json()
    const data = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.content)
        ? json.content
        : Array.isArray(json)
          ? json
          : []
    return data
  } catch (error) {
    console.error("Error fetching all categories:", error)
    return []
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)

    // Fetch detail by slug directly
    const res = await fetch(buildApiUrl(`/categories/${decodedSlug}`), {
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error(
        `Expected JSON but got ${contentType}. URL: ${buildApiUrl(`/categories/${decodedSlug}`)}`,
      )
      return null
    }

    const json = await res.json()
    const raw: BackendCategoryDetail | null = json.data ?? json ?? null
    if (!raw) return null

    return mapBackendCategoryDetail(raw)
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    return null
  }
}
