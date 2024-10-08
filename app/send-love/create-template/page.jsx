'use client'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import templateIcon from '@/public/home/templateicon.svg';
import backIcon from '@/public/home/back-icon.svg';
import arrowLeft from '@/public/home/arrow-left.svg';
import messageIcon from '@/public/home/messageicon.svg';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import axios from "axios";
import MessageTemplatesModal from "./../components/MessageTemplatesModal";
const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function CreateTemplate() {

    
    const svgRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [addTocartText, setAddTocartText] = useState("");
   
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle file input and display the image
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const router = useRouter();
    const isAuthenticated = () => {
		return !!localStorage.getItem('accToken'); // example
	  };
  

    const handleSaveImage = async () => {
        const layer1Element = svgRef.current.querySelector('.card-body');
        
        if (layer1Element) {
            // Find the elements to hide
            const addImageLabel = document.querySelector(".hide-section"); // "Add an image" label
            const messageTemplatesButton = document.querySelector(".hide-section-1"); // "Message templates" button
    
            try {
                // Hide the elements before capturing the image
                if (addImageLabel) addImageLabel.style.display = "none";
                if (messageTemplatesButton) messageTemplatesButton.style.display = "none";
    
                // Capture the layer-1 element as an image
                const dataUrl = await toPng(layer1Element);
    
                // Optionally, save it or send to server using axios
                const response = await axios.post('/send-love/create-cover/api', { imageData: dataUrl });
    
                if (response.data.success) {
                    localStorage.setItem('templateImage', "tmp/"+response.data.imageName);
                    if (isAuthenticated()) {
                        router.push(`/send-love/add-gift`); // If authenticated, navigate to the send-loved page
                      } else {
                        localStorage.setItem('sendLoveUrl', `/send-love/add-gift`); // Save URL for redirection after login
                        router.push('/login'); // Redirect to login if not authenticated
                      }

                } else {
                    console.error('Failed to save the image');
                }
    
            } catch (error) {
                console.error('Error converting or saving image', error);
            } finally {
                // Restore the hidden elements
                if (addImageLabel) addImageLabel.style.display = "";
                if (messageTemplatesButton) messageTemplatesButton.style.display = "";
            }
        } else {
            console.error('No layer-1 element found');
        }
    };
    


    return (
        <>
            <CardHeader pageLink="dashboard" />
            <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-custom-background">
                <div className="container max-w-xl">
                    <h1 className="text-2xl md:text-3xl font-semibold py-12 text-gray-800 text-center">
                        Write your message
                    </h1>
                    <div className="relative flex justify-center w-full mb-6" id="svgImageArea"  ref={svgRef}>
                        <div className="card-body">
                            <div className="style-1">
                                <div className="style-2">
                                    <div className="frame-content">
                                        <div className="text-center items-center" id="uploadContainer">
                                            <input
                                                className="hidden"
                                                id="formFileSm"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            {!imagePreview ? (
                                                // I want to skip this label and button while save to png 
                                                <label
                                                    htmlFor="formFileSm"
                                                    className="cursor-pointer hide-section inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                                                >
                                                    <Image
                                                        src={messageIcon}
                                                        alt="Default"
                                                        width={16}
                                                        height={17}
                                                    />
                                                    Add an image
                                                </label>
                                            ) : (
                                                <img
                                                    src={imagePreview}
                                                    alt="Uploaded"
                                                    className="items-center p-2 mx-auto max-h-[100px]"
                                                />
                                            )}

                                <div className="mt-10">
                                <textarea
                                    className="w-full px-4 py-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 custom-text"
                                    id="exampleFormControlTextarea1"
                                    rows="5"
                                    placeholder="Write a message"
                                    value={addTocartText}  // Bind the value to the state
                                    onChange={(e) => setAddTocartText(e.target.value)}  // Update the state on change
                                />
                                </div>
                                {/* // I want to skip this button while save to png  */}
                            <div className="btn-wrapper absolute bottom-0 left-1/2 -translate-x-1/2 mb-8 hide-section-1">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 text-gray-700 px-4 rounded-full hover:bg-gray-100 transition btn-ms"
                                        onClick={handleOpenModal}
                                    >
                                        <Image
                                            src={templateIcon}
                                            alt="Default"
                                            width={16}
                                            height={17}
                                            className="me-2"
                                        />
                                        Message templates
                                    </a>
                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="custom-background"></div>
                           
                        </div>
                    </div>

          
                    {/* Bottom Section: Back and Continue Buttons */}
                    <div className="flex justify-center items-center gap-6 pt-10">
                        <button className="flex items-center justify-center bg-white border rounded-full px-6 py-2">
                            <Image src={arrowLeft} alt="Back" />
                        </button>
                        <button onClick={handleSaveImage} className="bg-pink-500 text-white rounded-full py-2 px-16 text-base font-semibold hover:bg-pink-600 transition-colors">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
            <MessageTemplatesModal isOpen={isModalOpen} onClose={handleCloseModal} setAddTocartText={setAddTocartText} />
           
        </>
    );
}
