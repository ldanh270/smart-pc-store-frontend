export interface NavItem {
	label: string;
	href: string;
	children?: NavItem[];
}

// Static items that appear BEFORE the dynamic categories
// (Always visible, even when backend is offline)
export const STATIC_NAV_START: NavItem[] = [
	{ label: "Trang Chủ", href: "/" },
	{ label: "Sản Phẩm", href: "/san-pham" },
];

// Static items that appear AFTER the dynamic categories
export const STATIC_NAV_END: NavItem[] = [
	{ label: "Về Chúng Tôi", href: "/ve-chung-toi" },
];
