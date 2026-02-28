// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	originalPrice?: number;
	image: string;
	category: string;
	badge?: string;
}

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

// ─── Mock Categories ─────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
	{
		label: "CPU",
		href: "/linh-kien/cpu",
		icon: "Cpu",
		description: "Bộ xử lý Intel & AMD",
	},
	{
		label: "GPU",
		href: "/linh-kien/gpu",
		icon: "Monitor",
		description: "Card đồ hoạ Gaming",
	},
	{
		label: "RAM",
		href: "/linh-kien/ram",
		icon: "MemoryStick",
		description: "DDR4 & DDR5",
	},
	{
		label: "Ổ Cứng",
		href: "/linh-kien/o-cung",
		icon: "HardDrive",
		description: "SSD NVMe & SATA",
	},
	{
		label: "Mainboard",
		href: "/linh-kien/mainboard",
		icon: "CircuitBoard",
		description: "Bo mạch chủ",
	},
	{
		label: "PC Gaming",
		href: "/pc-laptop/pc-gaming",
		icon: "Gamepad2",
		description: "PC chơi game",
	},
	{
		label: "Laptop",
		href: "/pc-laptop/laptop-gaming",
		icon: "Laptop",
		description: "Laptop Gaming & Văn Phòng",
	},
	{
		label: "Màn Hình",
		href: "/man-hinh",
		icon: "MonitorDot",
		description: "Màn hình Gaming & Đồ Hoạ",
	},
];

// ─── Mock Products ───────────────────────────────────────────────────────────

export const NEW_PRODUCTS: Product[] = [
	{
		id: "1",
		name: "Intel Core i9-14900K",
		slug: "intel-core-i9-14900k",
		price: 14990000,
		originalPrice: 16490000,
		image: "/products/placeholder.svg",
		category: "CPU",
		badge: "Mới",
	},
	{
		id: "2",
		name: "NVIDIA RTX 4070 Ti SUPER",
		slug: "nvidia-rtx-4070-ti-super",
		price: 21990000,
		image: "/products/placeholder.svg",
		category: "GPU",
		badge: "Hot",
	},
	{
		id: "3",
		name: "G.Skill Trident Z5 RGB 32GB",
		slug: "gskill-trident-z5-rgb-32gb",
		price: 3890000,
		originalPrice: 4290000,
		image: "/products/placeholder.svg",
		category: "RAM",
	},
	{
		id: "4",
		name: "Samsung 990 PRO 2TB NVMe",
		slug: "samsung-990-pro-2tb",
		price: 5490000,
		image: "/products/placeholder.svg",
		category: "SSD",
		badge: "Mới",
	},
];

export const GAMING_PCS: Product[] = [
	{
		id: "5",
		name: "Smart PC Titan — RTX 4090",
		slug: "smart-pc-titan-rtx-4090",
		price: 89990000,
		image: "/products/placeholder.svg",
		category: "PC Gaming",
		badge: "Best Seller",
	},
	{
		id: "6",
		name: "Smart PC Storm — RTX 4070",
		slug: "smart-pc-storm-rtx-4070",
		price: 32990000,
		originalPrice: 35990000,
		image: "/products/placeholder.svg",
		category: "PC Gaming",
	},
	{
		id: "7",
		name: "Smart PC Spark — RTX 4060",
		slug: "smart-pc-spark-rtx-4060",
		price: 22990000,
		image: "/products/placeholder.svg",
		category: "PC Gaming",
	},
	{
		id: "8",
		name: "Smart PC Office Pro",
		slug: "smart-pc-office-pro",
		price: 12990000,
		image: "/products/placeholder.svg",
		category: "PC Văn Phòng",
	},
];

export const HOT_ACCESSORIES: Product[] = [
	{
		id: "9",
		name: "Logitech G PRO X Superlight 2",
		slug: "logitech-g-pro-x-superlight-2",
		price: 3290000,
		image: "/products/placeholder.svg",
		category: "Chuột",
		badge: "Hot",
	},
	{
		id: "10",
		name: "Keychron Q1 Max",
		slug: "keychron-q1-max",
		price: 4890000,
		originalPrice: 5290000,
		image: "/products/placeholder.svg",
		category: "Bàn Phím",
	},
	{
		id: "11",
		name: "Sony WH-1000XM5",
		slug: "sony-wh-1000xm5",
		price: 7490000,
		image: "/products/placeholder.svg",
		category: "Tai Nghe",
	},
	{
		id: "12",
		name: "LG UltraGear 27GP850-B",
		slug: "lg-ultragear-27gp850-b",
		price: 9990000,
		originalPrice: 11490000,
		image: "/products/placeholder.svg",
		category: "Màn Hình",
		badge: "Sale",
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(price);
}
