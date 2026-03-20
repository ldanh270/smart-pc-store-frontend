import { NavItem } from "@/configs/Routes"
import { cn } from "@/lib/utils"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
  const hasChildren = item.children && item.children.length > 0

  return (
    <li className="group relative">
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown className="size-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
        )}

        {/* Active indicator — animated underline */}
        <span
          className={cn(
            "bg-primary absolute right-3 bottom-0 left-3 h-0.5 rounded-full transition-all duration-300",
            isActive
              ? "scale-x-100 opacity-100"
              : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60",
          )}
        />
      </Link>

      {/* Dropdown */}
      {hasChildren && (
        <ul className="border-border/60 bg-popover/95 invisible absolute top-full left-0 z-50 min-w-52 rounded-xl border p-1.5 opacity-0 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
          {item.children!.map((child) => {
            const childActive = pathname === child.href
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    childActive
                      ? "bg-primary/10 text-primary"
                      : "text-popover-foreground/80 hover:bg-primary hover:text-accent-foreground",
                  )}
                >
                  {child.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
