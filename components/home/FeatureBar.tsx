import { cn } from "@/lib/utils"

import { CreditCard, History, MessageSquare, Star, Truck } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "from $40",
  },
  {
    icon: Star,
    title: "Best Quality",
    description: "Brand",
  },
  {
    icon: History,
    title: "1 Year",
    description: "for free Return",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    description: "99% Real Data",
  },
  {
    icon: CreditCard,
    title: "Payment",
    description: "Secure",
  },
]

export default function FeatureBar() {
  return (
    <div className="bg-background">
      <div className="grid grid-cols-1 items-center sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <div
              key={i}
              className={cn(
                "group flex items-center justify-center gap-4 px-6 py-4 transition-all duration-300 lg:justify-start lg:py-0",
                // Add border except for the last item on large screens
                i !== features.length - 1 && "lg:border-border/60 lg:border-r",
              )}
            >
              <div className="text-primary flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-8" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-foreground text-sm font-black tracking-tight whitespace-nowrap">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
