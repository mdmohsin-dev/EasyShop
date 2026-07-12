import HeroBanner from "@/components/Home/HeroBanner";
import HeroDealBanner from "@/components/Home/HeroDealBanner";
import LatestProducts from "@/components/Home/LatestProducts";
import ReviewMarquee from "@/components/Home/Reviewmarquee";
import SpecialImage from "@/components/Home/SpecialImage";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <LatestProducts />
      <HeroDealBanner />
      <SpecialImage/>
      <ReviewMarquee/>
    </>
  );
}
