"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { STATIC_NAV_START, STATIC_NAV_END, type NavItem } from "@/configs/Routes";
import type { Category } from "@/types/category";
import { generateCategorySlug } from "@/types/category";
import NavLink from "./NavLink";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a nested NavItem tree from the flat category list.
 * Root categories (parentId === null) become top-level nav items.
 */
function buildCategoryTree(categories: Category[]): NavItem[] {
	const activeCategories = categories.filter((c) => c.status);

	// Group children by parentId
	const childrenMap = new Map<number, Category[]>();
	const roots: Category[] = [];

	for (const cat of activeCategories) {
		if (cat.parentId) {
			const list = childrenMap.get(cat.parentId) ?? [];
			list.push(cat);
			childrenMap.set(cat.parentId, list);
		} else {
			roots.push(cat);
		}
	}

	// Convert to NavItem tree
	return roots.map((root) => {
		const children = childrenMap.get(root.id) ?? [];

		return {
			label: root.name.toUpperCase(),
			href: `/danh-muc/${generateCategorySlug(root.name)}`,
			children: children.map((child) => ({
				label: child.name.toUpperCase(),
				href: `/danh-muc/${generateCategorySlug(child.name)}`,
			})),
		};
	});
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NavBar() {
	const [categoryItems, setCategoryItems] = useState<NavItem[]>([]);

	useEffect(() => {
		categoryService
			.getCategories()
			.then((cats) => setCategoryItems(buildCategoryTree(cats)))
			.catch(() => setCategoryItems([]));
	}, []);

	const navItems = [...STATIC_NAV_START, ...categoryItems, ...STATIC_NAV_END];

	return (
		<nav
			className="bg-background"
			aria-label="Main navigation"
		>
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<ul className="flex items-center justify-center gap-1">
					{navItems.map((item) => (
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
