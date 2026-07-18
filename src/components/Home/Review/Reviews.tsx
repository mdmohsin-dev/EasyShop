import ReviewsCarousel from "./ReviewCarousel";

export interface Review {
    id: string;
    name:string
    avatar: string;
    rating:number
    text:string
    role: string;
}


const Reviews = async () => {

const reviews: Review[] = [
    {
        id: "1",
        name: "Ayesha Rahman",
        role: "Product Designer",
        avatar: "https://i.pravatar.cc/100?img=1",
        rating: 5,
        text: "The backpack held up through three months of daily commuting and still looks brand new.",
    },
    {
        id: "2",
        name: "Tanvir Hossain",
        role: "Frontend Engineer",
        avatar: "https://i.pravatar.cc/100?img=2",
        rating: 4,
        text: "Ordered the running shoes on a Monday, had them by Wednesday. Comfortable straight out.",
    },
    {
        id: "3",
        name: "Nusrat Jahan",
        role: "Founder, ShopEasy",
        avatar: "https://i.pravatar.cc/100?img=3",
        rating: 5,
        text: "Love that the site shows exactly what's in stock — no surprise cancellations like other shops.",
    },
    {
        id: "4",
        name: "Shakib Ahmed",
        role: "Marketing Lead",
        avatar: "https://i.pravatar.cc/100?img=4",
        rating: 5,
        text: "Fast checkout, and the headphones sound way better than the price suggests. Will be back more.",
    },
    {
        id: "5",
        name: "Farhana Akter",
        role: "Operations Manager",
        avatar: "https://i.pravatar.cc/100?img=5",
        rating: 4,
        text: "Customer support actually replied within an hour when I had a sizing question. Rare these days.",
    },
];

  return (
    <section className="mx-auto mt-32 w-11/12 max-w-7xl mb-24">
      <div className="mx-auto w-full text-center lg:w-8/12">
        <h3 className="text-4xl font-bold text-[#104a51]">What our customers are saying</h3>
        <p className="pt-5">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper
          alignment, reduce pain, and strengthen your body with ease!
        </p>
      </div>

      <div className="relative mt-16">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
          style={{ background: 'linear-gradient(to right, #0B0D0C, transparent)' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
          style={{ background: 'linear-gradient(to left, #0B0D0C, transparent)' }}
        />
        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
};

export default Reviews;