'use client'
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // For getting URL params in Next.js
import Image from "next/image";
import SuccessScheduledPopup from "../components/SuccessScheduledPopup";
import SuccessPopup from "../components/SuccessPopup"; // Assuming you have this component

export default function SendLoved() {
    const [cardImage, setCardImage] = useState('');
    const searchParams = useSearchParams(); // Use this to access query parameters

    useEffect(() => {
        const image = typeof window !== 'undefined' && localStorage.getItem('cardImage');
        setCardImage(image);
    }, []);

    // Get the value of the "type" query param
    const type = searchParams.get('type');

    return (

            <Suspense>
            <div className="bg-gray-50 min-h-screen flex flex-col justify-between items-center px-6" style={{ background: "#F8F9FB" }}>
                <div style={{ maxWidth: '800px' }}>
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-start justify-center" style={{ maxWidth: '800px' }}>
                        {/* Conditionally render the appropriate popup based on the "type" param */}
                        {type === "scheduled" ? (
                            <SuccessScheduledPopup cardImage={cardImage} />
                        ) : (
                            <SuccessPopup cardImage={cardImage} />
                        )}
                    </div>
                </div>
            </div>
            </Suspense>
     
    );
}
