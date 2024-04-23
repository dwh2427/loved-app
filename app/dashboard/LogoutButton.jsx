"use client";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function LogoutButton() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const userSession = sessionStorage.getItem("user");
      if (!userSession) {
        router.push("/login");
      }
    }
  }, [user, router]);
  return (
    <button
      onClick={() => {
        signOut(auth);
        sessionStorage.removeItem("user");
      }}
      className="h-[20px] w-full text-center text-[18px] font-normal leading-[20px] text-[#004318]"
    >
      Log out
    </button>
  );
}
