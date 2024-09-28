'use client'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChromePicker } from 'react-color'; // Use ChromePicker for a minimal design
import coverImage from '@/public/home/cover-image.svg';
import defaultImage from '@/public/home/download.png';
import blankImage from '@/public/home/blank-image.svg';
import backIcon from '@/public/home/back-icon.svg';
import uploadIcon from '@/public/home/upload-icon.svg';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import axios from "axios";

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
    const [patternImage, setPatternImage] = useState(null); // Store pattern image data
    const [selectedLabel, setSelectedLabel] = useState(''); // State to store label from localStorage
    const router = useRouter();  // Initialize the useRouter hook

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const label = localStorage.getItem('selectedLabel');
            setSelectedLabel(label);
        }
    }, []); // Runs once after the component mounts

    // Handle color change
    const handleColorChange = (color) => {
        setSelectedColor(color.hex); // Update selected color as hex code
        setUploadedImage(null); // Clear image if color is picked
        setPatternImage(null); // Clear pattern image when color is picked

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
                setSelectedColor('#E9E9EB');
                setUploadedImage(reader.result); // Store the image data as a URL
                setPatternImage(null); // Clear pattern when image is uploaded

               
            };
            reader.readAsDataURL(file);
        }
    };

     // Handle setting default or blank image as pattern
     const handleImageClick = (image) => {
        setSelectedImage(image);
        setUploadedImage(null); // Clear uploaded image
        setPatternImage(image); // Set the clicked image as pattern
        setSelectedColor('#E9E9EB'); // Reset color to default when an image is selected
    };


        // Inside your component
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

    // Update the fill of the SVG area when color or image changes
    useEffect(() => {
      

        if (svgRef.current) {
            const targetPath = svgRef.current.querySelector('g[filter="url(#filter1_i_2206_2378)"] path');
            if (targetPath) {
                // Clear existing fill (color, image, or pattern)
                targetPath.removeAttribute('fill');

                if (uploadedImage) {
                    // Set the uploaded image as the fill pattern
                    const imgPattern = `
                    <pattern id="imgPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
                        <image href="${uploadedImage}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                    `;
                    svgRef.current.querySelectorAll('pattern#imgPattern').forEach(el => el.remove()); // Remove previous patterns
                    svgRef.current.insertAdjacentHTML('beforeend', imgPattern); // Append the new pattern
                    targetPath.setAttribute('fill', 'url(#imgPattern)');
                } else if (patternImage) {
                    // Set the selected image (default or blank) as the pattern fill
                    const imgPattern = `
                    <pattern id="imgPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
                        <image href="${patternImage.src}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                    `;
                    svgRef.current.querySelectorAll('pattern#imgPattern').forEach(el => el.remove()); // Remove previous patterns
                    svgRef.current.insertAdjacentHTML('beforeend', imgPattern); // Append the new pattern
                    targetPath.setAttribute('fill', 'url(#imgPattern)');
                } else if (selectedColor) {
                    // Set the color as fill
                    targetPath.setAttribute('fill', selectedColor);
                }
            }
        }
    }, [selectedColor, uploadedImage, patternImage]);


    return (
   
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
                                        onClick={() => handleImageClick(defaultImage)}
                                    />
                                    {[...Array(5)].map((_, index) => (
                                        <Image
                                            key={index}
                                            src={blankImage}
                                            alt={`Image ${index + 1}`}
                                            width={119}
                                            height={119}
                                            className={`cursor-pointer rounded-lg`}
                                            onClick={() => handleImageClick(blankImage)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right: Preview Section */}
                            <div className="relative flex justify-center w-full lg:w-auto" id="svgImageArea">

                                <svg ref={svgRef} width="353" height="432" viewBox="0 0 353 432" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_dd_2206_2378)">
                                        <g clipPath="url(#clip0_2206_2378)">
                                            <path d="M6.81641 18C6.81641 9.16344 13.9799 2 22.8164 2H330.184C339.02 2 346.184 9.16344 346.184 18V406C346.184 414.837 339.02 422 330.184 422H22.8164C13.9798 422 6.81641 414.837 6.81641 406V18Z" fill="white"/>
                                            <g filter="url(#filter1_i_2206_2378)">
                                                <path d="M140.513 280.508C159.451 294.156 175.596 301.707 176.247 302C176.895 301.707 193.063 294.156 212.004 280.508C211.634 280.24 211.262 279.969 210.89 279.696C211.265 279.97 211.639 280.241 212.012 280.51C215.636 277.899 219.37 275.046 223.101 271.979C240.349 257.904 257.858 239.286 266.948 216.828C267.707 214.965 268.407 213.054 269.055 211.101C272.289 201.351 273.505 192.022 273.505 183.508C273.503 149.531 245.967 122.001 211.99 122.001C198.653 122.001 186.326 126.25 176.25 133.471C176.248 133.471 176.248 133.471 176.25 133.471L176.248 133.471C176.25 133.471 176.25 133.471 176.248 133.471C166.169 126.251 153.826 122 140.49 122C106.537 122 79 149.53 79 183.505C79 192.019 80.2171 201.348 83.4455 211.099C84.077 213.051 84.7682 214.961 85.5541 216.825C94.6454 239.283 112.15 257.901 129.402 271.976C133.152 275.043 136.886 277.898 140.513 280.508Z" fill={selectedColor}/>
                                                </g>
                                                
                                            <path d="M158.499 375C157.589 375 156.712 375.248 155.942 375.721C155.171 375.248 154.293 375 153.382 375C150.675 375 148.473 377.203 148.473 379.911C148.473 380.637 148.587 381.355 148.815 382.048C148.876 382.229 148.927 382.366 148.978 382.487C149.566 383.941 150.673 385.338 152.266 386.637C152.522 386.848 152.798 387.06 153.086 387.268L153.384 387.482L153.384 387.482C154.666 388.366 155.719 388.851 155.73 388.856L155.943 388.953L156.155 388.855C156.202 388.833 157.253 388.34 158.5 387.482L158.5 387.482L158.798 387.268C159.072 387.071 159.347 386.859 159.616 386.638C161.21 385.339 162.317 383.942 162.907 382.485C162.966 382.336 163.02 382.188 163.067 382.046C163.295 381.357 163.411 380.639 163.411 379.911C163.411 377.203 161.208 375 158.499 375ZM155.941 376.979C156.782 377.714 157.276 378.784 157.276 379.911C157.276 380.531 157.177 381.141 156.983 381.728C156.936 381.868 156.891 381.992 156.846 382.104C156.628 382.639 156.325 383.173 155.941 383.698C155.559 383.172 155.254 382.637 155.034 382.098C154.989 381.99 154.945 381.869 154.899 381.727C154.706 381.141 154.607 380.53 154.607 379.911C154.607 378.784 155.101 377.714 155.941 376.979ZM153.383 386.223C153.219 386.099 153.061 385.975 152.91 385.851C151.449 384.66 150.443 383.4 149.917 382.098C149.874 381.996 149.831 381.88 149.78 381.728C149.587 381.14 149.489 380.529 149.489 379.911C149.489 377.764 151.236 376.017 153.383 376.017C153.973 376.017 154.545 376.148 155.068 376.4C154.132 377.317 153.591 378.583 153.591 379.911C153.591 380.64 153.706 381.358 153.933 382.042C153.986 382.209 154.041 382.357 154.096 382.489C154.375 383.173 154.773 383.851 155.279 384.51C154.863 384.969 154.386 385.419 153.854 385.851C153.699 385.979 153.541 386.103 153.383 386.223ZM155.94 387.829C155.629 387.67 155.002 387.336 154.25 386.837C154.25 386.837 154.247 386.839 154.24 386.843C154.326 386.775 154.413 386.708 154.498 386.639C155.029 386.206 155.513 385.754 155.941 385.292C156.371 385.755 156.854 386.206 157.384 386.638C157.466 386.704 157.549 386.77 157.633 386.837C156.884 387.333 156.255 387.669 155.94 387.829ZM162.101 381.728C162.061 381.851 162.014 381.979 161.964 382.105C161.44 383.401 160.433 384.661 158.973 385.851C158.817 385.98 158.659 386.103 158.502 386.223C158.338 386.1 158.18 385.976 158.027 385.85C157.498 385.419 157.021 384.97 156.604 384.51C157.111 383.851 157.508 383.172 157.788 382.488C157.842 382.353 157.895 382.209 157.948 382.046C158.176 381.358 158.292 380.64 158.292 379.911C158.292 378.583 157.751 377.317 156.814 376.4C157.338 376.148 157.909 376.016 158.5 376.016C160.647 376.016 162.395 377.764 162.395 379.911C162.395 380.53 162.296 381.14 162.101 381.728Z" fill="black"/>
                                            <path d="M168.949 384.916H168.583C168.503 384.916 168.384 384.893 168.262 384.684C168.147 384.488 168.089 384.229 168.089 383.913V376.478C168.089 376.199 167.997 375.965 167.816 375.783C167.633 375.602 167.399 375.508 167.12 375.508C166.843 375.508 166.608 375.602 166.426 375.783C166.245 375.965 166.152 376.199 166.152 376.478V383.913C166.152 384.461 166.253 384.964 166.451 385.405C166.652 385.858 166.943 386.216 167.315 386.471C167.691 386.726 168.117 386.854 168.583 386.854H168.612C168.956 386.854 169.243 386.771 169.469 386.603C169.715 386.423 169.842 386.174 169.842 385.886C169.842 385.612 169.761 385.382 169.601 385.201C169.435 385.015 169.209 384.916 168.949 384.916Z" fill="black"/>
                                            <path d="M176.691 378.875C176.045 378.509 175.311 378.324 174.504 378.324C173.686 378.324 172.944 378.509 172.296 378.875C171.646 379.24 171.134 379.756 170.773 380.406C170.413 381.052 170.232 381.799 170.232 382.626C170.232 383.444 170.413 384.185 170.773 384.831C171.134 385.483 171.646 385.997 172.296 386.364C172.944 386.729 173.685 386.913 174.504 386.913C175.322 386.913 176.062 386.729 176.703 386.364C177.349 385.997 177.86 385.483 178.22 384.831C178.58 384.185 178.761 383.443 178.761 382.626C178.761 381.799 178.576 381.052 178.212 380.405C177.846 379.756 177.335 379.24 176.691 378.875ZM174.504 385.122C174.052 385.122 173.644 385.015 173.286 384.803C172.932 384.593 172.651 384.297 172.448 383.923C172.244 383.547 172.142 383.11 172.142 382.626C172.142 382.142 172.244 381.703 172.448 381.32C172.651 380.942 172.933 380.644 173.287 380.434C173.644 380.223 174.052 380.117 174.504 380.117C174.955 380.117 175.363 380.223 175.722 380.434C176.074 380.644 176.354 380.941 176.552 381.318C176.753 381.701 176.853 382.141 176.853 382.626C176.853 383.11 176.753 383.548 176.552 383.926C176.355 384.298 176.074 384.593 175.722 384.803C175.363 385.015 174.955 385.122 174.504 385.122Z" fill="black"/>
                                            <path d="M186.831 378.51C186.7 378.445 186.551 378.412 186.389 378.412C186.223 378.412 186.06 378.455 185.914 378.538C185.761 378.625 185.641 378.751 185.56 378.916L183.26 383.929L180.932 378.909C180.852 378.752 180.738 378.628 180.59 378.54C180.447 378.456 180.292 378.412 180.134 378.412C179.975 378.412 179.833 378.447 179.719 378.511C179.272 378.734 179.178 379.076 179.178 379.323C179.178 379.457 179.206 379.582 179.26 379.688L182.36 386.226C182.469 386.441 182.589 386.592 182.731 386.688C182.879 386.789 183.062 386.84 183.274 386.84C183.552 386.84 183.931 386.732 184.163 386.222L187.259 379.693C187.325 379.562 187.358 379.433 187.358 379.308C187.358 379.134 187.31 378.975 187.217 378.832C187.123 378.693 186.992 378.584 186.831 378.51Z" fill="black"/>
                                            <path d="M194.016 378.856C193.433 378.504 192.738 378.324 191.947 378.324C191.15 378.324 190.423 378.509 189.788 378.876C189.154 379.242 188.651 379.76 188.296 380.415C187.941 381.066 187.764 381.81 187.764 382.626C187.764 383.445 187.953 384.188 188.329 384.836C188.704 385.486 189.235 386 189.904 386.365C190.569 386.729 191.33 386.913 192.167 386.913C192.639 386.913 193.14 386.824 193.654 386.652C194.168 386.479 194.61 386.248 194.956 385.974C195.171 385.812 195.284 385.594 195.284 385.345C195.284 385.087 195.167 384.858 194.942 384.671C194.791 384.534 194.591 384.463 194.343 384.463C194.106 384.463 193.893 384.536 193.717 384.673C193.536 384.812 193.293 384.933 193.004 385.031C192.715 385.13 192.432 385.179 192.167 385.179C191.476 385.179 190.913 384.992 190.44 384.605C190.041 384.279 189.783 383.875 189.652 383.375H194.915C195.172 383.375 195.39 383.292 195.563 383.127C195.736 382.958 195.824 382.746 195.824 382.494C195.824 381.691 195.67 380.968 195.362 380.343C195.051 379.71 194.597 379.21 194.016 378.856ZM190.373 380.583C190.77 380.234 191.298 380.058 191.947 380.058C192.531 380.058 192.989 380.227 193.345 380.575C193.648 380.87 193.854 381.258 193.959 381.73H189.672C189.802 381.259 190.033 380.883 190.373 380.583Z" fill="black"/>
                                            <path d="M205.155 375.783C204.974 375.602 204.734 375.508 204.447 375.508C204.169 375.508 203.933 375.601 203.748 375.781C203.558 375.963 203.464 376.203 203.464 376.492V379.299C203.193 379.059 202.892 378.857 202.562 378.698C202.045 378.45 201.479 378.324 200.881 378.324C200.137 378.324 199.454 378.513 198.848 378.886C198.242 379.257 197.761 379.778 197.416 380.432C197.073 381.082 196.9 381.815 196.9 382.612C196.9 383.41 197.088 384.145 197.457 384.797C197.828 385.45 198.347 385.972 199.001 386.347C199.651 386.722 200.383 386.913 201.172 386.913C201.962 386.913 202.689 386.722 203.331 386.347C203.974 385.972 204.49 385.45 204.865 384.799C205.239 384.145 205.431 383.41 205.431 382.612V376.492C205.431 376.204 205.338 375.965 205.155 375.783ZM201.172 385.121C200.732 385.121 200.328 385.013 199.973 384.798C199.616 384.582 199.33 384.28 199.123 383.901C198.915 383.519 198.808 383.087 198.808 382.612C198.808 382.138 198.915 381.707 199.122 381.331C199.329 380.956 199.615 380.657 199.973 380.44C200.328 380.225 200.732 380.117 201.172 380.117C201.614 380.117 202.017 380.225 202.371 380.44C202.728 380.656 203.011 380.955 203.214 381.329C203.418 381.706 203.521 382.137 203.521 382.612C203.521 383.087 203.418 383.521 203.214 383.902C203.011 384.281 202.727 384.582 202.371 384.798C202.018 385.013 201.614 385.121 201.172 385.121Z" fill="black"/>
                                            <text
                                            x="50%"
                                            y="40" // Adjust this value to move the text vertically
                                            textAnchor="middle" // Centers the text horizontally
                                            fontSize="20" // Adjust font size as needed
                                            fill="black" // Text color
                                            >
                                            {selectedLabel}
                                            </text>
                                            </g>
                                            </g>
                                            </svg>

                                        </div>
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
