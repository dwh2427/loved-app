"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";

export default function Session({ children }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      user &&
      typeof window !== "undefined" &&
      sessionStorage.getItem("user")
    ) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  return isLoading ? <Loading /> : <>{children}</>;
}
