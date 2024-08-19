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
      <div className="flex w-full flex-col lg:flex-row">
        <div className="flex flex-1 flex-col items-center lg:items-start">
          <div className="w-full px-4 lg:mx-auto lg:w-[530px] lg:space-y-[16px] lg:rounded-[16px] lg:px-0">
            <div className="flex flex-col items-center justify-center text-center lg:h-[70px] lg:w-[402px] lg:space-y-[10px]">
              <h2 className="mt-9 mx-auto text-4xl max-h-[65px] max-w-[289px] whitespace-nowrap text-[32px] font-black leading-[40px] tracking-[0.01em] text-black lg:h-[40px] lg:w-[263px] lg:text-[40px] lg:leading-[40px] login-header">
                {defaultText}
              </h2>
            </div>
            <p className="w-full text-[25.88px] leading-[29.12px] md:mx-auto md:h-[28px] md:text-[12px] md:leading-[14.4px] login-text">
              {paragraphText}
            </p>
            <LoginForm />
            <p className="w-full max-w-[689.17px] text-[25.88px] leading-[29.12px] md:mx-auto md:h-[28px] md:w-[386px] md:text-[12px] md:leading-[14.4px]">
              By clicking the Sign In button below, you agree to the Loved{" "}
              <span className="border-b-[0.5px] border-black cursor-pointer">
                Terms of Service
              </span>{" "}
              and acknowledge the{" "}
              <span className="border-b-[0.5px] border-black cursor-pointer">
                Privacy Notice
              </span>
            </p>
          </div>
        </div>
      </div>
    </FallbackToDashboard>
  );
}
