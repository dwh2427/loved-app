"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { UserRound } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout";
import Image from "next/image";

export default function ProfileDropdown() {
  return (
    <>
      <Dialog tabIndex={"-1"}>
      <Image src="/notifications.svg" alt="" width="22" height="22"className="cursor-pointer size-[66px]" />
        <DialogTrigger asChild tabIndex={"-1"}>
          <div className="grid size-[62px] cursor-pointer place-items-center rounded-[65.45px] border-[1.06px]">
            <UserRound className="size-[37.5px] cursor-pointer" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[434px]">
          <DialogHeader tabIndex={"-1"}>
            <DialogTitle className="mb-[32px] text-[25px] font-bold leading-[30px] text-[#650031]">
              Your Profile
            </DialogTitle>
          </DialogHeader>
          {/* <div className="h-[35px] w-full border-b border-[#E9E9E9]">
            <Link
              href="/change-password"
              tabIndex={"-1"}
              className="text-[16px] font-bold leading-[19.2px] text-black/70"
            >
              Settings
            </Link>
          </div> */}
          <div className="mt-[10px] h-[35px] w-full border-b border-[#E9E9E9]">
            <Link
              href="/change-password"
              tabIndex={"-1"}
              className="text-[16px] font-bold leading-[19.2px] text-black/70"
            >
              Change password
            </Link>
          </div>
          <div className="mt-[10px] h-[35px] w-full border-b border-[#E9E9E9]">
            <Link
              href="/change-email"
              tabIndex={"-1"}
              className="text-[16px] font-bold leading-[19.2px] text-black/70"
            >
              Change email
            </Link>
          </div>
          <div className="mt-[10px] h-[35px] w-full border-b border-[#E9E9E9]">
            <LogoutButton className="text-[16px] font-bold leading-[19.2px] text-black/70">
              {/* Sign out */}
            </LogoutButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
