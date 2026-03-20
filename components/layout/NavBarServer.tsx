import Header from "@/components/layout/Header"
import { fetchAllCategories } from "@/lib/api/categories"
import { type Category, mapBackendCategory } from "@/types/category"

/**
 * NavBarServer — async Server Component.
 * Fetches categories at request time so they are included in the
 * server-rendered HTML (SSR) → nav links indexed by search engines.
 * The result is passed into Header → NavBar as `initialCategories`.
 */
export default async function NavBarServer() {
  let initialCategories: Category[] = []

  try {
    const backend = await fetchAllCategories()
    initialCategories = backend.map(mapBackendCategory)
  } catch {
    // Graceful degradation: nav still renders with static items
  }

  return <Header initialCategories={initialCategories} />
}
