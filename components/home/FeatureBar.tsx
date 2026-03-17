import { Truck, Star, History, MessageSquare, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

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
];

export default function FeatureBar() {
	return (
		<div className="bg-background">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center">
				{features.map((feature, i) => {
					const Icon = feature.icon;
					return (
						<div 
							key={i} 
							className={cn(
								"flex items-center justify-center lg:justify-start gap-4 px-6 py-4 lg:py-0 transition-all duration-300 group",
								// Add border except for the last item on large screens
								i !== features.length - 1 && "lg:border-r lg:border-border/60"
							)}
						>
							<div className="flex shrink-0 items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
								<Icon className="size-8" strokeWidth={2.5} />
							</div>
							<div className="flex flex-col text-left">
								<h4 className="font-black text-sm text-foreground tracking-tight whitespace-nowrap">
									{feature.title}
								</h4>
								<p className="text-xs text-muted-foreground font-medium whitespace-nowrap">
									{feature.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
