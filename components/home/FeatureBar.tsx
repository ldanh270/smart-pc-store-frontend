import { Truck, Star, ShieldCheck, MessageSquare, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
	{
		icon: Truck,
		title: "Free Delivery",
		description: "Order over $50",
	},
	{
		icon: Star,
		title: "Best Quality",
		description: "Premium Brands",
	},
	{
		icon: ShieldCheck,
		title: "1 Year Warranty",
		description: "Free Returns",
	},
	{
		icon: MessageSquare,
		title: "24/7 Support",
		description: "99% Positive",
	},
	{
		icon: CreditCard,
		title: "Secure Payment",
		description: "100% Encrypted",
	},
];

export default function FeatureBar() {
	return (
		<div className="bg-primary/5 rounded-3xl p-10 md:p-12 border border-primary/10">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
				{features.map((feature, i) => {
					const Icon = feature.icon;
					return (
						<div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 group">
							<div className="p-4 rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
								<Icon className="size-8" strokeWidth={2} />
							</div>
							<div className="space-y-1">
								<h4 className="font-black text-lg text-foreground tracking-tight">{feature.title}</h4>
								<p className="text-sm text-muted-foreground font-medium">{feature.description}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
