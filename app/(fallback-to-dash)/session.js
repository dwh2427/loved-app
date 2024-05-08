"use client";
import useAuthState from "@/hooks/useAuthState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Session({ children }) {
  const { user, loading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      user &&
      typeof window !== "undefined" &&
      sessionStorage.getItem("user")
    ) {
      router.push("/dashboard");
    }
  }, [user, router, loading]);

  return children;
}
