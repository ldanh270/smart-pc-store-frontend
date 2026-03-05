// ─── Types ───────────────────────────────────────────────────────────────────

export interface Category {
	label: string;
	href: string;
	icon: string; // Lucide icon name
	description: string;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	image: string;
	date: string;
	author: string;
}

export interface HeroSlide {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	href: string;
	ctaLabel: string;
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────

export const HERO_SLIDES: HeroSlide[] = [
	{
		id: "1",
		title: "SMART PC TITAN",
		subtitle: "PC Gaming cao cấp — RTX 4090 | i9-14900K",
		image: "/hero/slide-pc-gaming.png",
		href: "/san-pham/smart-pc-titan-rtx-4090",
		ctaLabel: "Đặt Hàng Ngay",
	},
	{
		id: "2",
		title: "NVIDIA RTX 4090",
		subtitle: "Card đồ hoạ mạnh nhất thế giới — Sẵn hàng tại Smart PC",
		image: "/hero/slide-gpu.png",
		href: "/san-pham/nvidia-rtx-4090",
		ctaLabel: "Mua Ngay",
	},
	{
		id: "3",
		title: "GAMING SETUP",
		subtitle: "Trọn bộ setup gaming từ A-Z — Tư vấn miễn phí",
		image: "/hero/slide-setup.png",
		href: "/pc-laptop/pc-gaming",
		ctaLabel: "Khám Phá",
	},
];

// ─── Mock Categories ─────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
	{
		label: "CPU",
		href: "/danh-muc/cpu",
		icon: "Cpu",
		description: "Bộ xử lý Intel & AMD",
	},
	{
		label: "GPU",
		href: "/danh-muc/gpu",
		icon: "Monitor",
		description: "Card đồ hoạ Gaming",
	},
	{
		label: "RAM",
		href: "/danh-muc/ram",
		icon: "MemoryStick",
		description: "DDR4 & DDR5",
	},
	{
		label: "Ổ Cứng",
		href: "/danh-muc/ổ-cứng",
		icon: "HardDrive",
		description: "SSD NVMe & SATA",
	},
	{
		label: "Mainboard",
		href: "/danh-muc/mainboard",
		icon: "CircuitBoard",
		description: "Bo mạch chủ",
	},
	{
		label: "PC Gaming",
		href: "/danh-muc/pc-gaming",
		icon: "Gamepad2",
		description: "PC chơi game",
	},
	{
		label: "Laptop",
		href: "/danh-muc/laptop",
		icon: "Laptop",
		description: "Laptop Gaming & Văn Phòng",
	},
	{
		label: "Màn Hình",
		href: "/danh-muc/màn-hình",
		icon: "MonitorDot",
		description: "Màn hình Gaming & Đồ Hoạ",
	},
];

// ─── Mock Blog Posts ─────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
	{
		id: "1",
		title: "Hướng dẫn build PC Gaming 2025 từ A-Z",
		slug: "huong-dan-build-pc-gaming-2025",
		excerpt:
			"Tất tần tật về cách lựa chọn linh kiện, lắp ráp và tối ưu hiệu năng cho dàn PC Gaming của bạn.",
		image: "/blog/placeholder.svg",
		date: "2025-02-25",
		author: "Smart PC Team",
	},
	{
		id: "2",
		title: "RTX 5090 vs RTX 4090: So sánh chi tiết",
		slug: "rtx-5090-vs-rtx-4090",
		excerpt:
			"Nvidia RTX 5090 có thật sự đáng để nâng cấp? Xem so sánh hiệu năng, giá cả và tính năng mới.",
		image: "/blog/placeholder.svg",
		date: "2025-02-20",
		author: "Smart PC Team",
	},
	{
		id: "3",
		title: "Top 5 màn hình gaming 4K đáng mua nhất",
		slug: "top-5-man-hinh-gaming-4k",
		excerpt:
			"Danh sách những màn hình gaming 4K tốt nhất với tần số quét cao, thời gian phản hồi thấp.",
		image: "/blog/placeholder.svg",
		date: "2025-02-15",
		author: "Smart PC Team",
	},
];

