import HeroBanner from "@/components/Home/HeroBanner";
import HeroDealBanner from "@/components/Home/HeroDealBanner";
import LatestProducts from "@/components/Home/LatestProducts";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <LatestProducts />
      <HeroDealBanner />
    </>
  );
}
