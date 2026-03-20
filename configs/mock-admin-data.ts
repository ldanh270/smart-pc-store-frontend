export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface Order {
  id: number
  customerName: string
  email: string
  total: number
  status: OrderStatus
  itemCount: number
  createdAt: string
}

export const MOCK_REVENUE_CHART = [
  { date: "24/02", revenue: 18_500_000, orders: 42 },
  { date: "25/02", revenue: 22_300_000, orders: 51 },
  { date: "26/02", revenue: 19_800_000, orders: 45 },
  { date: "27/02", revenue: 25_600_000, orders: 58 },
  { date: "28/02", revenue: 21_200_000, orders: 48 },
  { date: "01/03", revenue: 28_400_000, orders: 64 },
  { date: "02/03", revenue: 21_000_000, orders: 34 },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: 1001,
    customerName: "John Doe",
    email: "john@gmail.com",
    total: 25_990_000,
    status: "delivered",
    itemCount: 3,
    createdAt: "2026-03-02",
  },
  {
    id: 1002,
    customerName: "Trần Thị B",
    email: "tranthib@yahoo.com",
    total: 45_500_000,
    status: "shipped",
    itemCount: 2,
    createdAt: "2026-03-01",
  },
  {
    id: 1003,
    customerName: "Lê Văn C",
    email: "levanc@hotmail.com",
    total: 12_300_000,
    status: "processing",
    itemCount: 1,
    createdAt: "2026-03-01",
  },
  {
    id: 1004,
    customerName: "Phạm Thị D",
    email: "phamthid@gmail.com",
    total: 8_790_000,
    status: "pending",
    itemCount: 4,
    createdAt: "2026-02-28",
  },
  {
    id: 1005,
    customerName: "Hoàng Văn E",
    email: "hoangvane@gmail.com",
    total: 67_200_000,
    status: "cancelled",
    itemCount: 5,
    createdAt: "2026-02-27",
  },
]

export interface AdminProduct {
  id: number
  productName: string
  description: string | null
  imageUrl: string | null
  currentPrice: number
  quantity: number
  categoryId: number
  categoryName: string
  supplierId: number
  status: boolean
}

export const MOCK_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: 1,
    productName: "CPU Intel Core i9-14900K",
    description: "Bộ vi xử lý Intel thế hệ 14",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 14_990_000,
    quantity: 25,
    categoryId: 1,
    categoryName: "CPU",
    supplierId: 1,
    status: true,
  },
  {
    id: 2,
    productName: "GPU NVIDIA RTX 4090",
    description: "Card đồ họa cao cấp nhất",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 45_990_000,
    quantity: 8,
    categoryId: 2,
    categoryName: "GPU",
    supplierId: 1,
    status: true,
  },
  {
    id: 3,
    productName: "RAM Corsair Vengeance 32GB DDR5",
    description: "RAM DDR5 6000MHz CL30",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 3_290_000,
    quantity: 50,
    categoryId: 3,
    categoryName: "RAM",
    supplierId: 2,
    status: true,
  },
  {
    id: 4,
    productName: "SSD Samsung 990 Pro 2TB",
    description: "Ổ cứng NVMe Gen4 tốc độ cao",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 5_490_000,
    quantity: 30,
    categoryId: 5,
    categoryName: "Ổ cứng SSD",
    supplierId: 3,
    status: true,
  },
  {
    id: 5,
    productName: "Mainboard ASUS ROG Maximus Z790",
    description: "Bo mạch chủ cao cấp cho Intel Gen 13/14",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 12_990_000,
    quantity: 12,
    categoryId: 4,
    categoryName: "Mainboard",
    supplierId: 1,
    status: true,
  },
  {
    id: 6,
    productName: "PSU Corsair RM1000x",
    description: "Nguồn 1000W 80 Plus Gold",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 4_590_000,
    quantity: 20,
    categoryId: 6,
    categoryName: "Nguồn (PSU)",
    supplierId: 2,
    status: true,
  },
  {
    id: 7,
    productName: "Case Lian Li O11 Dynamic",
    description: "Vỏ máy tính cao cấp",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 3_890_000,
    quantity: 15,
    categoryId: 7,
    categoryName: "Case",
    supplierId: 3,
    status: true,
  },
  {
    id: 8,
    productName: "Tản nhiệt nước NZXT Kraken Elite 360",
    description: "Tản nhiệt AIO có màn hình LCD",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 7_290_000,
    quantity: 10,
    categoryId: 8,
    categoryName: "Tản nhiệt",
    supplierId: 1,
    status: true,
  },
  {
    id: 9,
    productName: "Fan Case Noctua NF-A12x25",
    description: "Quạt case siêu êm",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 850_000,
    quantity: 100,
    categoryId: 8,
    categoryName: "Tản nhiệt",
    supplierId: 2,
    status: true,
  },
  {
    id: 10,
    productName: "Chuột Logitech G Pro X Superlight 2",
    description: "Chuột gaming không dây siêu nhẹ",
    imageUrl: "/products/placeholder.svg",
    currentPrice: 3_890_000,
    quantity: 40,
    categoryId: 9,
    categoryName: "Chuột",
    supplierId: 3,
    status: true,
  },
]
