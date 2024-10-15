'use client'
import Verifycode from "@/components/form/verifycode";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Heart from "@/public/assets/img/heart.svg";


export default function VerifyOtp({ isOpen, setOnCloseOtp }) {
  const [pageLink, setPageLink] = useState("");
  
  return (
    <>


      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 custom-popup custom-overlay">
        <div className="flex lg:w-[64rem] lg:h-[40.4rem] mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
          {/* Left Side - Form Content */}
          <div className="flex-1 flex flex-col items-start lg:items-start left-side-content">
            {/* Logo for mobile only */}
            <div className=" flex flex-col w-full max-w-[766.82px] items-center justify-center otp-logo-div">
              <Link href="/" className="relative max-[600px]:h-[182.62px] w-full max-[600px]:max-w-[189.98px]">
                <Image
                  src={Logo}
                  alt="Image"
                  className="object-cover max-[600px]:w-[50%] md:h-[100%] md:w-[25%] lg:h-[95%] lg:w-[26%] logo-img"
                  width={165}
                  height={40}
                  sizes="100vw"
                />
              </Link>
            </div>

            {/* Form and Verify Code Section */}
            <div className="w-full lg:w-[530px]  lg:rounded-[16px] verify-code-section">
              <Verifycode />
            </div>
          </div>

          {/* Right Side - Cover Image */}
          <div className="otp-right-side w-full lg:w-1/2 flex flex-col justify-center items-center img w-[350px] h-[350px] lg:w-[512px] lg:h-[598px] bg-cover bg-center rounded-lg login-popup-padding relative" style={{ backgroundImage: 'linear-gradient(180deg, rgba(189, 183, 255, 0.00) 50%, #978EFA 100%), url(/assets/img/covers/signCoverImg.png)', }} >
          <div className="text-on-image bg-white absolute lg:mr-5">
            <Image
                  src={Heart}
                  alt="Heart"
                  width={20}
                  height={20}
                />
            <span className="">You just received love!</span>
          </div>
      </div>
        </div>
      </div>

  </>
  );
}
