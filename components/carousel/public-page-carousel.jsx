/* eslint-disable @next/next/no-img-element */
import leftArrow from "@/public/left-arrow.png";
import rightArrow from "@/public/right-arrow.png";
import Image from 'next/image';
import { useState } from 'react';
const CustomSlider = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative">
            <div className="overflow-hidden rounded-lg">
                <div
                    className="flex transition-transform ease-in-out duration-300 transform"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (

                        <div key={index} className="w-1/2 flex-shrink-0">
                            <img
                                src={slide}
                                alt={`Slide ${index + 1}`}
                                width={100}
                                height={345}
                                className="w-full rounded-[8px] md:h-[345px]"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={prevSlide} className="absolute left-0 top-1/2 z-10  -translate-y-1/2 transform md:-left-10">
                <Image src={leftArrow} alt="" className="h-8 w-6 md:w-8" />
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 z-10  -translate-y-1/2 transform md:-right-10">
                <Image src={rightArrow} alt="" className="h-8 w-6 md:w-8" />
            </button>
            {/* <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
                onClick={prevSlide}
            >
                &lt;
            </button>

            <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
            
            >
                &gt;
            </button> */}
        </div>
    );
};

export default CustomSlider;
