"use client";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function Session() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const userSession = sessionStorage.getItem("user");
      if (!userSession) {
        // router.push("/login");
      }
    }
  }, [user, router]);
  return;
}
