"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getProducts, saveProducts } from "@/lib/storage";

const SEED_PRODUCTS: Product[] = [
  {
    id: crypto.randomUUID?.() ?? "seed-1",
    name: "Cedarwood Desk Lamp",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "Canvas Weekender Bag",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    name: "Ceramic Pour-Over Set",
    price: 34,
    image:
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600&q=80",
    createdAt: new Date().toISOString(),
  },
];

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (name: string, price: number, image: string) => void;
  removeProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getProducts();
    if (existing.length === 0) {
      saveProducts(SEED_PRODUCTS);
      setProducts(SEED_PRODUCTS);
    } else {
      setProducts(existing);
    }
    setLoading(false);
  }, []);

  function addProduct(name: string, price: number, image: string) {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      price,
      image,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveProducts(updated);
  }

  function removeProduct(id: string) {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  }

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
