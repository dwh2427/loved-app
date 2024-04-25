"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        signOut(auth);
        sessionStorage.removeItem("user");
      }}
      className="mx-auto h-[20px] w-max text-center text-[18px] font-normal leading-[20px] text-[#004318]"
    >
      Log out
    </button>
  );
}
