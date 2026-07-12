import img1 from "@/assets/cyber-monday.jpg"
import img2 from "@/assets/gameNIght.png"
import Image from "next/image";
import Link from "next/link";

const SpecialImage = () => {
    return (
        <div className="max-w-7xl mx-auto mb-24">
            <Link href='/shop'>
                <div className="flex flex-col lg:flex-row gap-5">
                    <Image
                        src={img1}
                        alt="cyber-monday"
                        width={400}
                        height={300}
                        className="w-full lg:flex-1 lg:h-[300px] h-[250px] object-cover rounded-xl"
                    />
                    <Image
                        src={img2}
                        alt="game-night"
                        width={400}
                        height={300}
                        className="w-full lg:flex-1 lg:h-auto h-[250px] object-cover rounded-xl"
                    />
                </div>
            </Link>
        </div>
    );
};

export default SpecialImage;