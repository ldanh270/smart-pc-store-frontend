export interface NavItem {
	label: string;
	href: string;
	children?: NavItem[];
}

// Static items that appear before the dynamic categories
export const STATIC_NAV_START: NavItem[] = [
	{ label: "Trang Chủ", href: "/" },
];

// Static items that appear after the dynamic categories
export const STATIC_NAV_END: NavItem[] = [
	{ label: "Tin Tức", href: "/tin-tuc" },
	{ label: "Về Chúng Tôi", href: "/ve-chung-toi" },
];
