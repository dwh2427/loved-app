/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import ProfileDropdown from "@/components/button/profile-dropdown";
import PublictFooter from "@/components/footer/PublicFooter";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import Logo3 from "@/public/logo3.svg";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageDetaisl from "./(components)/PageDetails";

export default function PrivatePage() {
  const { user } = useAuthState()
  const [userDetails, setUserDetails] = useState('')
  const [pageData, setPageData] = useState(null)
  const handleClientError = useClientError()
  const [isLoadingData, seIsLoadingData] = useState(true)
  const apiCaller = useApiCaller()
  useEffect(() => {
    if (!user?.uid) return
    apiCaller.get(`/dashboard/api`)
      .then(res => {
        // console.log(res.data)
        setUserDetails(res.data?.user)
        setPageData(res.data?.loved)
      }).catch(error => console.log(handleClientError(error))).finally(seIsLoadingData(false))
  }, [user, apiCaller])

  if (isLoadingData) { return "Loading ..." }
  return (
    <>
      <header className="flex h-24 w-screen items-center border-b border-[#E9E9E9] px-5 md:h-[100px] md:px-16">
        <div className="mx-auto flex h-[74.01px] w-screen items-center justify-between md:relative md:max-w-[1665px]">
          <Link href="/">
            <Image src={Logo3} alt="" className="size-[66px]" />
          </Link>
          <div className="flex items-center">
            <div className="relative h-[32px] w-[90px] whitespace-nowrap text-center text-[20px] font-black leading-[31.22px] text-[#650031]">
              Your Page
              <div className="absolute left-1/2 h-[2px] w-[38px] -translate-x-1/2 bg-[#650031]"></div>
            </div>
            <ChevronDown className="text-[#650031]" />
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="mx-auto mt-6  flex flex-col gap-[32px] md:mt-[199px] h-fit w-full max-w-[821px]   px-[20px] md:w-[821px] md:px-0 mb-[104px]">
        <h1 className="text-[25px] font-bold leading-[30px] text-[#650031]">
          Welcome Back, {userDetails?.first_name}
        </h1>

        {pageData && pageData?.length > 0 ? pageData.map(i => <PageDetaisl item={i} key={i._id} />) : <PageDetaisl item={{}} />}

      </div>

      <PublictFooter />
    </>
  );
}
