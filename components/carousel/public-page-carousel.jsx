/* eslint-disable @next/next/no-img-element */
import leftArrow from "@/public/left-arrow.svg";
import rightArrow from "@/public/right-arrow.svg";
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

    let translateX;

    if (slides.length > 1) {
        translateX = -(currentIndex * (50 / (slides.length - 2))); // Adjusted translation for multiple images
    } else {
        translateX = 0; // Center the only image if only one exists
    }

    return (
        <div className="relative">
            <div className="overflow-hidden rounded-lg">
                <div
                    className="w-full px-2 flex items-center transition-transform ease-in-out duration-300 transform gap-2"
                    style={{ transform: `translateX(${translateX}%)` }}
                >
                    {slides.map((slide, index, arr) => (
                        <div key={index} className={`${arr.length === 1 ? 'w-full' : 'w-1/2 '} flex-shrink-0 flex items-center justify-center`}> {/* Adjusted width */}
                            <img
                                src={slide}
                                alt={`Slide ${index + 1}`}
                                className="rounded-[8px] md:h-[345px] w-[616px] shadow"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* <button onClick={prevSlide} disabled={slides.length === 2} className="absolute left-0 top-1/2 z-10  -translate-y-1/2 transform md:-left-10">
                <Image src={leftArrow} alt="" className="h-8 w-6 md:w-8" />
            </button>
            <button onClick={nextSlide} disabled={slides.length === 2} className="absolute right-0 top-1/2 z-10  -translate-y-1/2 transform md:-right-10">
                <Image src={rightArrow} alt="" className="h-8 w-6 md:w-8" />
            </button> */}
        </div>
    );
};

export default CustomSlider;
