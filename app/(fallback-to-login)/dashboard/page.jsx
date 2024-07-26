/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import FallbackToLoginLayout from "../layout";
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
        setUserDetails(res.data?.user)
        setPageData(res.data?.loved)
        seIsLoadingData(false)
      }).catch(error => console.log(handleClientError(error)))
  }, [user, apiCaller])

  // if (isLoadingData) { return <Loader2 className="mr-2 size-6 animate-spin" /> }
  return (
    <FallbackToLoginLayout>
      <div className="mx-auto mt-6 min-h-screen  flex flex-col gap-[32px] md:mt-[199px] h-fit w-full max-w-[821px]   px-[20px] md:w-[821px] md:px-0 mb-[104px]">
        {
          isLoadingData ? <Loader2 className="mr-2 size-6 animate-spin text-center" /> : <>
            <h1 className="text-[25px] font-bold leading-[30px] text-[#650031]">
              Welcome Back, {userDetails?.first_name}
            </h1>
            {pageData && pageData?.length > 0 ? pageData.map(i => <PageDetaisl item={i} key={i._id} />) : <PageDetaisl item={{}} />}
          </>}

      </div>
    </FallbackToLoginLayout>
  );
}
