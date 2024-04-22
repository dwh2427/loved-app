"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");

  console.log({ user });

  if (!user && !userSession) {
    router.push("/login");
  }
  return (
    <>
      <div>dashboard</div>
      <button
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem("user");
        }}
      >
        Log out
      </button>
    </>
  );
}
