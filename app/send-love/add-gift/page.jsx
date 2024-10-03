'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from 'next/navigation';

// Dynamically load CardHeader with SSR disabled
const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function SendLoved() {
    const router = useRouter();  // Initialize the useRouter hook
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);  // Store the selected image
    const [giftAmount, setGiftAmount] = useState(0);  // Store the selected image
    

     // Function to open the modal with the selected image
     const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
        setModalOpen(true);  // Open modal
    };

    // Function to close the modal
    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
    };


    // Function to handle button click and navigate to /send-love
    const handleCreateCover = () => {
        // If selectedLabel is not null, save it to localStorage
        localStorage.setItem('selectedLabel', selectedLabel);
        router.push('/send-love/create-cover');  // Navigate to the create-cover page
    };

       // Function to increase giftAmount
    const increaseAmount = () => {
        setGiftAmount((prevAmount) => prevAmount + 1);
    };

    // Function to decrease giftAmount, ensuring it doesn't go below 0
    const decreaseAmount = () => {
        setGiftAmount((prevAmount) => (prevAmount > 0 ? prevAmount - 1 : 0));
    };

    return (
            <>
                <CardHeader pageLink="dashboard" />
                <div className="container mx-auto mt-5">
                    <div className="flex justify-center">
                        <div className="text-center max-w-lg mx-auto">
                            <h2 className="text-2xl font-bold font-comfortaa text-gray-900">Want to add a Gift?</h2>
                            <p className="mt-2 text-gray-800 font-plus">Share a message with a loved one</p>
                        </div>
                    </div>
                
                    <div className="py-4">
                        <div className="mb-3">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search"
                                    className="w-full p-3 pl-10 text-lg border border-gray-300 rounded-full"
                                    style={{
                                        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22888%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Ccircle cx=%2211%22 cy=%2211%22 r=%228%22/%3E%3Cline x1=%2221%22 y1=%2221%22 x2=%2216.65%22 y2=%2216.65%22/%3E%3C/svg%3E')",
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'left 1rem center',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 mt-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {/* Replace src paths with Image component from Next.js for optimization */}
                            {Array.from({ length: 12 }, (_, index) => (
                                <Image
                                    key={index}
                                    src={`/home/gift/thumb/giftThumb1_${index + 1}.png`}
                                    alt={`thumb${index + 1}`}
                                    width={200} // Adjust width and height accordingly
                                    height={200}
                                    onClick={() => handleImageClick(`/home/gift/thumb/giftThumb1_${index + 1}.png`)} 
                                    className="w-full rounded-md"
                                />
                            ))}
                        </div>

                        <div className="flex justify-center mt-10">
                            <button
                                onClick={handleCreateCover}
                                className="px-16 py-3 text-gray-900 font-bold border border-gray-300 rounded-full"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-sm mx-auto">
                        {/* Close button */}
                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500">
                            &times;
                        </button>
                        {/* Selected image */}
                        <Image src={selectedImage} width="200" height="120" alt="Selected Gift Card" />
                        
                        {/* Value selection */}
                        <h3 className="text-center text-lg mt-4">Add Card Value</h3>
                        <div className="flex justify-between items-center mt-4">
                            <button className="text-2xl" onClick={decreaseAmount}>-</button>
                            <span className="text-xl font-bold">
                                $<input 
                                    type="number" 
                                    className="items-center text-center" 
                                    value={giftAmount} 
                                    onChange={(e) => setGiftAmount(Number(e.target.value))} // Handle input change
                                />
                            </span>
                            <button className="text-2xl" onClick={increaseAmount}>+</button>
                        </div>

                        <div className="flex justify-around mt-4">
                            <button className="border border-gray-300 px-4 py-2 rounded-lg" onClick={() => setGiftAmount(20)}>$20</button>
                            <button className="border border-gray-300 px-4 py-2 rounded-lg" onClick={() => setGiftAmount(75)}>$75</button>
                            <button className="border border-gray-300 px-4 py-2 rounded-lg"  onClick={() => setGiftAmount(200)}>$200</button>
                        </div>

                        {/* Confirm and Cancel buttons */}
                        <div className="flex justify-center mt-6">
                            <button className="bg-pink-500 text-white px-6 py-2 rounded-lg mr-4">Confirm</button>
                            <button className="text-gray-500" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            </>
    );
}
