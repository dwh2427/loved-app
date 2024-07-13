/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Button } from '@/components/ui/button';
import Popup from '@/components/ui/popup';
import useApiCaller from '@/hooks/useApiCaller';
import useAuthState from '@/hooks/useAuthState';
import useClientError from '@/hooks/useClientError';
import useImageUpload from '@/hooks/useImageUpload';
import addPhoto from '@/public/add-photo.png';
import threeDot from '@/public/three-dot.png';
import { Loader2 } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CropEasy from './crop-images';
const AddPhoto = () => {
  const { user, loading } = useAuthState()
  const apiCaller = useApiCaller()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [pageData, setPageData] = useState(null)
  const handleClientError = useClientError()
  const router = useRouter()
  const [isContinue, setIsContinue] = useState(false)

  const {
    imageUrl,
    handleFileChange,
    handleFileUpload,
    isCropping,
    setImageUrl,
    isUploading,
    setIsCropping
  } = useImageUpload(pageData, setPageData)


  useEffect(() => {
    if (!loading && !user) router.push('/login')
    const pagId = window !== undefined && localStorage.getItem('pageId')
    if (user) {
      apiCaller.get(`/add-photo/api?pageId=${pagId}`).
        then(data => setPageData(data.data))
        .catch((error) => handleClientError(error))
        .finally(() => setIsDataLoading(false))
    }

  }, [user, loading])

  if (isDataLoading) { return 'Loading ...' }

  return <div className=" flex flex-col items-center">
    <div className="flex flex-col md:flex-row gap-[16px]">
      {pageData?.images.length > 0 && <div className="relative w-full md:w-[216px]">
        <Image src={pageData?.images[0]} alt="" width={216} height={216} className=" size-full md:size-[216px] border border-[#650031] rounded-[8px]" />
        <button><Image src={threeDot} alt="" className="size-[20px] absolute top-[11px] right-[6px]" /></button>
      </div>}

      <div className="grid grid-rows-2 grid-cols-3 gap-[16px]">
        {
          pageData && pageData?.images?.slice(1, pageData.images.length).map((i, ind) =>
            <Image
              key={ind} src={i}
              alt="" width={100}
              height={100}
              className="size-[100px] rounded-[8px] border border-[#650031]"
            />)
        }
        <input
          type="file"
          id={'pageData._id'}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Image */}
        <label htmlFor={`${'pageData._id'}`} className={`${'cursor-pointer'} block relative`}>
          {isUploading && <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
            {isUploading && <Loader2 className="mr-2 size-6 animate-spin" />}
          </div>}
          <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md" />
        </label>
      </div>
    </div>
    <Button
      onClick={() => { setIsContinue(true); router.push(`/add-story`) }}
      variant={"default"}
      // disabled={loading}
      className=" h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[16px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
    >
      {isContinue && <Loader2 className="mr-2 size-6 animate-spin" />}
      Continue
    </Button>


    {/* modals  */}
    <Popup isOpen={isCropping} closeModal={() => setIsCropping(false)}>
      <div >
        <CropEasy photoURL={imageUrl}
          setOpenCrop={setIsCropping}
          setPhotoURL={setImageUrl}
          handlImageUpload={handleFileUpload}
        />
      </div>
    </Popup>
  </div>

}

export default AddPhoto