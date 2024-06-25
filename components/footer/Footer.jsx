'use client'
import Logo2 from "@/public/logo2.png";
import LoveLogo from '@/public/loved-white-logo.svg';
import localFont from "next/font/local";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Iowan = localFont({
  src: "../../fonts/iowan-old.ttf",
  display: "swap",
});

export default function Footer() {
  const pathname = usePathname().split('/')[1]
  return (
    <>
      {!['send-loved'].includes(pathname) &&
        <footer className="w-full bg-[#2E266F] px-5 bottom-0 ">
          <div className="mx-auto max-w-[1495px] mt-4 flex flex-col gap-y-6 px-5 py-4 md:mt-9 md:gap-y-8 xl:mt-[50px] xl:gap-y-[41.63px] xl:px-0 xl:py-[50px]">
            <div className="border-[0.5px] border-white mt-12"></div>
            <div className="flex justify-between items-center">
              <Image src={LoveLogo} alt="Image" width={170} height={40} />
              <div className="social-icon flex gap-3">
                <Instagram className="text-white" />
                <Facebook className="text-white" />
                <Linkedin className="text-white" fill="white" />
                <Twitter className="text-white" fill="white" />
              </div>
            </div>

            <div className="flex justify-between w-full text-white">
              <p className="text-[20.81px] font-[700] xl:leading-[74.28px] w-10/12 items-end flex">
                © 2024 Loved Pty Ltd
              </p>
              <p className="text-right text-[16px] w-6/12">
                [Footer: Links to Privacy Policy, Terms of Service, Contact Us, Social Media Icons]
                This design aims to convey empathy, warmth, and the importance of celebrating and honoring lifes milestones,
                both joyful and sorrowful. The layout is clean and intuitive, guiding users through
                the process of creating their memorials while emphasizing the supportive community aspect of the platform.
              </p>
            </div>
          </div>
        </footer>}
    </>
  );
}
