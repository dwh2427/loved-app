"use client";
import { auth } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className }) {
  const router = useRouter()
  return (
    <button
      onClick={() => {
        signOut(auth);
        sessionStorage.removeItem("user");
        router.push('/login')
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
