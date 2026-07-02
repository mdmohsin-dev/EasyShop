"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/lib/types";
import { getCart, saveCart } from "@/lib/storage";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function persist(updated: CartItem[]) {
    setCart(updated);
    saveCart(updated);
  }

  function addToCart(product: Product) {
    const existing = cart.find((item) => item.productId === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((item) =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    }
    persist(updated);
  }

  function removeFromCart(productId: string) {
    persist(cart.filter((item) => item.productId !== productId));
  }

  function increment(productId: string) {
    persist(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decrement(productId: string) {
    const target = cart.find((item) => item.productId === productId);
    if (target && target.quantity <= 1) {
      removeFromCart(productId);
      return;
    }
    persist(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increment, decrement, totalItems, totalPrice }}
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
