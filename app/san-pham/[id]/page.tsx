import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api/products";
import ProductDetailClient from "./_components/ProductDetailClient";

interface ProductPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { id } = await params;
	const product = await fetchProductById(id);

	if (!product) {
		return { title: "Sản phẩm không tồn tại | Smart PC Store" };
	}

	return {
		title: `${product.productName} | Smart PC Store`,
		description:
			product.description ?? `Mua ${product.productName} tại Smart PC Store`,
	};
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
	const { id } = await params;
	const product = await fetchProductById(id);

	if (!product) {
		notFound();
	}

	return <ProductDetailClient product={product} />;
}
