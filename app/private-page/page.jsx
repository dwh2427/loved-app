import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo3 from "@/public/logo3.svg";
import { Badge } from "@/components/ui/badge";
import Instagram from "@/public/instagram.svg";
import Facebook from "@/public/facebook.svg";
import LinkedIn from "@/public/linkedin.svg";
import Twitter from "@/public/twitter.svg";
import ProfileDropdown from "@/components/button/profile-dropdown";

export default function PrivatePage() {
  return (
    <>
      <header className="flex h-24 w-screen items-center border-b border-[#E9E9E9] px-5 md:h-[100px] md:px-16">
        <div className="mx-auto flex h-[74.01px] w-screen items-center justify-between md:relative md:max-w-[1665px]">
          <Link href="/">
            <Image src={Logo3} alt="" className="size-[66px]" />
          </Link>
          <div className="flex items-center">
            <div className="relative h-[32px] w-[90px] whitespace-nowrap text-center text-[20px] font-black leading-[31.22px] text-[#650031]">
              Your Page
              <div className="absolute left-1/2 h-[2px] w-[38px] -translate-x-1/2 bg-[#650031]"></div>
            </div>
            <ChevronDown className="text-[#650031]" />
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="mx-auto mt-[199px] h-[255px] w-full max-w-[821px] px-[20px] md:w-[821px] md:px-0">
        <h1 className="text-[25px] font-bold leading-[30px] text-[#650031]">
          Welcome Back, David
        </h1>
        <div className="mt-[64px] h-[161px] w-full max-w-[450px]">
          <p className="text-[18px] font-black leading-[22px] text-[#650031]">
            Page Link
          </p>
          <p className="text-[16px] leading-[19.2px] text-[#A2AEBA]">
            Raise money for charities and personal causes
          </p>
          <div className="mt-[16px] flex h-[49px] justify-between border-b border-[#E9E9E9]">
            <div>
              <p className=" text-[16px] font-medium leading-[19.2px]">
                loved.com/davehannes
              </p>
              <p className="text-[12px] font-bold leading-[14.4px] text-[#FE5487]">
                Preview Page
              </p>
            </div>
            <Link href={""}>
              <Badge
                variant="outline"
                className="border-[#FE5487] text-[16px] font-medium leading-[19.2px] text-[#FE5487]"
              >
                Share Page Link
              </Badge>
            </Link>
          </div>
          <div className="mt-[16px] h-[35px] border-b border-[#E9E9E9]">
            Create new page
          </div>
        </div>
      </div>

      <footer className="mt-[284px] h-[259.55px] w-screen bg-[#ECFEFF] px-5 py-[50px] md:px-[32.52px]">
        <div className="mx-auto flex h-[66px] items-center justify-between md:max-w-[1665px]">
          <Link href="/">
            <Image src={Logo3} alt="" className="size-[66px]" />
          </Link>
          <div className="flex gap-x-[10.41px]">
            <Image src={Instagram} alt="" className="size-[34.69px]" />
            <Image src={Facebook} alt="" className="size-[34.69px]" />
            <Image src={LinkedIn} alt="" className="size-[34.69px]" />
            <Image src={Twitter} alt="" className="size-[34.69px]" />
          </div>
        </div>
        <div className="mx-auto mt-[18.73px] text-[20.81px] font-bold leading-[74.28px] text-[#650031] md:max-w-[1665px]">
          © 2024 Loved Australia Pty Ltd
        </div>
      </footer>
    </>
  );
}
