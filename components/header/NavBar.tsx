"use client"

import { type NavItem, STATIC_NAV_END, STATIC_NAV_START } from "@/configs/Routes"
import { cn } from "@/lib/utils"
import { categoryService } from "@/services/categoryService"
import type { Category } from "@/types/category"
import { generateCategorySlug } from "@/types/category"

import { useEffect, useState } from "react"

import NavLink from "./NavLink"

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a nested NavItem tree from the flat category list.
 * Root categories (parentId === null) become top-level nav items.
 */
function buildCategoryTree(categories: Category[]): NavItem[] {
  const activeCategories = categories.filter((c) => c.status)

  // Group children by parentId
  const childrenMap = new Map<string, Category[]>()
  const roots: Category[] = []

  for (const cat of activeCategories) {
    if (cat.parentId) {
      const list = childrenMap.get(cat.parentId) ?? []
      list.push(cat)
      childrenMap.set(cat.parentId, list)
    } else {
      roots.push(cat)
    }
  }

  // Convert to NavItem tree
  return roots.map((root) => {
    const children = childrenMap.get(root.id) ?? []

    return {
      label: root.name,
      href: `/danh-muc/${generateCategorySlug(root.name)}`,
      children: children.map((child) => ({
        label: child.name,
        href: `/danh-muc/${generateCategorySlug(child.name)}`,
      })),
    }
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

interface NavBarProps {
  /** Pre-fetched by NavBarServer (RSC) — eliminates the client-side fetch
   *  and ensures category links are present in the SSR HTML for crawlers. */
  initialCategories?: Category[]
}

export default function NavBar({ initialCategories = [] }: NavBarProps) {
  // Seed state from SSR-provided categories so nav is populated on first paint
  const [categoryItems, setCategoryItems] = useState<NavItem[]>(() =>
    buildCategoryTree(initialCategories),
  )
  const [isLoading, setIsLoading] = useState(initialCategories.length === 0)

  useEffect(() => {
    // Only re-fetch on the client when no SSR data was provided
    if (initialCategories.length > 0) {
      setIsLoading(false)
      return
    }
    categoryService
      .getCategories()
      .then((cats) => setCategoryItems(buildCategoryTree(cats)))
      .catch(() => setCategoryItems([]))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navItems = [...STATIC_NAV_START, ...categoryItems, ...STATIC_NAV_END]

  return (
    <nav className="" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          {/* #7 skeleton placeholders shown while categories load */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <li key={`skeleton-${i}`} aria-hidden="true">
                <div
                  className={cn(
                    "bg-background h-4 animate-pulse rounded-md",
                    i % 2 === 0 ? "w-16" : "w-20",
                  )}
                />
              </li>
            ))}
        </ul>
      </div>
    </nav>
  )
}
