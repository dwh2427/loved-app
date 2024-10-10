import React, { useState } from 'react';
import Image from 'next/image'; // Assuming you're using Next.js

export default function SuccessScheduledPopup({ cardImage }) {
  const [error, setError] = useState('');

  const handleScheduleClick = (e) => {
    router.push('/send-love');
};

 const completeAccount = (e) => {
  router.push('/');
};

  return (
    <div className="schedule-popup-overlay flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-75 z-50">
      <div className="schedule-popup-content bg-white p-6 rounded-lg relative text-center w-96">
        {/* Card Image */}
        <div className="relative mb-6">
          <Image
            src={cardImage}
            alt="Card Image"
            width={280}
            height={298}
            className="rounded-lg mx-auto"
          />
        </div>
        
        {/* Message */}
        <h2 className="text-lg font-bold mb-2">Scheduled!</h2>
        <p className="text-gray-600 mb-6">Your message will be sent on <span className="font-semibold">{'{date}'}</span> at <span className="font-semibold">{'{time}'}</span>.</p>
        
        {/* Send Another Card Button */}
        <button 
          onClick={handleScheduleClick} 
          className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg w-full mb-3 hover:bg-pink-600"
        >
          Send another card
        </button>

        {/* Complete Your Account Button */}
        <button 
          onClick={completeAccount} 
          className="text-pink-500 font-medium hover:underline w-full"
        >
          Complete your account
        </button>
      </div>
    </div>
  );
}
