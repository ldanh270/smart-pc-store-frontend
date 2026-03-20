import { cn } from "@/lib/utils"

const BRANDS = [
  { name: "AMD", logo: "/brands/amd.svg" },
  { name: "NVIDIA", logo: "/brands/nvidia.svg" },
  { name: "ASUS", logo: "/brands/asus.svg" },
  { name: "MSI", logo: "/brands/msi.svg" },
  { name: "Gigabyte", logo: "/brands/gigabyte.svg" },
  { name: "Samsung", logo: "/brands/samsung.svg" },
  { name: "Intel", logo: "/brands/intel.svg" },
]

export default function BrandsList() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center space-y-3 text-center">
        <h3 className="text-primary/80 text-xs font-bold tracking-[0.3em] uppercase">
          Đối tác hàng đầu
        </h3>
        <h2 className="text-foreground text-2xl font-black tracking-tight md:text-3xl">
          Thương Hiệu <span className="text-primary">Đồng Hành</span>
        </h2>
        <div className="from-primary mt-2 h-1 w-14 rounded-full bg-linear-to-r to-transparent" />
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        {/* Row 1: 4 Brands */}
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 grayscale transition-all duration-700 hover:grayscale-0 md:gap-12">
          {BRANDS.slice(0, 4).map((brand) => (
            <div
              key={brand.name}
              className={cn(
                "group min-w-30in-w-[160px] relative flex items-center justify-center px-6 py-4",
                "cursor-default transition-all duration-500 hover:scale-110 hover:opacity-100",
              )}
            >
              <span className="text-foreground group-hover:text-primary text-xl font-black tracking-tighter transition-colors md:text-3xl">
                {brand.name}
              </span>
              <div className="bg-primary/5 absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Row 2: 3 Brands */}
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 grayscale transition-all duration-700 hover:grayscale-0 md:gap-12">
          {BRANDS.slice(4, 7).map((brand) => (
            <div
              key={brand.name}
              className={cn(
                "group relative flex min-w-30 items-center justify-center px-6 py-4 md:min-w-40",
                "cursor-default transition-all duration-500 hover:scale-110 hover:opacity-100",
              )}
            >
              <span className="text-foreground group-hover:text-primary text-xl font-black tracking-tighter transition-colors md:text-3xl">
                {brand.name}
              </span>
              <div className="bg-primary/5 absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
