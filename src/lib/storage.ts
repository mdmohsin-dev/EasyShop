import { User, Product, CartItem } from "./types";

const KEYS = {
  users: "ecom_users",
  products: "ecom_products",
  cart: "ecom_cart",
  session: "ecom_session",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ---- Users ----
export function getUsers(): User[] {
  return read<User[]>(KEYS.users, []);
}
export function saveUsers(users: User[]) {
  write(KEYS.users, users);
}

// ---- Products ----
export function getProducts(): Product[] {
  return read<Product[]>(KEYS.products, []);
}
export function saveProducts(products: Product[]) {
  write(KEYS.products, products);
}

// ---- Cart ----
export function getCart(): CartItem[] {
  return read<CartItem[]>(KEYS.cart, []);
}
export function saveCart(cart: CartItem[]) {
  write(KEYS.cart, cart);
}

// ---- Session ----
export function getSession(): string | null {
  return read<string | null>(KEYS.session, null);
}
export function saveSession(userId: string | null) {
  write(KEYS.session, userId);
}

export function seedAdminIfEmpty() {
  const users = getUsers();
  if (users.length === 0) {
    const admin: User = {
      id: crypto.randomUUID(),
      name: "Admin",
      email: "admin@shop.com",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    saveUsers([admin]);
  }
}
