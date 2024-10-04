'use client'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from 'next/navigation'


const CardHeader = dynamic(() => import("@/components/card-header/cardHeader"), {
    ssr: false,
});
const myState = history.state;//store the state variable outside the component


export default function CreateTemplate() {

    const searchParams = useSearchParams()
    const subTotal = searchParams.get('amount');
    const label = searchParams.get('label');
    const selectedImage = searchParams.get('selectedImage');

    const [routeState, setRouteState] = useState({});
    useEffect(() => {
        console.log(myState.amount);
        setRouteState(myState);
      }, []);

    const svgRef = useRef(null);
    const [cardImage, setCardImage] = useState('')
    useEffect(() => {
        const image = window !== undefined && localStorage.getItem('cardImage')
        setCardImage(image)
    }, [])


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
                    <div className="relative mt-1">
                        <input
                        type="search"
                        name="query"
                        placeholder="Name, mobile or email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                    </div>
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
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-full shadow-sm hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                    <i className="fas fa-plus mr-2"></i>Add Payment Method
                    </button>
                </form>
                </div>

                {/* Right Column */}
                <div className="bg-gray-100 p-6 rounded-lg">
                <div className="relative flex items-center justify-center h-96 bg-pink-100 rounded-lg">
                    <div className="absolute w-44 h-60 bg-white transform rotate-6 shadow-md rounded-lg"></div>
                    <div className="absolute w-52 h-72 bg-white shadow-lg rounded-lg z-10"></div>
                    <img src="/home/checkout/icon/pencilIcon.svg" alt="icon" className="absolute top-4 right-4 w-8 h-8" />
                    <Image
                        src={cardImage}
                        alt="Default"
                        width={280}
                        height={298}
                        className="absolute z-20"
                    />
                    <img src="/home/checkout/thumb/love.svg" alt="img" className="absolute z-20" />
                </div>

                <div className="flex items-center mt-6">
                    <img src={selectedImage} alt="thumb" className="w-16 h-16 rounded-full" />
                    <div className="ml-4">
                    <h5 className="text-lg font-semibold">{label}</h5>
                    <h6 className="text-gray-500">Can spend at any</h6>
                    <h5 className="text-xl font-bold">${subTotal}</h5>
                    </div>
                    <div className="ml-auto flex space-x-3">
                    <img src="/home/checkout/icon/edit.svg" alt="edit icon" className="w-6 h-6" />
                    <img src="/home/checkout/icon/delete.svg" alt="delete icon" className="w-6 h-6" />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Subtotal</span>
                    <span className="text-sm font-medium text-gray-700">${subTotal}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                    <div>
                        <span className="text-sm font-medium text-gray-700">Add a Tip for Loved?</span><br />
                        <span className="text-xs text-gray-500">Support our free service</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-500">
                        Add Tip
                    </button>
                    </div>
                    <hr className="my-4 border-gray-200" />
                    <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Order total</span>
                    <span className="text-sm font-medium text-gray-700">${subTotal}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
           
        </>
    );
}
