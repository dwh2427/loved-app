import { Button } from "./ui/button";
import localFont from "next/font/local";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

const Iowan = localFont({
  src: "../fonts/iowan-old.ttf",
  display: "swap",
});

export default function Header() {
  return (
    <header className="flex h-24 w-screen items-center px-5 xl:h-[126.04px] ">
      <div className="mx-auto flex h-[74.01px] w-screen items-center justify-between xl:w-[1495px]">
        <Link href="/">
          <Image src={Logo} alt="" className="xl:h-[74.01px] xl:w-[118.48px]" />
        </Link>
        <div className="hidden h-[62px] w-[301px] flex-shrink-0 items-center gap-x-[32px] md:flex">
          <Link
            href={"/"}
            className="w-[54px] text-center text-[18px] font-[900] leading-[22px] text-black"
          >
            Sign in
          </Link>
          <Button
            variant={"default"}
            className="h-[62px] w-[215px] self-center rounded-[100px] bg-[#FF007A] px-[40px] py-[20px] text-[18px] font-[900] leading-[22px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50"
          >
            Start Loved page
          </Button>
        </div>
        <button className="md:hidden">
          <Menu className="size-10" />
        </button>
      </div>
    </header>
  );
}
