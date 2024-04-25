'use client';
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
    if (!user && typeof window !== "undefined") {
      const userSession = sessionStorage.getItem("user");
      if (!userSession) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
}
