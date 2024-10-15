import { useState } from 'react';

export default function MessageTemplatesModal({ isOpen, onClose, setAddTocartText }) {
    //setAddTocartText("");
    const [activeTab, setActiveTab] = useState('Most Popular');
    const [activeMessageIndex, setActiveMessageIndex] = useState(null);

    const addTocartText = () => {
        if (activeMessageIndex !== null) {
            const activeMessage = messages[activeTab][activeMessageIndex];
            setAddTocartText(activeMessage); // Set the active message to the cart text
            onClose(); // Close the modal after setting the message
        } else {
            alert("Please select a message before adding it to the card.");
        }
    };

    const messages = {
       "Most Popular": [
            "Thank you friend for always being there for me, I know I can always count on your friendship.",
            "You're an amazing friend, and I feel lucky to have you in my life.",
            "Thank you for always being there for me.",
            "I truly appreciate your help and support.",
            "Wishing you both a lifetime of love and happiness.",
            "I love you more than words can say.",
        ],
        Thanks: [
            "Thank you for always being there for me.",
            "I truly appreciate your help and support."
        ],
        Weddings: [
            "Wishing you both a lifetime of love and happiness.",
            "Congratulations on your wedding day!"
        ],
        Engagement: [
            "Congratulations on your engagement! Wishing you all the best.",
            "So happy for you both on your engagement!"
        ],
        Birthdays: [
            "Wishing you the happiest of birthdays!",
            "Hope your birthday is as special as you are!"
        ],
        Memorial: [
            "Thinking of you during this difficult time.",
            "Our thoughts and prayers are with you."
        ],
        "Get Well": [
            "Wishing you a speedy recovery!",
            "Hope you feel better soon."
        ],
        Love: [
            "I love you more than words can say.",
            "You mean the world to me."
        ]
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 custom-popup">
            <div className="bg-[#F8F9FB] rounded-lg p-4w-full min-w-[445px] mx-auto">
                <h2 className="text-center text-xl font-semibold mb-4 mt-10">Let us help with the message</h2>
                
                {/* Tabs */}
                {/* <div className="flex justify-center space-x-1 mb-2">
                    {Object.keys(messages).map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 custom-border rounded-full ${activeTab === tab ? 'bg-pink-500 text-white' : 'text-gray-600'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div> */}
                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:space-x-1 p-4">
                    {Object.keys(messages).map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 custom-border rounded-full ${activeTab === tab ? 'bg-pink-500 text-white' : 'text-gray-600'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>


                {/* Message List */}
                <div className="space-y-4 mb-6 p-6">
                    {messages[activeTab].map((message, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                activeMessageIndex === index ? 'border border-[#FF318C] text-[#202020] bg-[#FFF]' : 'bg-[#FFF] border border-[#D8D8DA]'
                            }`}
                            onClick={() => setActiveMessageIndex(index)}
                        >
                            {message}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
          
                <div className="flex flex-col items-center justify-end mb-10 h-full">
                    <button className="bg-pink-500 text-white px-6 py-2 rounded-full w-full max-w-xs mb-2" onClick={addTocartText}>Add to Cart</button>
                    <button className="text-gray-600 px-6 py-2 rounded-full w-full max-w-xs" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
