"use client"
import ProfileDropdown from "@/components/button/profile-dropdown";
import PublictFooter from "@/components/footer/PublicFooter";
import { Badge } from "@/components/ui/badge";
import useAuthState from "@/hooks/useAuthState";
import addPhoto from '@/public/add-photo.png';
import Logo3 from "@/public/logo3.svg";
import man_woman_photo from '@/public/man-woman.png';
import threeDot from '@/public/three-dot.png';
import women from '@/public/women.png';
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditCustomPageLink from "../../components/button/editCustomPageLink";

const base_URL = process.env.NEXT_PUBLIC_BASE_URL
export default function PrivatePage() {
  const { user } = useAuthState()
  const [userDetails, setUserDetails] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const prevusername = searchParams.get('username')
  const [username, setUsername] = useState(prevusername)
  const handlePageLinkEdit = async (newValue) => {
    try {
      setIsUpdating(true)
      const res = await axios.put('/create-loved/api', { username: newValue, uid: user?.uid })
      if (res.data) {
        res?.data?.data && setUsername(res?.data?.data.username)
        alert(res.data.message)
      }
    } catch (error) {
      console.log(error)
    } finally { setIsUpdating(false) }
  }

  function copyToClipboard(text) {
    // Check if the browser supports the Clipboard API
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }

    // Copy text to clipboard
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Link copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
  }

  useEffect(() => {
    if (!user?.uid) return
    axios.get(`/private-page/api?uid=${user?.uid}`).then(data => setUserDetails(data.data)).catch(error => console.log(error))
  }, [user])


  useEffect(() => {
    if (!router.query?.username) return
    setUsername(router.query?.username)
  }, [router.query])
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

        <div className="  w-full max-w-[450px]">
          <p className="text-[18px] font-black leading-[22px] text-[#650031]">
            Page Link
          </p>
          <p className="text-[16px] leading-[19.2px] text-[#A2AEBA]">
            Raise money for charities and personal causes
          </p>
          <div className="mt-[16px] flex flex-col md:flex-row items-start md:items-center md:h-[49px] justify-between border-b pb-2 md:pb-0 border-[#E9E9E9]">
            <div className="mb-2 md:mb-0">
              <p className="text-[16px] font-medium leading-[19.2px] mb-1 md:mb-0">
                {base_URL}{username} <EditCustomPageLink isUpdating={isUpdating} handleSubmit={handlePageLinkEdit} value={`${username}`} />
              </p>
              <Link href={`/${username}`} target="_blank" className="text-[12px] font-bold leading-[14.4px] text-[#FE5487]">
                Preview Page
              </Link>
            </div>
            <button onClick={() => copyToClipboard(`${base_URL}/${username}`)}  >
              <Badge variant="outline" className="border-[#FE5487] text-[16px] font-medium leading-[19.2px] text-[#FE5487]">
                Share Page Link
              </Badge>
            </button>
          </div>

          {/* <div className="mt-[16px] h-[35px] border-b border-[#E9E9E9]">
            Create new page
          </div> */}


        </div>

        <div className="md:max-h-[254px]">
          <h3 className="font-[900] size-[18px] leading-[22px] mb-[16px] text-[#650031]">Moments</h3>
          <div className="flex flex-col md:flex-row gap-[16px]">
            <div className="relative w-full md:w-[216px]">
              <Image src={man_woman_photo} alt="" className=" size-full md:size-[216px] border border-[1px] border-[#650031] rounded-[8px]" />
              <button><Image src={threeDot} alt="" className="size-[20px] absolute top-[11px] right-[6px]" /></button>
            </div>

            <div className="flex gap-[16px]">
              <Image src={women} alt="" className="size-[100px] rounded-[8px]" />
              <Image src={addPhoto} alt="" className="size-[100px] rounded-[8px]" />
            </div>
          </div>
        </div>
      </div>

      <PublictFooter />
    </>
  );
}
