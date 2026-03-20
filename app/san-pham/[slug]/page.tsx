import { fetchProductBySlug } from "@/lib/api/products"

import type { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductDetailClient from "./_components/ProductDetailClient"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)

  if (!product) {
    return { title: "Sản phẩm không tồn tại | Smart PC Store" }
  }

  return {
    title: `${product.productName} | Smart PC Store`,
    description: product.description ?? `Mua ${product.productName} tại Smart PC Store`,
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
