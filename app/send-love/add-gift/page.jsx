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
    const [giftAmount, setGiftAmount] = useState(0);  // Store the selected amount
    const [selectedLabel, setSelectedLabel] = useState('Gift Voucher'); // Set default label
    const [errorMessage, setErrorMessage] = useState('');  // For displaying error messages

    // Function to open the modal with the selected image
    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
        setModalOpen(true);  // Open modal
    };

    // Function to close the modal
    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
        setErrorMessage('');  // Clear any error message when modal closes
    };

    // Function to handle button click and navigate to /send-love/confirm
    const handleGift = () => {
        if (giftAmount <= 0) {
            // Set error message if amount is 0 or less
            setErrorMessage('Amount must be greater than $0');
        } else {
            // Navigate to the confirmation page if amount is valid
            router.push( '/send-love/confirm?amount='+giftAmount+'&label='+selectedLabel+'&selectedImage='+selectedImage);
        }
    };

    // Function to increase giftAmount
    const increaseAmount = () => {
        setGiftAmount((prevAmount) => prevAmount + 1);
        setErrorMessage('');  // Clear the error when the amount changes
    };

    // Function to decrease giftAmount, ensuring it doesn't go below 0
    const decreaseAmount = () => {
        setGiftAmount((prevAmount) => (prevAmount > 0 ? prevAmount - 1 : 0));
        setErrorMessage('');  // Clear the error when the amount changes
    };

    return (
        <>
            <CardHeader pageLink="dashboard" />
            <div className="container mx-auto mt-5 px-4 min-h-screen">
                <div className="flex justify-center">
                    <div className="text-center max-w-lg mx-auto">
                        <h2 className="text-[28px] text-[#202020] font-bold font-comfortaa leading-[1.4] pt-[30px]">Want to add a Gift?</h2>
                        <p className="mt-2 text-[16px] text-[#202020] font-plus-jakarta-sans">Share a message with a loved one</p>
                    </div>
                </div>

                <div className="py-4">
                    {/* <div className="mb-3">
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
                    </div> */}
                    <div className="mb-5">
                        <div className="relative">
                            {/* Search Icon */}
                            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                            </span>

                            {/* Search Input */}
                            <input
                            type="search"
                            placeholder="Search"
                            className="w-full p-3 pl-12 text-lg border border-gray-300 rounded-[32px] bg-white focus:outline-none focus:ring-2 focus:gray-300"
                            />
                        </div>
                    </div>


                    <div className="grid gap-4 mt-4 grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 12 }, (_, index) => (
                            <Image
                                key={index}
                                src={`/home/gift/thumb/giftThumb1_${index + 1}.png`}
                                alt={`thumb${index + 1}`}
                                width={200}
                                height={200}
                                label="Gift Voucher"
                                onClick={() => handleImageClick(`/home/gift/thumb/giftThumb1_${index + 1}.png`)} 
                                className="w-full rounded-md cursor-pointer"
                            />
                        ))}
                    </div>

                    <div className="flex justify-center mt-10">
                        <button
                            onClick={handleGift}
                            className="px-16 py-3 text-[16px] text-[#202020] font-bold border border-gray-300 rounded-full"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#202020] bg-opacity-40 z-50 add-gift-bg">

                <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                  {/* Close button */}
                  {/* <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500">
                    &times;
                  </button> */}
              
                  {/* Selected image with background */}
                  <div className="flex justify-center mb-6 popupCard-bg">
                    <Image src={selectedImage} width={200} height={120} alt="Selected Gift Card" className="popup-card" />
                  </div>
              
                  {/* Add Card Value Text */}
                  <h3 className="text-center font-semibold pb-6 text-[#202020] text-[18px] leading-[25.2px] font-plus-jakarta-sans">Add Card Value</h3>
              
                  {/* Value Controls */}
                    <div className="flex items-center justify-center mb-4 gap-[16px]">
                        <button
                            className="plusMinusBtn"
                            onClick={decreaseAmount}
                        >
                            <img src="/assets/img/minus.svg" alt="icon" />
                        </button>

                        <input
                            type="text"
                            value={`$${giftAmount}`}
                            onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ''); // remove non-numeric characters
                            setGiftAmount(value);
                            }}
                            className="counter-box"
                        />

                        <button
                            className="plusMinusBtn"
                            onClick={increaseAmount}
                        >
                            <img src="/assets/img/plus.svg" alt="icon" />
                            
                        </button>
                    </div>

              
                  {/* Error Message */}
                  {errorMessage && (
                    <p className="text-red-500 text-center mt-2">{errorMessage}</p>
                  )}
              
                  {/* Value Options */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button className="w-full exampleBox" onClick={() => setGiftAmount(20)}>$20</button>
                    <button className="w-full exampleBox" onClick={() => setGiftAmount(75)}>$75</button>
                    <button className="w-full exampleBox" onClick={() => setGiftAmount(200)}>$200</button>
                  </div>
              
                  {/* Full-width Confirm and Cancel Buttons */}
                  <div className="flex flex-col items-center mt-6 space-y-2">
                    <button className="confirmBtn hover:bg-[#FF318C]" onClick={handleGift}>Confirm</button>
                    <button className="cancelBtn" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              </div>
              
            )}
        </>
    );
}
