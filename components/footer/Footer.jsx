import { Button } from "../ui/button";
import localFont from "next/font/local";
import Logo2 from "@/public/logo2.png";
import Image from "next/image";

const Iowan = localFont({
  src: "../../fonts/iowan-old.ttf",
  display: "swap",
});

export default function Footer() {
  return (
    <footer className="w-screen bg-[#ECFEFF]">
      <div className="mx-auto mt-4 flex max-w-[1495.9px] flex-col gap-y-6 px-5 py-4 md:mt-9 md:gap-y-8 xl:mt-[50px] xl:gap-y-[41.63px] xl:px-0 xl:py-[50px]">
        <div className="mx-auto flex flex-col gap-y-6 xl:h-[193.63px] xl:w-[1265.66px] xl:gap-y-[41.63px]">
          <h2
            className={`${Iowan.className} scroll-m-20 text-center text-5xl tracking-tight text-[#0500FF] first:mt-0 md:text-7xl xl:text-[80px] xl:font-[900px] xl:leading-[90px]`}
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
        <div className="h-[0.5px] bg-[#004318] xl:w-[1495.9px]"></div>
        <div className="relative h-12 w-40 px-[20px] xl:h-[66px] xl:w-[190.48px] xl:px-0">
          <Image src={Logo2} alt="Image" className="object-cover" fill />
        </div>
        <p className="text-[20.81px] font-[700] text-[#004318] xl:h-[75px] xl:w-[202px] xl:px-0 xl:leading-[74.28px]">
          © 2024 Loved Pty Ltd
        </p>
      </div>
    </footer>
  );
}
