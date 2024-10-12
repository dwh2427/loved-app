"use client";
import Image from "next/image";
import cardOne from '@/public/home/Card_01.png';  // Replace with your actual image path
import cardTwo from '@/public/home/Card_03.png';  // Replace with your actual image path
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();  // Initialize the useRouter hook

  // Function to handle button click and navigate to /send-love
  const handleGetStarted = () => {
    router.push('/send-love');  // Navigate to the send-love route
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen lg:flex items-center justify-center">
      <div className="container mx-auto lg:flex flex-col lg:flex-row items-start justify-between px-6">
        
        {/* Left side: Text & Button */}
        <div className="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
          <div className="lg:pl-[200px] lg:pt-[100px] pl-0 pt-[40px]">
            <h1 className="send-love mb-4">
              Send love in seconds
            </h1>
            <p className="paragraph-text mb-6">
              The easiest way to spread love with those you love <br /> most with a digital card and gift.
            </p>
            <button 
              onClick={handleGetStarted}  // Call the function on button click
              className="getStartBtn"
            >
              Get started
            </button>
          </div>
        </div>

        {/* Right side: Cards */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative flex justify-center order-1 lg:order-2">
          {/* First Card */}
          <div className="absolute card-1 card-img top-89 left-803 z-20">
            <Image
              src={cardOne}
              alt="Card Image One"
              width={380}
              height={480}
            />
          </div>
          
          {/* Second Card */}
          <div className="absolute card-2 card-img op-69 left-843 rotate-6 z-10">
            <Image
              src={cardTwo}
              alt="Card Image Two"
              width={380}
              height={480}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
