import { Separator } from "@/components/ui/separator";
import TopBar from "./header/TopBar";
import NavBar from "./header/NavBar";

export default function Header() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
			<TopBar />
			<Separator />
			<NavBar />
		</header>
	);
}
