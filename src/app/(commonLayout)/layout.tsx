import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { CartProvider } from "@/context/CartContext";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer/>
    </CartProvider>
  );
}