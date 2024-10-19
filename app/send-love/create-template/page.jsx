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
import LoginModal from "./../components/LoginModal";
import OtpModal from "./../components/OtpModal";

const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

export default function CreateTemplate() {

    
    const svgRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [closeLogin, setOnCloseLogin] = useState(false);
    const [closeOtp, setOnCloseOtp] = useState(false);
    
    
    
    const [addTocartText, setAddTocartText] = useState("");

    useEffect(() => {
        if (closeLogin) {
            setLoginModalOpen(false); // Trigger payment confirmation when isSubmitPayment is true
            setOtpModalOpen(true); // Trig
        }

      }, [closeLogin]);

      
      useEffect(() => {
        if(closeOtp){
            setOtpModalOpen(false); // Trig
        }
      }, [closeOtp]);

      
   
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
                        setLoginModalOpen(true);
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
            <div className=" bg-[#FFF] min-h-screen flex flex-col  p-[12px]">
                <div className="bg-[#F8F9FB] min-h-[80vh] container mx-auto flex flex-col items-center text-center fix-space" style={{ borderRadius: 'var(--Spacing-5, 20px)' }}>
                    <h1 className="writeMessage pt-[48px] md:pt-[0px] pb-[48px] ">
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
                                                    className="cursor-pointer hide-section inline-flex font-semibold items-center gap-2 border text-[14px] border-[#D8D8DA] text-[#202020] px-4 py-2 rounded-full hover:bg-gray-100 transition"
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
                                    className="w-full px-4 py-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 custom-text"
                                    id="exampleFormControlTextarea1"
                                    rows="5"
                                    placeholder="Write a message"
                                    value={addTocartText}  // Bind the value to the state
                                    onChange={(e) => setAddTocartText(e.target.value)}  // Update the state on change
                                />
                                </div>
                                {/* // I want to skip this button while save to png  */}
                            <div className="btn-wrapper absolute bottom-0 mb-8 hide-section-1" style={{ left: '22%' }}>
                                    <a
                                        href="#"
                                        className="messageTemplate hover:bg-gray-100"
                                        onClick={handleOpenModal}
                                    >
                                        <Image
                                            src={templateIcon}
                                            alt="Default"
                                            width={16}
                                            height={17}
                                            className="me-2 text-[#202020]"
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

          
                    {/* Bottom Section: Back and Continue Buttons from lg */}
                    <div className="hidden lg:flex justify-center items-center gap-6 pt-10">
                        <button className="leftArrowBtn" onClick={() => router.back()}>
                            <Image src={arrowLeft} alt="Back" width={20} height={20} />
                        </button>
                        <button onClick={handleSaveImage} className="continue-button hover:bg-[#FF318C]">
                            Continue
                        </button>
                   </div>

                </div>
            </div>

            {/* Bottom Section: Back and Continue Buttons to md */}
            <div className="flex lg:hidden justify-center items-center gap-6 mt-[8px] bottom-0 bottom-buttons z-50">
                <button className="leftArrowBtn"  onClick={() => router.back()}>
                    <Image src={arrowLeft} alt="Back" width={20} height={20} />
                </button>
                <button onClick={handleSaveImage} className="continue-button hover:bg-[#FF318C]">
                    Continue
                </button>
            </div>


            <MessageTemplatesModal isOpen={isModalOpen} onClose={handleCloseModal} setAddTocartText={setAddTocartText} />

            { loginModalOpen && (
               <LoginModal isOpen={loginModalOpen} setOnCloseLogin={setOnCloseLogin} />
            )}

            { otpModalOpen && (
                <OtpModal isOpen={otpModalOpen} setOnCloseOtp={setOnCloseOtp} />
            )}
        
            
        </>
    );
}
