import Image from 'next/image';
import icon from '@/assets/Frame.png';
import { Review } from './Reviews';



interface ReviewCardProps {
    review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    const { text, avatar, name, role } = review;

    return (
        <div className="flex flex-col items-start justify-center gap-5 rounded-2xl  bg-[#1F2224] text-white p-6">
            <Image src={icon} alt="" width={40} height={40} />
            <p>{text}</p>
            <div className="my-2 w-full border-t-2 border-dashed border-[#7E9FA3]" />
            <div className="flex gap-2">
                <Image
                    className="h-14 w-14 rounded-full object-cover"
                    src={avatar}
                    alt={name}
                    width={56}
                    height={56}
                />
                <div>
                    <p>{name}</p>
                    <p>{role}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;