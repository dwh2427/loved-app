/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Button } from '@/components/ui/button';
import addPhoto from '@/public/add-photo.png';
import man_woman_photo from '@/public/man-woman.png';
import threeDot from '@/public/three-dot.png';

import Image from "next/image";
const AddPhoto = () => {
    return <div className="md:max-h-[254px]">
        <div className="flex flex-col md:flex-row gap-[16px]">
            <div className="relative w-full md:w-[216px]">
                <Image src={man_woman_photo} alt="" width={216} height={216} className=" size-full md:size-[216px] border border-[1px] border-[#650031] rounded-[8px]" />
                <button><Image src={threeDot} alt="" className="size-[20px] absolute top-[11px] right-[6px]" /></button>
            </div>

            <div className="grid grid-rows-2 grid-cols-3 gap-[16px]">

                <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md " />
                <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md" />


                {/* {pageData?.images?.length > 1 ?
                        pageData.images.slice(1, pageData.images.length).map((i, ind) => <Image key={ind} src={i} alt="" width={100} height={100} className="size-[100px] rounded-[8px]" />) :
                        <Image src={women} alt="" width={100} height={100} className="size-[100px] rounded-[8px]" />} */}
                <input
                    type="file"
                    id={'pageData._id'}
                    style={{ display: 'none' }}
                // onChange={handleFileChange}
                />

                {/* Image */}
                <label htmlFor={`${'pageData._id'}`} className={`${'cursor-pointer'} block relative`}>
                    {/* <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
                        <p className="text-lg font-semibold">Uploading...</p> 
                    </div> */}
                    <Image src={addPhoto} alt="" width={100} height={100} className="rounded-md" />
                </label>

                {/* Overlay with loading message */}
                {/* {isUploading && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex justify-center items-center z-10">
                            <p className="text-lg font-semibold">{'Uploading...'}</p>
                        </div>
                    )} */}
            </div>
        </div>
        <Button
            type="submit"
            variant={"default"}
            // disabled={loading}
            className="mx-auto h-[102.71px] text-center w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[16px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
            {/* {loading && <Loader2 className="mr-2 size-6 animate-spin" />} */}
            Sign up
        </Button>
    </div>

}

export default AddPhoto