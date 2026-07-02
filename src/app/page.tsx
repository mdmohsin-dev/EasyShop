"use client";

import { useProducts } from "@/context/ProductContext";
import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/Home/HeroBanner";
import LatestProducts from "@/components/Home/LatestProducts";
// import HeroBanner from "@/components/HeroBanner";
// import LatestProducts from "@/components/LatestProducts";

export default function HomePage() {
  const { products, loading } = useProducts();

  return (
    <>
      <HeroBanner />
      <LatestProducts />
    </>
  );
}