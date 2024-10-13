'use client'
import Verifycode from "@/components/form/verifycode";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";


export default function VerifyOtp({ isOpen, setOnCloseOtp }) {
  const [pageLink, setPageLink] = useState("");
  
  return (
    <>


      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 custom-popup">
        <div className="flex lg:w-[64rem] lg:h-[39rem] mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
          {/* Left Side - Form Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start">
            {/* Logo for mobile only */}
            <div className="mx-auto flex h-[183.13px] w-full max-w-[766.82px] flex-col items-center justify-center lg:hidden">
              <Link href="/" className="relative h-[0px] w-full max-w-[189.98px]">
                <Image
                  src={Logo}
                  alt="Image"
                  className="object-cover"
                  width={165}
                  height={40}
                  sizes="100vw"
                />
              </Link>
            </div>

            {/* Form and Verify Code Section */}
            <div className="w-full lg:mx-auto lg:w-[530px] lg:space-y-[16px] lg:rounded-[16px] lg:px-0">
              <Verifycode />
            </div>
          </div>

          {/* Right Side - Cover Image */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
            <img
              src="../assets/img/covers/signCoverImg.png"
              alt="Cover Image"
              className="w-[350px] h-[350px] lg:w-[466px] lg:h-[598px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

  </>
  );
}
