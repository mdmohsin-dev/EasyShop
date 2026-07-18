import HeroBanner from "@/components/Home/HeroBanner";
import HeroDealBanner from "@/components/Home/HeroDealBanner";
import LatestProducts from "@/components/Home/LatestProducts";
import Reviews from "@/components/Home/Review/Reviews";
import SpecialImage from "@/components/Home/SpecialImage";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <LatestProducts />
      <HeroDealBanner />
      <SpecialImage/>
      <Reviews/>
    </>
  );
}
