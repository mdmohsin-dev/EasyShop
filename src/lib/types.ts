export type Role = "ADMIN" | "CUSTOMER";

export type Category = "ELECTRONICS" | "ACCESSORIES" | "APPAREL";

export const CATEGORY_LABELS: Record<Category, string> = {
  ELECTRONICS: "Electronics",
  ACCESSORIES: "Accessories",
  APPAREL: "Apparel",
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  rating: number;
  featured: boolean;
  createdAt: string;
}

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  transactionId: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}
