import Image from "next/image";
import { useState } from "react";
import ComplexHeart from "@/public/complex-heart.svg";

export default function PopupMessage() {
  const [isVisible, setIsVisible] = useState(true);

  return (
   
        <div className={`fixed inset-0 schedule-popup-overlay flex items-center justify-center ${!isVisible && 'hidden'}`}>
        <div className="bg-gray-50 shadow-lg rounded-lg p-8 w-96 text-center">
            <div className="sending-message-text mb-4 sending-message-1024">Sending your message...</div>
            <div className="sending-message-text mb-4 sending-message-1023">Sending your <br/> message...</div>
            <div className="flex justify-center my-4">
            <Image src={ComplexHeart} className="text-pink-500" size={50} />
            </div>
            <div className="speech-text">
            “A grateful perspective brings happiness and abundance into a person life.”
            </div>
            <div className="author-name mt-2">— Unknown</div>
        </div>
        </div>

  );
}
