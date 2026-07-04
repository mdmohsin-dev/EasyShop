"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface GuestCartItem {
  productId: string;
  quantity: number;
}

const GUEST_CART_KEY = "guest_cart";

function readGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: GuestCartItem[]) {
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  isGuest: boolean;
  addToCart: (product: { id: string; name: string; price: number; image: string }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increment: (productId: string) => Promise<void>;
  decrement: (productId: string) => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const isLoggedIn = !!session?.user;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasMergedRef = useRef(false);

  async function fetchDbCart() {
    const res = await fetch("/api/cart");
    if (!res.ok) return;
    const data = await res.json();
    setCart(
      data.cart.map((item: { productId: string; quantity: number; product: { name: string; price: number; image: string } }) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
      }))
    );
  }

  function loadGuestCart() {
    const raw = window.localStorage.getItem("guest_cart_full");
    setCart(raw ? JSON.parse(raw) : []);
  }

  function persistGuestCart(items: CartItem[]) {
    window.localStorage.setItem("guest_cart_full", JSON.stringify(items));
    writeGuestCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
  }

  useEffect(() => {
    if (isPending) return;

    if (isLoggedIn) {
      (async () => {
        if (!hasMergedRef.current) {
          hasMergedRef.current = true;
          const guestItems = readGuestCart();
          if (guestItems.length > 0) {
            await fetch("/api/cart/merge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: guestItems }),
            });
            window.localStorage.removeItem(GUEST_CART_KEY);
            window.localStorage.removeItem("guest_cart_full");
          }
        }
        await fetchDbCart();
        setLoading(false);
      })();
    } else {
      loadGuestCart();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isPending]);

  async function addToCart(product: { id: string; name: string; price: number; image: string }) {
    if (isLoggedIn) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      await fetchDbCart();
    } else {
      const existing = cart.find((i) => i.productId === product.id);
      const updated = existing
        ? cart.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...cart, { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
      setCart(updated);
      persistGuestCart(updated);
    }
  }

  async function setQuantity(productId: string, quantity: number) {
    if (isLoggedIn) {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      await fetchDbCart();
    } else {
      const updated =
        quantity === 0
          ? cart.filter((i) => i.productId !== productId)
          : cart.map((i) => (i.productId === productId ? { ...i, quantity } : i));
      setCart(updated);
      persistGuestCart(updated);
    }
  }

  async function removeFromCart(productId: string) {
    await setQuantity(productId, 0);
  }

  async function increment(productId: string) {
    const item = cart.find((i) => i.productId === productId);
    await setQuantity(productId, (item?.quantity ?? 0) + 1);
  }

  async function decrement(productId: string) {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;
    await setQuantity(productId, item.quantity - 1);
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isGuest: !isLoggedIn,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        totalItems,
        totalPrice,
        refreshCart: fetchDbCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
