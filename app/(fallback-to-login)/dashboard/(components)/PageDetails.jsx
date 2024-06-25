/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import EditCustomPageLink from "@/components/button/editCustomPageLink";
import { Badge } from "@/components/ui/badge";
import Popup from "@/components/ui/popup";
import { toast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
import useClientError from "@/hooks/useClientError";
import copyToClipboard from "@/lib/copyToClipboard";
import addPhoto from '@/public/add-photo.png';
import threeDot from '@/public/three-dot.png';
import { Loader2 } from "lucide-react";

import useImageUpload from "@/hooks/useImageUpload";
import { countWords, getFirstWords } from "@/lib/countWord";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CropEasy from "../../add-photo/(components)/crop-images";
const base_URL = process.env.NEXT_PUBLIC_BASE_URL
const PageDetaisl = ({ item }) => {
    const [pageData, setPageData] = useState(item)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showFullStory, setShowFullSotry] = useState(false)
    const apiCaller = useApiCaller()
    const handleClientError = useClientError()

    const {
        imageUrl,
        handleFileChange,
        handleFileUpload,
        isCropping,
        setImageUrl,
        isUploading,
        setIsCropping
    } = useImageUpload(pageData, setPageData)

    useEffect(() => { setPageData(item) }, [item])
    const handlePageLinkEdit = async (newValue) => {
        try {
            setIsUpdating(true)
            const res = await apiCaller.put(`/dashboard/api`, { newUsername: newValue, _id: pageData._id, })
            setPageData(res.data?.data)
            toast({
                variant: "success",
                title: res.data.message,
            });
        } catch (error) {
            handleClientError(error)
        } finally { setIsUpdating(false) }
    }


    return (
        <div className="pb-6 border-b border-1 border-gray-300">
            <div className="  w-full max-w-[450px]">
                <p className="text-[18px] font-black leading-[22px] text-[#650031] capitalize">
                    {pageData.first_name} {pageData.last_name}
                </p>
                <p>${pageData?.balance?.available[0]?.amount} <Link href={`/dashboard/identity/${pageData?.stripe_acc_id}`} className="text-[#FE5487]">Withdraw</Link></p>
                <p className="text-[16px] leading-[19.2px] text-[#A2AEBA]">
                    {showFullStory ? pageData?.story : getFirstWords(pageData?.story, 20)}
                    {
                        countWords(pageData?.story) > 20 && <button className="block text-black" onClick={() => setShowFullSotry(p => !p)}>{showFullStory ? 'See less' : 'See more'}</button>}
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
                    <button onClick={() => copyToClipboard(`${base_URL}${pageData?.username}`)}  >
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
                    {pageData?.images?.length > 0 && <div className="relative w-full md:w-[216px]">
                        <Image src={pageData?.images[0]} alt="" width={216} height={216} className=" size-full md:size-[216px] border border-[1px] border-[#650031] rounded-[8px]" />
                        <button><Image src={threeDot} alt="" className="size-[20px] absolute top-[11px] right-[6px]" /></button>
                    </div>}

                    <div className="grid grid-rows-2 grid-cols-3 gap-[16px]">
                        {
                            pageData?.images?.slice(1, pageData.images.length).map((i, ind) => <Image key={ind} src={i} alt="" width={100} height={100} className="size-[100px] rounded-[8px]" />)
                        }
                        <input
                            type="file"
                            id={pageData._id}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        {/* Image */}
                        <label htmlFor={`${pageData && pageData._id}`} className={`${pageData && 'cursor-pointer'} z-0 block relative`}>
                            <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md" />
                            {<div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
                                {isUploading && <Loader2 className="mr-2 size-6 animate-spin" />}
                            </div>}
                        </label>
                    </div>
                </div>
            </div>

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
    )
}

export default PageDetaisl