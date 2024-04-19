import { Button } from "./ui/button";
import localFont from "next/font/local";
import Logo2 from "@/public/logo2.png";
import Image from "next/image";

const Iowan = localFont({
  src: "../fonts/iowan-old.ttf",
  display: "swap",
});

export default function Footer() {
  return (
    {/* <footer className="mx-auto mt-[50px] w-fit flex-col py-[50px]">
      <div className="mx-auto flex max-w-[1495.9px] flex-col gap-y-[41.63px]">
        <div className="grid place-items-center gap-y-[41.63px]">
          <h2
            className={`${Iowan.className} scroll-m-20 text-center text-[80px] font-[900px] leading-[90px] tracking-tight text-[#0500FF] first:mt-0`}
          >
            Start Honoring Life Today
          </h2>
          <Button
            variant={"default"}
            className="h-[62px] w-[215px] self-center rounded-[100px] bg-[#FF007A] px-[40px] py-[20px] text-[18px] font-[900] leading-[22px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50"
          >
            Start Loved page
          </Button>
        </div>
        <div className="mx-auto xl:w-[1495.9px] border-b-[0.5px] border-[#004318]"></div>
        <div className="relative h-[66px] w-[190.48px]">
          <Image
            src={Logo2}
            alt="Image"
            className="rounded-md object-cover"
            fill
            sizes="190px"
          />
        </div>
        <p className="h-[75px] w-[202px] text-[20.81px] font-[700] leading-[74.28px] text-[#004318]">
          © 2024 Loved Pty Ltd
        </p>
      </div>
    </footer> */}
  );
}
