import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import PromoMarquee from "@/components/shared/PromoMarquee";
import { CartProvider } from "@/context/CartContext";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <PromoMarquee/>
      <Navbar />
      <main className="flex-1 pt-24">{children}</main>
      <Footer/>
    </CartProvider>
  );
}