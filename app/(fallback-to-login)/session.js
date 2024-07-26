"use client";
import { useEffect } from "react";

import useAuthState from "@/hooks/useAuthState";
import { useRouter } from "next/navigation";

export default function Session({ children }) {
  const { user, loading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      const userSession = sessionStorage.getItem("user");
      router.push("/login");
    }
  }, [user, router, loading]);

  return children;
}
