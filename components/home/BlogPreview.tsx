import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { BLOG_POSTS } from "@/configs/mock-data";
import SectionHeader from "@/components/shared/SectionHeader";

export default function BlogPreview() {
	return (
		<section className="bg-background py-16">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<SectionHeader
					title="Tin Tức & Bài Viết"
					subtitle="Cập nhật xu hướng công nghệ và hướng dẫn build PC"
					viewAllHref="/tin-tuc"
				/>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{BLOG_POSTS.map((post) => (
						<Link
							key={post.id}
							href={`/tin-tuc/${post.slug}`}
							className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5"
						>
							{/* Image */}
							<div className="relative aspect-video overflow-hidden">
								<Image
									src={post.image}
									alt={post.title}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>

							{/* Content */}
							<div className="flex flex-col gap-2 p-5">
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<CalendarDays className="size-3.5" />
									<time dateTime={post.date}>
										{new Date(
											post.date
										).toLocaleDateString("vi-VN", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</time>
								</div>

								<h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
									{post.title}
								</h3>

								<p className="line-clamp-2 text-sm text-muted-foreground">
									{post.excerpt}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
