'use client'

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import coverImage from '@/public/home/cover-image.svg';
import defaultImage from '@/public/home/default-select.svg';
import blankImage from '@/public/home/blank-image.svg';
import backIcon from '@/public/home/back-icon.svg';
import uploadIcon from '@/public/home/upload-icon.svg';
import { useRouter } from 'next/navigation';

const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function SendLoved() {
    const [selectedImage, setSelectedImage] = useState(blankImage);

    return (
        <Suspense>
            <>
                <CardHeader pageLink="dashboard" />
                <div className="bg-gray-50 min-h-screen flex flex-col justify-between items-center px-6" style={{ background: "#F8F9FB" }}>
                    {/* Top Section: Centered Header */}
                    <div style={{ maxWidth: '800px'  }}>

                    <h1 className="text-2xl md:text-3xl font-semibold pt-20 pb-20 text-gray-800 text-center">
                        Add a cover image
                    </h1>
                    {/* Main Content: Image Selection and Preview */}
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-start justify-center" style={{ maxWidth: '800px' }}>


                        {/* Left: Image Selection Section */}
                        <div className="w-full lg:w-auto">
                                    {/* Buttons: Colour and Upload */}
                            <div className="flex gap-4 justify-center lg:justify-start pb-10">
                                <button className="color-button">
                                    Colour
                                </button>
                                <button className="upload-button">
                                    Upload image/video <Image src={uploadIcon} />
                                </button>
                            </div>
                            
                            <h2 className="text-lg font-medium mb-4 text-left ">Select an image</h2>

                            {/* Image Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <Image
                                    src={defaultImage}
                                    alt="Default"
                                    width={119}
                                    height={119}
                                    className={`cursor-pointer rounded-lg border ${selectedImage === defaultImage ? "border-black" : "border-gray-200"}`}
                                    onClick={() => setSelectedImage(defaultImage)}
                                />
                                {[...Array(5)].map((_, index) => (
                                    <Image
                                        key={index}
                                        src={blankImage}
                                        alt={`Image ${index + 1}`}
                                        width={119}
                                        height={119}
                                        className={`cursor-pointer rounded-lg`}
                                        onClick={() => setSelectedImage(blankImage)}
                                    />
                                ))}
                            </div>

                       
                        </div>

                        {/* Right: Preview Section */}
                        <div className="relative flex justify-center w-full lg:w-auto">
                            <Image src={coverImage} alt="Upload" className="ml-2" />
                        </div>
                    </div>
                    {/* Bottom Section: Back and Continue Buttons */}
                    <div className="flex justify-center items-center gap-6 pt-20">
                        <button className="flex items-center justify-center bg-white border rounded-full px-4 py-2">
                            <Image src={backIcon} alt="Back" width={24} height={24} />
                        </button>
                        <button className="bg-pink-500 continue-button text-white rounded-full py-3 px-8 text-base font-semibold hover:bg-pink-600 transition-colors">
                            Continue
                        </button>
                    </div>
                 
</div>
                </div>
            </>
        </Suspense>
    );
}
