'use client'

import { Suspense, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChromePicker } from 'react-color'; // Use ChromePicker for a minimal design
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
    const [showColorPicker, setShowColorPicker] = useState(false); // Toggle state for color picker
    const [selectedColor, setSelectedColor] = useState('#E9E9EB'); // Default color state
    const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image data
    const svgRef = useRef(null); // Create a ref for the SVG
    const fileInputRef = useRef(null);

    // Handle color change
    const handleColorChange = (color) => {
        setSelectedColor(color.hex); // Update selected color as hex code
        setUploadedImage(null); // Clear image if color is picked
    };

    const handleButtonClick = () => {
        // Programmatically click the hidden input
        fileInputRef.current.click();
      };
    
    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                 setSelectedColor(null); // Clear color if an image is uploaded
                setUploadedImage(reader.result); // Store the image data as a URL
               
            };
            reader.readAsDataURL(file);
        }
    };

    // Update the fill of the SVG area when color or image changes
    useEffect(() => {
        if (svgRef.current) {
            const targetPath = svgRef.current.querySelector('g[filter="url(#filter1_i_2206_2378)"] path');
            if (uploadedImage && targetPath) {
                // Set the uploaded image as the fill pattern using a background image in a foreignObject
                const imgPattern = `
                  <pattern id="imgPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
                    <image href="${uploadedImage}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                `;
                targetPath.setAttribute('fill', 'url(#imgPattern)');
                svgRef.current.insertAdjacentHTML('beforeend', imgPattern); // Append the pattern to the SVG
            } else if (selectedColor && targetPath) {
                targetPath.setAttribute('fill', selectedColor); // Set the color as fill
            }
        }
    }, [selectedColor, uploadedImage]);

    return (
        <Suspense>
            <>
                <CardHeader pageLink="dashboard" />
                <div className="bg-gray-50 min-h-screen flex flex-col justify-between items-center px-6" style={{ background: "#F8F9FB" }}>
                    <div style={{ maxWidth: '800px' }}>
                        <h1 className="text-2xl md:text-3xl font-semibold pt-20 pb-20 text-gray-800 text-center">
                            Add a cover image
                        </h1>

                        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-start justify-center" style={{ maxWidth: '800px' }}>
                            {/* Left: Image Selection Section */}
                            <div className="w-full lg:w-auto">
                                {/* Buttons: Colour and Upload */}
                                <div className="flex gap-4 justify-center lg:justify-start pb-10">
                                    <button 
                                        className="color-button"
                                        onClick={() => setShowColorPicker(!showColorPicker)} // Toggle color picker
                                    >
                                        Colour
                                    </button>
                                    <button className="upload-button" onClick={handleButtonClick}>
                                        Upload image/video <Image src={uploadIcon} alt="Upload" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef} // Reference to the input
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }} // Hidden input, will be triggered by button click
                                        />
                                    </button>
                                </div>

                                {/* Show the Color Picker */}
                                {showColorPicker && (
                                    <div className="color-picker-popup absolute bg-white p-4 shadow-lg rounded-lg">
                                        <ChromePicker
                                            color={selectedColor}
                                            onChange={handleColorChange} // Update color on change
                                            disableAlpha={true} // Remove alpha slider
                                            className="minimal-color-picker"
                                        />
                                    </div>
                                )}

                                <h2 className="text-lg font-medium mb-4 text-left">Select an image</h2>

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

                                <svg ref={svgRef} width="353" height="432" viewBox="0 0 353 432" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_dd_2206_2378)">
                                        <g clipPath="url(#clip0_2206_2378)">
                                            <path d="M6.81641 18C6.81641 9.16344 13.9799 2 22.8164 2H330.184C339.02 2 346.184 9.16344 346.184 18V406C346.184 414.837 339.02 422 330.184 422H22.8164C13.9798 422 6.81641 414.837 6.81641 406V18Z" fill="white"/>
                                            <g filter="url(#filter1_i_2206_2378)">
                                                <path d="M140.513 280.508C159.451 294.156 175.596 301.707 176.247 302C176.895 301.707 193.063 294.156 212.004 280.508C211.634 280.24 211.262 279.969 210.89 279.696C211.265 279.97 211.639 280.241 212.012 280.51C215.636 277.899 219.37 275.046 223.101 271.979C240.349 257.904 257.858 239.286 266.948 216.828C267.707 214.965 268.407 213.054 269.055 211.101C272.289 201.351 273.505 192.022 273.505 183.508C273.503 149.531 245.967 122.001 211.99 122.001C198.653 122.001 186.326 126.25 176.25 133.471C176.248 133.471 176.248 133.471 176.25 133.471L176.248 133.471C176.25 133.471 176.25 133.471 176.248 133.471C166.169 126.251 153.826 122 140.49 122C106.537 122 79 149.53 79 183.505C79 192.019 80.2171 201.348 83.4455 211.099C84.077 213.051 84.7682 214.961 85.5541 216.825C94.6454 239.283 112.15 257.901 129.402 271.976C133.152 275.043 136.886 277.898 140.513 280.508Z" fill={selectedColor}/>
                                            </g>
                                            <path d="M158.499 375C155.791 375 153.588 377.203 153.588 379.911C153.588 380.637 153.701 381.355 153.93 382.048C153.99 382.23 154.041 382.367 154.1 382.537C155.483 386.432 159.02 389 163.5 389C167.981 389 171.518 386.432 172.9 382.537C172.96 382.367 173.011 382.23 173.07 382.048C173.298 381.355 173.411 380.637 173.411 379.911C173.411 377.203 171.208 375 168.5 375H158.499Z" fill="white"/>
                                            {/* Add other SVG elements */}
                                        </g>
                                    </g>
                                </svg>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Suspense>
    );
}
