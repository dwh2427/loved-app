"use client";
import Logo2 from "@/public/logo2.png";
import LoveLogo from "@/public/loved-white-logo.svg";
import localFont from "next/font/local";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Iowan = localFont({
  src: "../../fonts/iowan-old.ttf",
  display: "swap",
});

export default function Footer() {
  const pathname = usePathname().split("/")[1];
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSendingOpen, setIsSendingOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  // const sendingRef = useRef(null);
  // const resourcesRef = useRef(null);
  // const aboutRef = useRef(null);

  return (
    <>
      {!["send-loved", "login"].includes(pathname) && (
        <footer className="bottom-0 w-full bg-[#2E266F] px-5">
          <div className="mx-auto mt-4 flex max-w-[1495px] flex-col px-5 py-4 md:mt-9 md:gap-y-8 xl:mt-[50px] xl:gap-y-[41.63px] xl:px-0 xl:py-[50px]">
            <div className="d-rs-hidden flex justify-between">
              <div className="flex flex-col">
                <h3 className="text-[18px] font-bold leading-[28px] text-white">
                  Contact
                </h3>
                <button className="mt-2 rounded-full bg-[#FF318C] px-4 py-2 text-white">
                  Call us
                </button>
                <button className="mt-2 rounded-full bg-[#FF318C] px-4 py-2 text-white">
                  Email us
                </button>
              </div>
              <div className="flex flex-col">
                <ul className="text-white">
                  <li className="font-bold leading-7">Sending & Receiving</li>
                  <li className="font-medium leading-7">
                    <a href="/donation-tips">Donations</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/loved-notes">Loved Notes</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/flowers">Flowers</a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col">
                <ul className="text-white">
                  <li className="font-bold leading-7">Resources</li>
                  <li className="font-medium leading-7">
                    <a href="/frequently-asked-questions">FAQs</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/pricing">Pricing</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/help">Get help</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/how-to-guide">How to guide</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/blog">Blog</a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col">
                <ul className="text-white">
                  <li className="font-bold leading-7">About us</li>
                  <li className="font-medium leading-7">
                    <a href="/who-we-are">Who we are</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/hiring">Hiring</a>
                  </li>
                  <li className="font-medium leading-7">
                    <a href="/press-page">Press Page</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rs-gap-10 d-rs-col d-rs-block flex hidden  justify-between py-5">
              <Link
                href="/find-loved"
                className="search-loved relative cursor-pointer "
              >
                <svg
                  className="text-whtie absolute top-1 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#fff"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <p className="w-full cursor-pointer px-10 py-1 pl-5 pr-1 text-[16px] font-[500] leading-[18px] text-white outline-none">
                  Find Someone Loved
                </p>
              </Link>
              <div className="flex flex-col">
                <h3
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  className="d-rs-flex-between text-[16px] font-bold leading-[17px] text-white"
                >
                  Contact
                  <svg
                    className={`d-rs-block -mr-1 ml-2 hidden h-5 w-5 transform transition-transform ${isContactOpen ? "rotate-180" : "rotate-0"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </h3>
                {isContactOpen && (
                  <>
                    <button className="mt-2 rounded-full bg-[#FF318C] px-4 py-2 text-white">
                      Call us
                    </button>
                    <button className="mt-2 rounded-full bg-[#FF318C] px-4 py-2 text-white">
                      Email us
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                <ul className="text-white">
                  <li
                    onClick={() => setIsSendingOpen(!isSendingOpen)}
                    className="d-rs-flex-between text-[16px] font-bold leading-[17px]"
                  >
                    Sending & Receiving{" "}
                    <svg
                      className={`d-rs-block -mr-1 ml-2 hidden h-5 w-5 transform transition-transform ${isSendingOpen ? "rotate-180" : "rotate-0"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>{" "}
                  </li>
                  {isSendingOpen && (
                    <>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/donation-tips">Donations</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/loved-notes">Loved Notes</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/flowers">Flowers</a>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex flex-col">
                <ul className="text-white">
                  <li
                    onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                    className="d-rs-flex-between text-[16px] font-bold leading-[17px]"
                  >
                    Resources
                    <svg
                      className={`d-rs-block -mr-1 ml-2 hidden h-5 w-5 transform transition-transform ${isResourcesOpen ? "rotate-180" : "rotate-0"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </li>
                  {isResourcesOpen && (
                    <>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/frequently-asked-questions">FAQs</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/pricing">Pricing</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/help">Get help</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/how-to-guide">How to guide</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/blog">Blog</a>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex flex-col">
                <ul className="text-white">
                  <li
                    onClick={() => setIsAboutOpen(!isAboutOpen)}
                    className="d-rs-flex-between text-[16px] font-bold leading-[17px]"
                  >
                    About us
                    <svg
                      className={`d-rs-block -mr-1 ml-2 hidden h-5 w-5 transform transition-transform ${isAboutOpen ? "rotate-180" : "rotate-0"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </li>
                  {isAboutOpen && (
                    <>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/who-we-are">Who we are</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/hiring">Hiring</a>
                      </li>
                      <li className="mt-2 text-[16px] font-[500] leading-[17px]">
                        <a href="/press-page">Press Page</a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-Gray my-[41.63px] border-[0.5px]"></div>

            <div className="flex flex-col items-center justify-between md:flex-row">
              <Image
                src={LoveLogo}
                className="footer-logo-size"
                alt="Image"
                width={166.269}
                height={37.953}
              />
              <div className="social-icon mb-[17.5px] mt-[41.63px] flex gap-[18px] md:mt-0">
                <a href="https://www.instagram.com/lovedmatters/">
                  <Image
                    src="/social-icons/instagram.svg"
                    alt="Image"
                    width={41.625}
                    height={41.625}
                  />
                </a>

                <a href="https://www.facebook.com/lovedmatters/">
                  <Image
                    src="/social-icons/facebook.svg"
                    alt="Image"
                    width={21.625}
                    height={21.625}
                  />
                </a>

                <a href="https://www.linkedin.com/company/lovedmatters">
                  <Image
                    src="/social-icons/linkedin.svg"
                    alt="Image"
                    width={41.625}
                    height={41.625}
                  />
                </a>

                <a href="https://x.com/lovedmatters">
                  <Image
                    src="/social-icons/x.svg"
                    alt="Image"
                    width={41.625}
                    height={41.625}
                  />
                </a>
              </div>
            </div>

            <div className="hidden w-full flex-col justify-between text-white md:flex md:flex-row">
              <div className="flex w-full items-end justify-center text-center text-[16px] font-[500] md:w-10/12 md:justify-start md:text-left md:leading-[17px]">
                <p>© 2024 Loved Australia Pty Ltd</p>
              </div>

              <div className="mt-4 grid w-full items-end justify-center text-right text-[16px] md:mt-0 md:w-6/12 md:justify-end md:text-right">
                <a className="text-[16px] font-[500]" href="/privacy-policy">
                  Privacy Policy
                </a>
                <a
                  className="text-[16px] font-[500]"
                  href="/terms-and-conditions"
                >
                  Terms of Service
                </a>
              </div>
            </div>
            <div className="mt-[41.63px] flex w-full flex-col justify-between text-white md:mt-0 md:hidden md:flex-row">
              <div className="grid w-full items-end justify-center text-center text-[14px] md:mt-0 md:w-6/12 md:justify-end md:text-left">
                <a
                  className="text-[16px] font-[500] leading-[17px]"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-[16px] font-[500] leading-[17px]"
                  href="/terms-and-conditions"
                >
                  Terms of Service
                </a>
              </div>
              <p className="mb-[41.63px] mt-[41.63px] flex w-full items-end justify-center text-center text-[16px] font-[500] leading-[17px] xl:leading-[74.28px]">
                © 2024 Loved Australia Pty Ltd
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
