'use client'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import SearchInput from "./../components/SearchInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY); // Replace with your Stripe public key
import PaymentMethodModal from "../components/PaymentMethodModal";


const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});

const formSchema = z.object({
    inputValue: z.string().nonempty("Please enter a valid name"),
    username: z.string().nonempty("Username is required").regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
  });

export default function CreateTemplate() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const label = searchParams.get('label');
    const selectedImage = searchParams.get('selectedImage');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ensure the `amount` from search params is converted to a number
    const getTotal = parseFloat(searchParams.get('amount') || 0); // Default to 0 if null

    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);

    // Ensure `subTotal` is a number
    const [subTotal, setSubTotal] = useState(getTotal);

    // Add state to track if the gift is deleted (to show "Add Gift" button)
    const [isGiftDeleted, setIsGiftDeleted] = useState(false);

    // Calculate the tip amount based on the default 16% tip
    const [tipPercent, setTipPercent] = useState(0);
    const [tipAmount, setTipAmount] = useState(parseFloat((getTotal * (0 / 100)).toFixed(3)));

    // Calculate the order total
    const [orderTotal, setOrderTotal] = useState(parseFloat((getTotal + tipAmount).toFixed(3)));
    const [isTipVisible, setIsTipVisible] = useState(false); // State to track tip functionality visibility

    const handleTipChange = (e) => {
        const newTipPercent = parseFloat(e.target.value);

        // Ensure `subTotal` is treated as a number for calculation
        const newTipAmount = parseFloat((subTotal * (newTipPercent / 100)).toFixed(3));
        const newOrderTotal = parseFloat((subTotal + newTipAmount).toFixed(3));

        setTipPercent(newTipPercent);
        setTipAmount(newTipAmount);
        setOrderTotal(newOrderTotal);
    };

    const handleEdit = (e) => {
        localStorage.setItem('redirectUrl', `${pathname}?${searchParams}`);
        router.push('/send-love/create-cover');
    };

    const handleBack = (e) => {
        router.push("/send-love/add-gift");
    };

    // Add function to handle delete (set amount to 0 and show Add Gift button)
    const handleDelete = () => {
        setSubTotal(0); // Set the subtotal to zero
        setOrderTotal(0);
        setIsGiftDeleted(true); // Show "Add Gift" button
    };

    const {
        register,
        setValue,
        getValues,
        watch,
        setError,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const inputValue = watch("inputValue");

    useEffect(() => {
        const getPages = async () => {
            try {
                const response = await axios.get("/send-love/api");
                setPages(response.data);
            } catch (error) {
                // Handle error
            }
        };
        getPages();
    }, []);

    const svgRef = useRef(null);
    const [cardImage, setCardImage] = useState('');
    useEffect(() => {
        const image = window !== undefined && localStorage.getItem('cardImage');
        setCardImage(image);
    }, []);


    return (
        <>
            <CardHeader pageLink="dashboard" />
            <div className="container mx-auto mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                <h2 className="text-3xl font-bold">Confirm and Send Your Message</h2>
                <form>
                    <div className="mb-4">
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                        Recipient
                    </label>
    
                    <SearchInput
                        inputValue={inputValue}
                        setValue={setValue} // Pass the setValue function to update state
                        watch={watch} // Pass the watch function if used in the component
                        pages={pages} // Pass the list of pages for filtering suggestions
                        setSelectedPage={setSelectedPage} // Pass the function to update the selected page
                        errors={errors} // Pass any form validation errors
                        setError={setError}
                    />
                    </div>
                    
                    <hr className="my-6 border-gray-200" />

                    <div className="mb-4">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                        From
                    </label>
                    <input
                        type="text"
                        id="from"
                        placeholder="Your name"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    />
                    </div>

                    <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Your email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    />
                    </div>

                    <button
                    type="button"
                    className="cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-full shadow-sm hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    onClick={() => setIsModalOpen(true)}
                   >
                    <i className="fas fa-plus mr-2"></i>Add Payment Method
                    </button>
                </form>

                <div className="flex justify-end space-x-4 mt-4">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-500 font-medium transition-colors hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75v-1.5M15.75 3.75v-1.5M3.75 8.25h16.5M3.75 7.5h16.5v13.5h-16.5V7.5zm3 3V6m9 4.5V6" />
                        </svg>
                        Schedule for later
                    </button>

                    <button className="px-6 py-2 bg-pink-400 rounded-full text-white font-semibold transition-colors hover:bg-pink-500">
                        Send Now
                    </button>
                </div>

                </div>

                {/* Right Column */}
                <div className="bg-gray-100 p-6 rounded-lg">
                <div className="relative flex items-center justify-center h-96 bg-pink-100 rounded-lg">
                    <div className="absolute w-44 h-60 bg-white transform rotate-6 shadow-md rounded-lg"></div>
                    <div className="absolute w-52 h-72 bg-white shadow-lg rounded-lg z-10"></div>
                    <img src="/home/checkout/icon/pencilIcon.svg" alt="icon"  onClick={handleEdit} className="absolute top-4 right-4 w-8 h-8 cursor-pointer" />

                    
                    <Image
                        src={cardImage}
                        alt="Default"
                        width={280}
                        height={298}
                        className="absolute z-20"
                    />
                    <img src="/home/checkout/thumb/love.svg" alt="img" className="absolute z-20" />
                </div>
{/* 
                <div className="flex items-center mt-6">
                    <img src={selectedImage} alt="thumb" className="w-16 h-16 rounded-full" />
                    <div className="ml-4">
                    <h5 className="text-lg font-semibold">{label}</h5>
                    <h6 className="text-gray-500">Can spend at any</h6>
                    <h5 className="text-xl font-bold">${subTotal}</h5>
                    </div>
                    <div className="ml-auto flex space-x-3">
                    <img src="/home/checkout/icon/edit.svg" onClick={ handleBack } alt="edit icon" className="w-6 h-6 cursor-pointer" />
                    <img src="/home/checkout/icon/delete.svg" alt="delete icon" className="w-6 h-6 cursor-pointer delete-icon" />
                    </div>
                </div> */}


                <div className="flex items-center mt-6">
                            {!isGiftDeleted ? (
                                <>
                                    <img src={selectedImage} alt="thumb" className="w-16 h-16 rounded-full" />
                                    <div className="ml-4">
                                        <h5 className="text-lg font-semibold">{label}</h5>
                                        <h5 className="text-xl font-bold">${subTotal}</h5>
                                    </div>
                                    <div className="ml-auto flex space-x-3">
                                        <img src="/home/checkout/icon/edit.svg" onClick={handleBack} alt="edit icon" className="w-6 h-6 cursor-pointer" />
                                        <img src="/home/checkout/icon/delete.svg" onClick={handleDelete} alt="delete icon" className="w-6 h-6 cursor-pointer delete-icon" />
                                    </div>
                                </>
                            ) : (
                                <button 
                                    onClick={() => router.push("/send-love/add-gift")} 
                                    className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-full shadow-sm hover:bg-pink-500"
                                >
                                    Add Gift
                                </button>
                            )}
                        </div>


                <div className="mt-6">
                    <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Sub Total</span>
                    <span className="text-sm font-medium text-gray-700">${subTotal}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                    <div>
                        <span className="text-sm font-medium text-gray-700">Add a Tip for Loved?</span><br />
                        <span className="text-xs text-gray-500">Support our free service</span>
                    </div>
                    {!isTipVisible ? (
                    <button 
                      className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-500"
                      onClick={() => setIsTipVisible(true)}
                      >
                        Add Tip
                    </button>
                      ) : (
                        <div className="mt-4">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span>Add a Tip for Loved?</span>
                                <span style={{ marginLeft: '10px' }}>Support our free service</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <input 
                                type="range" 
                                min="0" 
                                max="30" 
                                value={tipPercent} 
                                onChange={handleTipChange} 
                                style={{ flex: 1, marginRight: '10px' }} 
                                />
                                <span>${tipAmount.toFixed(2)} ({tipPercent}%)</span>
                            </div>
                        </div>
                     )}
                    </div>
                    <hr className="my-4 border-gray-200" />
                    <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Order total</span>
                    <span className="text-sm font-medium text-gray-700">${orderTotal}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
           
            <Elements stripe={stripePromise}>
                <PaymentMethodModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                />
            </Elements>

        </>
    );
}
