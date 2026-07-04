import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
    </CartProvider>
  );
}