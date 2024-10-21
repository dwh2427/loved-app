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
    const [isEnabledContinue, setIsEnabledContinue] = useState(false);
      
    // Function to handle button click and navigate to /send-love
    const handleCreateCover = () => {
        // If selectedLabel is not null, save it to localStorage
      
        localStorage.setItem('selectedLabel', selectedLabel );
        
        router.push('/send-love/create-cover');  // Navigate to the send-love route
    };

    const [selectedOccasion, setSelectedOccasion] = useState("Simple");
    const occasions = [
        "Custom", "Celebration", "Thanks", "Just Because", 
        "Memorial","Thank", "I miss you", "Simple"
    ];

    const handleOccasionChange = (occasion) => {
        setSelectedOccasion(occasion);
        // If "Simple" is selected, setSelectedLabel to null, otherwise store the selected occasion
        if (occasion === "Simple") {
            setSelectedLabel('');
            setIsEnabledContinue(true);
        } else {
            setSelectedLabel(occasion);
            setIsEnabledContinue(true);
        }
    };

    return (
            <>
                <CardHeader pageLink="dashboard" />
                <div className="bg-[#FFF] min-h-screen flex p-[12px] p-24-for-xl">
                    <div className="bg-[#F8F9FB] flex flex-col items-center text-center w-full occasion-inner-div">
                        
                        {/* Top: Heading */}
                        
                        <h1 className="text-center text-[24px] md:text-[24px] font-bold text-[#202020] font-comfortaa leading-[1.4] mt-[48px] mb-[48px]">
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
                        {/* <div className="block lg:hidden mb-8">
                        <select
                            value={selectedOccasion}
                            onChange={(e) => handleOccasionChange(e.target.value)}
                            className="w-full max-w-xs py-2 pr-16 pl-4 border border-gray-300 rounded-full bg-white text-gray-600 appearance-none" 
                            style={{
                            backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.5\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><polyline points=\"4 6 8 10 12 6\"/></svg>')", // Smaller SVG
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 8px center' 
                            }}
                        >
                            <option value="">Select Occasion</option> 
                            {occasions.map((occasion) => (
                            <option key={occasion} value={occasion}>
                                {occasion}
                            </option>
                            ))}
                        </select>
                        </div> */}

                        {/* Radio Options for large devices */}
                        <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 mb-8 occasion-pill">
                            {occasions.map((occasion) => (
                                <label
                                key={occasion}
                                className={`occasionBtn relative flex items-center justify-between lg:py-2 lg:px-6 border rounded-full cursor-pointer ${
                                    selectedOccasion === occasion
                                    ? "border-pink-500 text-pink-500 bg-[#FFFFFF]"
                                    : "border-gray-300"
                                }`}
                                // style={{
                                //     width: "183.5px",
                                //     height: "52px",
                                //     borderRadius: "128px",
                                // }}
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
                        className={`occasion-continue-button mb-4 justify-center items-center bg-[#FF318C] text-white rounded-full py-3 px-6 text-base font-semibold hover:bg-[#FF318C] transition duration-200 hidden lg:flex ${isEnabledContinue ? 'continue-active' : ''}`}
                        onClick={handleCreateCover}  // Call the function on button click
                        >
                        Continue
                        </button>


                    </div>
                </div>

                {/* Bottom Section: Back and Continue Buttons to md */}
                <div className="flex lg:hidden justify-center items-center gap-6 lg:pb-0 lg:pt-20 bottom-0 bottom-buttons z-50">
                    <button className={`flex occasion-continue-button mb-4 justify-center items-center bg-[#FF318C] text-white rounded-full py-3 px-6 text-base font-semibold hover:bg-[#FF318C] transition duration-200 ${isEnabledContinue ? 'continue-active' : ''}`} onClick={handleCreateCover} >
                        Continue
                    </button>
                </div>
            </>
    );
}
