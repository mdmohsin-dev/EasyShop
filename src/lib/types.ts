export type Role = "admin" | "customer";

export type Category = "Electronics" | "Accessories" | "Apparel";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // stored in localStorage only — demo/assignment purposes
  role: Role;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // base64 data URL, chosen from local computer
  category: Category;
  rating: number; // 0–5
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
