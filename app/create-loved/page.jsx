"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { Input } from "@/components/ui/input";
import useAuthState from "@/hooks/useAuthState";
import Logo from "@/public/logo.png";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Session from "./session";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export default function CreateLovedPage() {
  const [insertUsername, setInsertUserName] = useState(``);
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useAuthState();
  const router = useRouter();
  const handlePageLinkEdit = async (newValue) => {
    try {
      const value = newValue.split("/")[3];
      setIsUpdating(true);
      const res = await axios.put("/private-page/api", {
        username: value,
        uid: user?.uid,
      });
      if (res.data) {
        if (!res?.data?.data) return alert(res.data.message);

        router.push("/private-page");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const username = localStorage && localStorage.getItem("username");
    setInsertUserName(`${base_url}${username}`);
    console.log(insertUsername);
  }, []);

  return (
    <>
      <Session />
      <div className="lg:flex lg:w-screen">
        <div className="lg:flex lg:flex-1 lg:flex-col">
          <div className="mx-auto flex h-[183.13px] w-screen max-w-[766.82px] flex-col items-center justify-center md:hidden">
            <Link
              href="/"
              className="relative h-[118.62px] w-full max-w-[189.98px] md:h-[74.01px] md:max-w-[118.48px]"
            >
              <Image
                src={Logo}
                alt="Image"
                className="object-cover"
                fill
                sizes="100vw"
              />
            </Link>
          </div>
          <Link
            href="/"
            className="mt-[70px] hidden md:mx-auto md:flex md:h-[74.01px] md:w-[118.48px]"
          >
            <div className="relative md:h-[74.01px] md:w-[118.48px]">
              <Image
                src={Logo}
                alt="Image"
                className="object-cover"
                fill
                sizes="100vw"
              />
            </div>
          </Link>
          <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] text-[#650031] md:mt-[86px] md:w-full md:whitespace-nowrap md:text-[25px]">
            Congrats your page for Dave is ready
          </h3>
          <p className="mx-auto mt-[41.41px] text-center text-[25px] font-bold leading-[30px] md:mt-[46px]">
            Your Page URL is
          </p>
          <Input
            onChange={(e) => setInsertUserName(e.target.value)}
            value={insertUsername}
            className="mx-auto mt-[16px] h-[62px] w-[384px] rounded-[8px] border border-black/70 px-[25px] py-[20px] text-center text-[18px] font-bold leading-[22px] text-black/70"
          />

          <button
            disabled={isUpdating}
            onClick={() => handlePageLinkEdit(insertUsername)}
            className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 disabled:opacity-50 dark:bg-violet-600 dark:text-gray-50 md:mt-[86px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
          >
            View and Edit Page
          </button>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
