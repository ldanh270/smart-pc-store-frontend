import { fetchAllCategories, fetchCategoryBySlug } from "@/lib/api/categories"

import type { Metadata } from "next"
import { notFound } from "next/navigation"

import CategoryDetailClient from "./_components/CategoryDetailClient"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await fetchCategoryBySlug(slug)

  if (!category) {
    return { title: "Danh mục không tồn tại | Smart PC Store" }
  }

  return {
    title: `${category.name} | Smart PC Store`,
    description: category.description ?? `Xem các sản phẩm thuộc danh mục ${category.name}`,
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, allCategories] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchAllCategories(),
  ])

  if (!category) {
    notFound()
  }

  return <CategoryDetailClient category={category} allCategories={allCategories} />
}
