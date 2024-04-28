"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { cn } from "@/lib/utils";

export default function LogoutButton({ className }) {
  return (
    <button
      onClick={() => {
        signOut(auth);
        sessionStorage.removeItem("user");
      }}
      tabIndex={"-1"}
      className={cn(
        `mx-auto h-[20px] w-max text-center text-[18px] font-normal leading-[20px] text-[#004318]`,
        className,
      )}
    >
      Log out
    </button>
  );
}
