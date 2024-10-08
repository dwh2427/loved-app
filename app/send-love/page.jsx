'use client'

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import cardOne from '@/public/home/occasion-card1.svg';  // Replace with your actual image path
import cardTwo from '@/public/home/occasion-card2.svg';  // Replace with your actual image path
import tickMark from '@/public/home/tick-mark.svg';  // Replace with your actual image path
import { useRouter } from 'next/navigation';

const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function SendLoved() {
    const router = useRouter();  // Initialize the useRouter hook
    const [selectedLabel, setSelectedLabel] = useState(''); // Store uploaded image data 
      
    // Function to handle button click and navigate to /send-love
    const handleCreateCover = () => {
        // If selectedLabel is not null, save it to localStorage
      
        localStorage.setItem('selectedLabel', selectedLabel );
        
        router.push('/send-love/create-cover');  // Navigate to the send-love route
    };

    const [selectedOccasion, setSelectedOccasion] = useState("Blank");
    const occasions = [
        "Blank", "Custom", "Celebration", "Thanks",
        "Just Because", "Memorial", "I miss you"
    ];

    const handleOccasionChange = (occasion) => {
        setSelectedOccasion(occasion);
        // If "Blank" is selected, setSelectedLabel to null, otherwise store the selected occasion
        if (occasion === "Blank") {
            setSelectedLabel('');
        } else {
            setSelectedLabel(occasion);
        }
    };

    return (
            <>
                <CardHeader pageLink="dashboard" />
                <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6"  style={{
                                    background: "#F8F9FB",
                                }}>
                    <div className="container mx-auto flex flex-col items-center text-center">
                        
                        {/* Top: Heading */}
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
                            What’s the occasion?
                        </h1>
                        
                        {/* Middle: Cards */}
                        <div className="relative mb-8">
                            {/* Card Two */}
                            <div
                                className="absolute z-10 rotate-[4.75deg]"
                                style={{
                                    width: "193.92px",
                                    height: "240px",
                                    left: "25.26px",
                                    top: "-3.61px",
                                }}
                            >
                                <Image src={cardTwo} alt="Card Two" width={224} height={266} />
                            </div>

                            {/* Card One */}
                            <div
                                className="relative z-20"
                                style={{
                                    width: "193.92px",
                                    height: "240px",
                                    left: "-0.04px",
                                    top: "0px",
                                }}
                            >
                                <Image src={cardOne} alt="Card One" width={206} height={252} />
                            </div>
                        </div>

                        {/* Dropdown for small devices */}                     
                        <div className="block lg:hidden mb-8">
                        <select
                            value={selectedOccasion}
                            onChange={(e) => handleOccasionChange(e.target.value)}
                            className="w-full max-w-xs py-2 pr-16 pl-4 border border-gray-300 rounded-full bg-white text-gray-600 appearance-none" // Reduced pr to 4
                            style={{
                            backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.5\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><polyline points=\"4 6 8 10 12 6\"/></svg>')", // Smaller SVG
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 8px center' // Adjust position for smaller icon
                            }}
                        >
                            <option value="">Select Occasion</option> {/* Empty option for reset */}
                            {occasions.map((occasion) => (
                            <option key={occasion} value={occasion}>
                                {occasion}
                            </option>
                            ))}
                        </select>
                        </div>

                        {/* Radio Options for large devices */}
                        <div className="hidden lg:grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {occasions.map((occasion) => (
                            <label
                            key={occasion}
                            className={`relative flex items-center justify-between py-2 px-6 border rounded-full cursor-pointer ${
                                selectedOccasion === occasion
                                ? "border-pink-500 text-pink-500 bg-[#FFFFFF]"
                                : "border-gray-300"
                            }`}
                            style={{
                                width: "183.5px",
                                height: "52px",
                                borderRadius: "128px",
                            }}
                            >
                            <input
                                type="radio"
                                name="occasion"
                                value={occasion}
                                checked={selectedOccasion === occasion}
                                onChange={() => handleOccasionChange(occasion)}
                                className="absolute opacity-0 cursor-pointer"
                            />
                            <span>{occasion}</span>
                            {selectedOccasion === occasion && (
                                <Image src={tickMark} alt="tick mark" width={21} height={20} />
                            )}
                            </label>
                        ))}
                        </div>

                        {/* Continue Button */}
                        <button
                        className="flex continue-button justify-center items-center bg-pink-500 text-white rounded-full py-3 px-6 text-base font-semibold hover:bg-pink-600 transition duration-200"
                        onClick={handleCreateCover}  // Call the function on button click
                        >
                        Continue
                        </button>


                    </div>
                </div>
            </>
    );
}
