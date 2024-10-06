'use client'
import Verifycode from "@/components/form/verifycode";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const OtpHeader = dynamic(
  () => import("@/components/loved-box/otpHeader"),
  {
    ssr: false,
  },
);


export default function VerifyOtp() {
  const [pageLink, setPageLink] = useState("");
  
  return (
    <>
      <OtpHeader pageLink={pageLink} />
      {/* <div className="flex w-full flex-col lg:flex-row">
        <div className="flex flex-1 flex-col items-center lg:items-start">
          <div className="mx-auto flex h-[183.13px] w-full max-w-[766.82px] flex-col items-center justify-center lg:hidden">
            <Link
              href="/"
              className="relative h-[118.62px] w-full max-w-[189.98px]"
            >
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
         
          <div className="w-full px-4 lg:mx-auto lg:w-[530px] lg:space-y-[16px] lg:rounded-[16px] lg:px-0 ">
            <Verifycode />
          </div>
        </div>
    
      </div> */}



    <div className="flex w-full min-h-screen flex-col lg:flex-row  bg-gray-200 p-8">
      <div className="flex lg:w-[64rem] lg:h-[39rem] mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Left Side - Form Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start">
          {/* Logo for mobile only */}
          <div className="mx-auto flex h-[183.13px] w-full max-w-[766.82px] flex-col items-center justify-center lg:hidden">
            <Link href="/" className="relative h-[118.62px] w-full max-w-[189.98px]">
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
          <div className="w-full px-4 lg:mx-auto lg:w-[530px] lg:space-y-[16px] lg:rounded-[16px] lg:px-0">
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
