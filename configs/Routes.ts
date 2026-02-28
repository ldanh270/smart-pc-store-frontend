export interface NavItem {
	label: string;
	href: string;
	children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
	{ label: "Trang Chủ", href: "/" },
	{
		label: "Linh Kiện PC",
		href: "/linh-kien",
		children: [
			{ label: "CPU", href: "/linh-kien/cpu" },
			{ label: "GPU", href: "/linh-kien/gpu" },
			{ label: "RAM", href: "/linh-kien/ram" },
			{ label: "Ổ cứng", href: "/linh-kien/o-cung" },
			{ label: "Mainboard", href: "/linh-kien/mainboard" },
			{ label: "Nguồn", href: "/linh-kien/nguon" },
			{ label: "Tản nhiệt", href: "/linh-kien/tan-nhiet" },
			{ label: "Case", href: "/linh-kien/case" },
		],
	},
	{
		label: "PC & Laptop",
		href: "/pc-laptop",
		children: [
			{ label: "PC Gaming", href: "/pc-laptop/pc-gaming" },
			{ label: "PC Đồ Hoạ", href: "/pc-laptop/pc-do-hoa" },
			{ label: "PC Văn Phòng", href: "/pc-laptop/pc-van-phong" },
			{ label: "Laptop Gaming", href: "/pc-laptop/laptop-gaming" },
			{ label: "Laptop Văn Phòng", href: "/pc-laptop/laptop-van-phong" },
		],
	},
	{
		label: "Màn Hình",
		href: "/man-hinh",
		children: [
			{ label: "Màn Hình Gaming", href: "/man-hinh/gaming" },
			{ label: "Màn Hình Đồ Hoạ", href: "/man-hinh/do-hoa" },
			{ label: "Màn Hình Văn Phòng", href: "/man-hinh/van-phong" },
		],
	},
	{
		label: "Phụ Kiện",
		href: "/phu-kien",
		children: [
			{ label: "Bàn Phím", href: "/phu-kien/ban-phim" },
			{ label: "Chuột", href: "/phu-kien/chuot" },
			{ label: "Tai Nghe", href: "/phu-kien/tai-nghe" },
			{ label: "Loa", href: "/phu-kien/loa" },
			{ label: "Bàn & Ghế Gaming", href: "/phu-kien/ban-ghe" },
		],
	},
	{ label: "Tin Tức", href: "/tin-tuc" },
	{ label: "Về Chúng Tôi", href: "/ve-chung-toi" },
];
