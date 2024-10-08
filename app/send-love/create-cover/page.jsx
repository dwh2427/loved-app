'use client'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChromePicker } from 'react-color';
import cardLogo from '@/public/home/card-logo.svg';
import defaultImage from '@/public/home/download.png';
import blankImage from '@/public/home/blankImage.png';
import backIcon from '@/public/home/back-icon.svg';
import arrowLeft from '@/public/home/arrow-left.svg';
import uploadIcon from '@/public/home/upload-icon.svg';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import axios from "axios";
import interact from 'interactjs';

const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function SendLoved() {
    const [selectedImage, setSelectedImage] = useState(blankImage);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const svgRef = useRef(null);
    const fileInputRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('#E9E9EB');
    const [selectedLabel, setSelectedLabel] = useState('');
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState('');
    const imageRef = useRef(null);
    const heartShapeColor = useRef(null);
    
    const blurredImageRef = useRef(null);

    const loadImage = (event) => {
        const fileUrl = URL.createObjectURL(event.target.files[0]);
        imageRef.current.src = fileUrl;
        blurredImageRef.current.src = fileUrl;

        imageRef.current.style.display = 'block';
        blurredImageRef.current.style.display = 'none';
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const label = localStorage.getItem('selectedLabel');
            setSelectedLabel(label);
        }

        if (imageRef.current) {
            // Initialize interact.js for dragging functionality
            interact(imageRef.current).draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.restrict({
                        restriction: '.layer-2',
                        endOnly: true,
                        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                    })
                ],
                onstart: () => {
                    blurredImageRef.current.style.display = 'block';
                },
                onmove: (event) => {
                    const target = event.target;
                    const blurredTarget = blurredImageRef.current;

                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    blurredTarget.style.transform = `translate(${x}px, ${y}px)`;

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                onend: () => {
                    blurredImageRef.current.style.display = 'block';
                }
            });
        }

        const handleOutsideClick = (event) => {
            if (imageRef.current && !imageRef.current.contains(event.target)) {
                blurredImageRef.current.style.display = 'none';
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleColorChange = (color) => {
        imageRef.current.style.display = 'none';
        blurredImageRef.current.style.display = 'none';
        setSelectedColor(color.hex);
        setImageSrc(null);
        heartShapeColor.current.style.background = color.hex;
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };


    const handleImageClick = async (imageObj) => {
        setSelectedColor("#fff");
  
        const response = await fetch(imageObj.src);

        // Convert the response into a blob
        const blob = await response.blob();

        // Create a blob URL
        const fileUrl = URL.createObjectURL(blob);


        imageRef.current.src= fileUrl;
        blurredImageRef.current.src = fileUrl;

        imageRef.current.style.display = 'block';
        blurredImageRef.current.style.display = 'none';

    };

  

const handleSaveImage = async () => {
    const layer1Element = svgRef.current.querySelector('.layer-1');
    
    if (layer1Element) {
        try {
            // Capture the layer-1 element as an image
            const dataUrl = await toPng(layer1Element);
            const redirectUrl = localStorage.getItem('redirectUrl');
            // Optionally, save it or send to server using axios
            // Here, we're simply logging or setting it as needed
            const response = await axios.post('/send-love/create-cover/api', { imageData: dataUrl });
            
            if (response.data.success) {
                localStorage.setItem('redirectUrl', "");
                localStorage.setItem('cardImage', "/tmp/"+response.data.imageName);
         
                if(redirectUrl){
                    router.push(redirectUrl);
                }else{
                    router.push('/send-love/create-template');
                }
                
            } else {
                console.error('Failed to save the image');
            }
        } catch (error) {
            console.error('Error converting or saving image', error);
        }
    } else {
        console.error('No layer-1 element found');
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

                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-start justify-center" style={{ maxWidth: '800px' }}>
                        <div className="w-full lg:w-auto order-2 lg:order-1">
                            <div className="flex gap-4 justify-center lg:justify-start pb-10">
                                <button className="color-button" onClick={() => setShowColorPicker(!showColorPicker)}>
                                    Colour
                                </button>
                                <button className="upload-button" onClick={handleButtonClick}>
                                    Upload image/video <Image src={uploadIcon} alt="Upload" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={loadImage}
                                        style={{ display: 'none' }}
                                    />
                                </button>
                            </div>

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
                                        className="cursor-pointer rounded-lg"
                                        onClick={() => handleImageClick(blankImage)}
                                    />
                                ))}
                            </div>
                            

                            {showColorPicker && (
                                <div className="color-picker-popup absolute bg-white p-4 shadow-lg rounded-lg">
                                    <ChromePicker
                                        color={selectedColor}
                                        onChange={handleColorChange}
                                        disableAlpha={true}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="relative flex justify-center w-full order-1 lg:order-2 lg:w-auto" id="svgImageArea" ref={svgRef}>
                            <div className="layer-1">
                                <h1 className="text-center mt-10 text-[32px]">{selectedLabel}</h1>
                                <div className="layer-2">
                                    <div className="layer-3">
                                        <img
                                            id="blurred-image"
                                            className="blurred-image"
                                            src={imageSrc}
                                            alt="Blurred Image"
                                            ref={blurredImageRef}
                                        />
                                        <div className="heart-shape"  ref={heartShapeColor} >
                                            <img
                                                id="uploaded-image"
                                                src={imageSrc}
                                                alt="Uploaded Image"
                                                ref={imageRef}
                                            />
                                </div>
                                </div>
                               
                            </div>
                               
                            <Image
                                src={cardLogo}
                                alt="Default"
                                width={57}
                                height={14}
                                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                            />
                        </div>
                    </div>

                    </div>
                        {/* Bottom Section: Back and Continue Buttons */}
                        <div className="flex justify-center items-center gap-6 pb-20 lg:pb-0 lg:pt-20">
                            <button className="flex items-center justify-center bg-white border rounded-full px-6 py-2">
                                <Image src={arrowLeft} alt="Back" width={24} height={24} />
                            </button>
                            <button onClick={handleSaveImage} className="bg-pink-500 continue-button text-white rounded-full py-2 px-8 text-base font-semibold hover:bg-pink-600 transition-colors">
                                Continue
                            </button>


                   </div>
                </div>
            </div>
        </>
    );
}
