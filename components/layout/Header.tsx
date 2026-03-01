import NavBar from "@/components/header/NavBar";
import TopBar from "@/components/header/TopBar";
import { Separator } from "@/components/ui/separator";


export default function Header() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
			<TopBar />
			<Separator />
			<NavBar />
		</header>
	);
}
