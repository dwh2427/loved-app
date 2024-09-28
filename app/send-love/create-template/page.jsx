'use client'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChromePicker } from 'react-color'; // Use ChromePicker for a minimal design
import coverImage from '@/public/home/cover-image.svg';
import defaultImage from '@/public/home/download.png';
import blankImage from '@/public/home/blank-image.svg';
import backIcon from '@/public/home/back-icon.svg';
import messageTemplate from '@/public/home/message-template.svg';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import axios from "axios";

const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function CreateTemplate() {

    const router = useRouter();  // Initialize the useRouter hook

    const handleSaveImage = async () => {
        if (svgRef.current) {
            try {
                // Convert the SVG content to PNG
                const dataUrl = await toPng(svgRef.current);

                // Send the PNG data to the server for saving
                const response = await axios.post('/send-love/create-cover/api', { imageData: dataUrl });

                if (response.data.success) {
                    console.log('Image saved successfully');
                    
                    localStorage.getItem('cardImage', response.data.cardImage);
                    router.push('/send-love/create-template');  // Navigate to the send-love route
                } else {
                    console.error('Failed to save the image');
                }
            } catch (error) {
                console.error('Error converting or saving image', error);
            }
        }
    };


    return (
   
            <>
                <CardHeader pageLink="dashboard" />
                <div className="bg-gray-50 min-h-screen flex flex-col justify-between items-center px-6" style={{ background: "#F8F9FB" }}>
                    <div style={{ maxWidth: '800px' }}>
                        <h1 className="text-2xl md:text-3xl font-semibold pt-20 pb-20 text-gray-800 text-center">
                            Add a cover image
                        </h1>

                        <div className="relative flex justify-center w-full lg:w-auto" id="svgImageArea">
                           <Image src={messageTemplate} alt="Back" width={712} height={442} />
                        </div>
                         {/* Bottom Section: Back and Continue Buttons */}
                        <div className="flex justify-center items-center gap-6 pt-20">
                            <button className="flex items-center justify-center bg-white border rounded-full px-4 py-2">
                                <Image src={backIcon} alt="Back" width={24} height={24} />
                            </button>
                            <button onClick={handleSaveImage} className="bg-pink-500 continue-button text-white rounded-full py-3 px-8 text-base font-semibold hover:bg-pink-600 transition-colors">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </>
      
    );
}
