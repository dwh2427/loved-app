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
    <div className="bg-[#F8F9FB] min-h-screen flex items-start md:items-center mx-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        
        {/* Left side: Text & Button */}
        <div className="flex flex-col items-start md:items-center justify-center order-2 md:order-1">
          <div className="mx-auto flex flex-col">
            <h1 className="send-love mb-4">
              Send love in seconds
            </h1>
            <p className="paragraph-text mb-6">
              The easiest way to spread love with those you love most with a digital card and gift.
            </p>
            <button 
              onClick={handleGetStarted} // Call the function on button click
              className="getStartBtn"
            >
              Get started
            </button>
          </div>
        </div>

        {/* Right side: Cards */}
        <div className="flex justify-center items-center order-1 md:order-2">
          {/* Wrap cards in a div to control layout */}
          <div className="relative flex flex-col items-center">
            {/* First Card */}
            <div className="card-1 z-20">
              <Image src={cardOne} className="top-image w-[160px] h-[204px] sm:w-[360px] sm:h-[455px]" alt="image"/>
            </div>
            
            {/* Second Card */}
            <div className="card-2 z-10">
              <Image src={cardTwo} className="bottom-image w-[175px] h-[222px] sm:w-[400px] sm:h-[490px]" alt="image"/>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
