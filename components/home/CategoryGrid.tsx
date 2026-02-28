import Link from "next/link";
import {
	Cpu,
	Monitor,
	MemoryStick,
	HardDrive,
	CircuitBoard,
	Gamepad2,
	Laptop,
	MonitorDot,
} from "lucide-react";
import { CATEGORIES } from "@/configs/mock-data";
import SectionHeader from "@/components/shared/SectionHeader";

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
	Cpu,
	Monitor,
	MemoryStick,
	HardDrive,
	CircuitBoard,
	Gamepad2,
	Laptop,
	MonitorDot,
};

export default function CategoryGrid() {
	return (
		<section className="bg-background py-16">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<SectionHeader
					title="Danh Mục Sản Phẩm"
					subtitle="Tìm kiếm linh kiện và thiết bị phù hợp với nhu cầu của bạn"
				/>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
					{CATEGORIES.map((category) => {
						const Icon = ICON_MAP[category.icon] ?? Cpu;
						return (
							<Link
								key={category.href}
								href={category.href}
								className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
							>
								<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
									<Icon className="size-6" />
								</div>
								<div className="text-center">
									<p className="text-sm font-semibold text-foreground">
										{category.label}
									</p>
									<p className="mt-0.5 hidden text-xs text-muted-foreground lg:block">
										{category.description}
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
