import Logo3 from "@/public/logo3.svg";
import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import Bell from "@/public/bell.svg";

export default function DashBoardHeader() {
  return (
    <header className="flex h-24 w-screen items-center border-b border-[#E9E9E9] px-5 md:h-[100px] md:px-16">
      <div className="mx-auto flex h-[74.01px] w-screen items-center justify-between md:max-w-[1665px]">
        <Link href="/">
          <Image src={Logo3} alt="" className="size-[66px]" />
        </Link>
        <div className="flex max-h-[62px] max-w-[156px] items-center gap-x-[32px]">
          <div className="grid size-[62px] cursor-pointer place-items-center rounded-[65.45px] border-[1.06px]">
            <Image src={Bell} alt="" className="size-[37.5px]" />
          </div>
          <div className="grid size-[62px] cursor-pointer place-items-center rounded-[65.45px] border-[1.06px]">
            <UserRound className="size-[37.5px]" />
          </div>
        </div>
      </div>
    </header>
  );
}
