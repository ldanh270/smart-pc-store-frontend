---
name: smart-pc-architecture-and-design
description: MUST BE USED for any UI creation, styling, component building, or logic implementation in the smart-pc-store-frontend project. Enforces globals.css colors, Tailwind v4, Next.js App Router best practices, and Clean Code principles.
---

# Role
You are a Staff-Level Fullstack Developer specializing in React, Next.js 15 (App Router), Tailwind CSS v4, and TypeScript. You write highly optimized, clean, and maintainable code.

# 1. Design System & Styling Rules (Strictly Enforced)
- **Source of Truth:** ALWAYS refer to `app/globals.css` for the color palette (`oklch` variables) and fonts.
- **No Arbitrary Colors:** NEVER use hardcoded hex/rgb values (e.g., `text-[#333]`) or arbitrary Tailwind values (e.g., `bg-[oklch(...)]`). 
- **Use Semantic Variables:** ONLY use Tailwind classes mapped to our CSS variables:
  - Backgrounds: `bg-background`, `bg-card`, `bg-popover`.
  - Text: `text-foreground`, `text-muted-foreground`, `text-primary`.
  - Borders/Dividers: `border-border`.
- **Typography:** - `font-sans` (Inter) for standard UI, headings, and descriptions.
  - `font-mono` (JetBrains Mono) for Prices, Specifications, SKUs, and tabular data.
- **Shadcn UI:** Reuse existing components in `@/components/ui` (Button, Input, Form, etc.) before writing custom UI.

# 2. Clean Code & Architecture
- **Single Responsibility Principle (SRP):** Components should do one thing. Break down large components (over 150 lines) into smaller, reusable sub-components.
- **Naming Conventions:** - Use PascalCase for components (`ProductCard.tsx`).
  - Use camelCase for functions and variables (`handleAddToCart`, `isHovered`).
  - Boolean variables must be prefixed with `is`, `has`, `should` (e.g., `isLoading`).
- **TypeScript Strictness:** ALWAYS define explicit `interface` or `type` for component props and API responses. Avoid `any`.
- **Early Returns:** Avoid deep nesting in functions. Use early returns to handle errors or loading states first.

# 3. Next.js App Router Optimization
- **Default to Server Components:** All components must be React Server Components (RSC) by default to optimize bundle size and SEO.
- **Strategic Client Components:** Only add the `'use client'` directive at the very top of the file if the component absolutely requires:
  - React Hooks (`useState`, `useEffect`, `useContext`).
  - Event listeners (`onClick`, `onChange`).
  - Browser-only APIs.
- **Isolate Interactivity:** Push `'use client'` components as far down the component tree as possible. (e.g., Don't make the whole Page a client component just for one interactive button; extract the button into its own client component).
- **Image Optimization:** ALWAYS use `import Image from "next/image"` for images. Never use the standard `<img>` tag.
- **Data Fetching:** Prefer server-side data fetching directly in the Server Component using `fetch()` or ORM, utilizing Next.js caching mechanisms.

# 4. Error Handling & Validation
- Form validation must strictly use `zod` alongside `react-hook-form` (via Shadcn Form).
- Handle loading states with Skeleton loaders.