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
      <div className="flex w-full flex-col lg:flex-row">
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
    
      </div>
  </>
  );
}
