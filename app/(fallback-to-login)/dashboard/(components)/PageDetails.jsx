/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import EditCustomPageLink from "@/components/button/editCustomPageLink";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/firebase/config";
import useApiCaller from "@/hooks/useApiCaller";
import useClientError from "@/hooks/useClientError";
import copyToClipboard from "@/lib/copyToClipboard";
import addPhoto from '@/public/add-photo.png';
import axios from "axios";
import { Loader2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
const base_URL = process.env.NEXT_PUBLIC_BASE_URL
const PageDetaisl = ({ item }) => {
    const [pageData, setPageData] = useState(item)
    const [isUpdating, setIsUpdating] = useState(false)
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false)
    const apiCaller = useApiCaller()
    const handleClientError = useClientError()
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


    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setIsUploading(true)
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('pageId', pageData?._id);

            try {
                const { data } = await axios.post('/dashboard/api/image-upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${await auth.currentUser.getIdToken()}`
                    },

                });

                setPageData(data.data)
            } catch (error) {
                handleClientError(error)
            } finally { setIsUploading(false) }
        }
    };


    return (<div className="pb-6 border-b border-1 border-gray-300">
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
                    {
                        pageData && pageData?.images?.slice(1, pageData.images.length).map((i, ind) =>
                            <Image
                                key={ind} src={i}
                                alt="" width={100}
                                height={100}
                                className="size-[100px] rounded-[8px]" />)}
                </div>

                <div className="flex flex-wrap gap-[16px]">
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
                    <label htmlFor={`${pageData && pageData._id}`} className={`${pageData && 'cursor-pointer'} block relative`}>
                        {isUploading && ( // Conditionally render the overlay when uploading
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
                                {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
                            </div>
                        )}
                        <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md" />
                    </label>
                </div>
            </div>
        </div>
    </div>)
}

export default PageDetaisl