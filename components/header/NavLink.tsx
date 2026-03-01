import { NavItem } from "@/configs/Routes";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ item }: { item: NavItem }) {
	const pathname = usePathname();
	const isActive =
		pathname === item.href || pathname.startsWith(`${item.href}/`);
	const hasChildren = item.children && item.children.length > 0;

	return (
		<li className="group relative">
			<Link
				href={item.href}
				className={cn(
					"flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors",
					isActive
						? "text-primary"
						: "text-foreground hover:text-primary"
				)}
			>
				{item.label}
				{hasChildren && (
					<ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
				)}
			</Link>

			{/* Dropdown */}
			{hasChildren && (
				<ul className="invisible absolute left-0 top-full z-50 min-w-48 rounded-md border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
					{item.children!.map((child) => (
						<li key={child.href}>
							<Link
								href={child.href}
								className="block rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								{child.label}
							</Link>
						</li>
					))}
				</ul>
			)}
		</li>
	);
}