/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import ProfileDropdown from "@/components/button/profile-dropdown";
import PublictFooter from "@/components/footer/PublicFooter";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import useConvertHeicFile from "@/hooks/useConvertHeicFIle";
import copyToClipboard from "@/lib/copyToClipboard";
import addPhoto from '@/public/add-photo.png';
import Logo3 from "@/public/logo3.svg";
import man_woman_photo from '@/public/man-woman.png';
import threeDot from '@/public/three-dot.png';
import women from '@/public/women.png';
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import EditCustomPageLink from "../../components/button/editCustomPageLink";
const base_URL = process.env.NEXT_PUBLIC_BASE_URL
export default function PrivatePage() {
  const { user } = useAuthState()
  const [userDetails, setUserDetails] = useState('')
  const [isCovertingFile, setIsConvertingFile] = useState(false)
  const [pageData, setPageData] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const prevusername = searchParams.get('username')
  const [username, setUsername] = useState(prevusername)
  const [file, setFile] = useState(null);
  const handleClientError = useClientError()
  const [isUploading, setIsUploading] = useState(false)
  const pathname = usePathname()
  const convertHeicToJpeg = useConvertHeicFile()
  const apiCaller = useApiCaller()
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )


  const handlePageLinkEdit = async (newValue) => {

    try {
      setIsUpdating(true)
      const res = await axios.put(`/private-page/api`, { newUsername: newValue, username: pageData.username, uid: user?.uid, })
      if (res?.data?.data) {
        setUsername(res?.data?.data.username)
        router.push(pathname + '?' + createQueryString('username', res?.data?.data.username))
      }
      toast({
        variant: "success",
        title: res.data.message,
      });


    } catch (error) {
      handleClientError(error)
    } finally { setIsUpdating(false) }
  }


  useEffect(() => {
    if (!user?.uid) return
    apiCaller.get(`/private-page/api?username=${username}`)
      .then(res => {
        // console.log(res.data)
        setUserDetails(res.data?.user)
        setPageData(res.data?.loved)
      }).catch(error => console.log(handleClientError(error)))
  }, [user, username, apiCaller])


  useEffect(() => {
    if (!router.query?.username) return
    setUsername(router.query?.username)
  }, [router.query])




  const handleFileChange = async (event) => {

    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setIsUploading(true)
      const formData = new FormData();
      // let file = selectedFile
      // if (selectedFile.name.slice(((selectedFile.name.lastIndexOf('.') - 1) >>> 0) + 2) === 'HEIC') {
      //   setIsConvertingFile(true)
      //   file = await convertHeicToJpeg(file)
      //   setIsConvertingFile(false)
      // }

      formData.append('file', selectedFile);
      formData.append('username', username);
      formData.append('uid', user?.uid);

      try {
        const response = await axios.post('/private-page/api/image-upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response?.data?.data) { setPageData(response.data.data) } else { alert(response?.response?.data.message) }
      } catch (error) {
        handleClientError(error)
      } finally { setIsUploading(false) }
    }
  };


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
                {base_URL}{pageData?.username} {pageData && <EditCustomPageLink isUpdating={isUpdating} handleSubmit={handlePageLinkEdit} value={`${pageData?.username}`} />}
              </p>
              <Link href={`/${pageData?.username}`} target="_blank" className="text-[12px] font-bold leading-[14.4px] text-[#FE5487]">
                Preview Page
              </Link>
            </div>
            <button onClick={() => copyToClipboard(`${base_URL}/${username}`)}  >
              <Badge variant="outline" className="border-[#FE5487] text-[16px] font-medium leading-[19.2px] text-[#FE5487]">
                Share Page Link
              </Badge>
            </button>
          </div>

          <Link className="mt-[16px] block h-[35px] border-b border-[#E9E9E9]" href={'/getting-started'} >
            Create new page
          </Link>


        </div>

        <div className="md:max-h-[254px]">
          <h3 className="font-[900] size-[18px] leading-[22px] mb-[16px] text-[#650031]">Moments</h3>
          <div className="flex flex-col md:flex-row gap-[16px]">
            <div className="relative w-full md:w-[216px]">
              <Image src={pageData?.images && pageData.images[0] || man_woman_photo} alt="" width={216} height={216} className=" size-full md:size-[216px] border border-[1px] border-[#650031] rounded-[8px]" />
              <button><Image src={threeDot} alt="" className="size-[20px] absolute top-[11px] right-[6px]" /></button>
            </div>

            <div className="flex gap-[16px]">
              {pageData?.images?.length > 1 ?
                pageData.images.slice(1, pageData.images.length).map((i, ind) => <Image key={ind} src={i} alt="" width={100} height={100} className="size-[100px] rounded-[8px]" />) :
                <Image src={women} alt="" width={100} height={100} className="size-[100px] rounded-[8px]" />}
              <input
                type="file"
                id="fileInput"

                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Image */}
              <label htmlFor={`${pageData && 'fileInput'}`} className={`${pageData && 'cursor-pointer'} block`}>
                <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md" />
              </label>

              {/* Overlay with loading message */}
              {isUploading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex justify-center items-center z-10">
                  <p className="text-lg font-semibold">{isCovertingFile ? 'Converting...' : 'Uploading...'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <PublictFooter />
    </>
  );
}
