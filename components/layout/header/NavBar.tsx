"use client";

import { NAV_ITEMS } from "@/configs/Routes";
import NavLink from "./NavLink";

export default function NavBar() {
	return (
		<nav
			className="bg-background"
			aria-label="Main navigation"
		>
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<ul className="flex items-center justify-center gap-1">
					{NAV_ITEMS.map((item) => (
						<NavLink
							key={item.href}
							item={item}
						/>
					))}
				</ul>
			</div>
		</nav>
	);
}
