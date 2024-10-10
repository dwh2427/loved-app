import { FaHeart } from "react-icons/fa";
import { useState } from "react";

export default function PopupMessage() {
  const [isVisible, setIsVisible] = useState(true);

  return (
   
        <div className={`fixed inset-0 schedule-popup-overlay flex items-center justify-center ${!isVisible && 'hidden'}`}>
        <div className="bg-gray-50 shadow-lg rounded-lg p-8 w-96 text-center">
            <div className="text-xl font-semibold mb-4">Sending your message...</div>
            <div className="flex justify-center my-4">
            <FaHeart className="text-pink-500" size={50} />
            </div>
            <div className="text-gray-500 italic">
            “A grateful perspective brings happiness and abundance into a person life.”
            </div>
            <div className="text-gray-500 mt-2">— Unknown</div>
        </div>
        </div>

  );
}
