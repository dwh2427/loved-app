'use client'
import LoginForm from "@/components/form/login";
import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import FallbackToDashboard from "../(fallback-to-dash)/layout";
const OtpHeader = dynamic(
  () => import("@/components/loved-box/otpHeader"),
  {
    ssr: false,
  },
);

export default function LoginPage() {
  const [pageLink, setPageLink] = useState("");
  const [defaultText, setDefaultText] = useState("Sign in / Sign up");
  const [paragraphText, setParagraphText] = useState("");

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    // Parse the URL
    const parsedUrl = new URL(currentUrl);

    // Get the search parameters
    const params = new URLSearchParams(parsedUrl.search);

    if (params.has('verify')) {
      const verifyValue = params.get('verify');
      localStorage.setItem('verifyValue', verifyValue);
      localStorage.setItem('sendLoveUrl', `/login/received-gift`);
      setDefaultText("Accept your Loved gift");
      setParagraphText("We’ll use your phone number to confirm your identity to claim your gift.");
    }
  }, []);

  return (
    <FallbackToDashboard>
      <OtpHeader pageLink={pageLink} />



      <div className="flex w-full min-h-screen bg-gray-800 bg-opacity-40 p-8 mx-auto pt-[200px]">
      <div className="flex lg:w-[64rem] lg:h-[39rem] mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Left Side - Sign In Form*/}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8">
          <div className="mx-auto flex h-[183.13px] w-full max-w-[766.82px] flex-col items-center justify-center lg:hidden">
            <Link href="/" className="relative h-[182.62px] w-full max-w-[189.98px]">
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

          {/* Sign In Form Container */}
          <div className="bg-white rounded-lg w-full max-w-md">
            {/* Sign In Header*/}
            <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontSize: '28px' }}>Sign In</h2>
            <p className="text-gray-600 mb-8">Share a message with a loved one</p>

            {/* Phone Number Input*/}

            <LoginForm />

            {/*  Terms and Privacy Notice */}
            <p className="text-center text-gray-500 text-xs mt-4">
              By clicking the Sign In button below, you agree to the Loved{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and acknowledge the{" "}
              <a href="#" className="underline">
                Privacy Notice
              </a>.
            </p>
          </div>
        </div>


        {/* Right Side - Cover Image */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center img-none">
          <img
            src="assets/img/covers/signCoverImg.png"
            alt="Cover Image"
            className="w-[350px] h-[350px] lg:w-[466px] lg:h-[598px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>

    </FallbackToDashboard>
  );
}
