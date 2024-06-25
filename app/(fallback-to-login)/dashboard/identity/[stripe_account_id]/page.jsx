"use client"
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/firebase/config";
import useApiCaller from "@/hooks/useApiCaller";
import useClientError from "@/hooks/useClientError";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function IdentityVerifyForm({ params }) {
    const stripe_account_id = params?.stripe_account_id
    const [frontSideImg, setFrontSideImg] = useState(null);
    const [backSideImg, setBackSideImg] = useState(null);
    const [frontSideImgFile, setFrontSideImgFile] = useState(null);
    const [backSideImgFile, setBackSideImgFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false)
    const handleFrontSideImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFrontSideImgFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setFrontSideImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackSideImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBackSideImgFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackSideImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const router = useRouter()
    const handleClientError = useClientError()
    const apiCaller = useApiCaller()
    const handleSubmit = async () => {
        try {
            const formData = new FormData()
            if (stripe_account_id === 'undefined') {
                return toast({
                    variant: "destructive",
                    title: 'could not found stripe account id',
                });
            }
            formData.append('front_side_image', frontSideImgFile)
            formData.append('back_side_image', backSideImgFile)
            formData.append('stripe_account_id', stripe_account_id)
            setIsUpdating(true)
            const result = await apiCaller.post('/dashboard/identity/api', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
                },
            },)

            router.push(`/dashboard/bank-details/${stripe_account_id}`)
        } catch (error) {
            handleClientError(error)
        }finally{setIsUpdating(false)}
    }

    useEffect(() => {
        apiCaller.get(`/dashboard/identity/api/verify_page_by_stripe_id?stripe_account_id=${stripe_account_id}`).then(res => {
            console.log(res)
            const document = res?.data?.account?.individual?.verification?.document
            const isDocumentsExist = document?.back && document?.front
            const isBankAdded = res?.data?.account?.external_accounts?.total_count > 0
       
            if (isDocumentsExist && isBankAdded) return router.push(`/dashboard/withdraw/${stripe_account_id}`)
            if (isDocumentsExist) router.push(`/dashboard/bank-details/${stripe_account_id}`)
        }).catch(err => {   router.push("/not_found/__"); })
    }, [apiCaller, router, stripe_account_id])
    return (
        <div className="mx-auto mt-6 flex flex-col justify-center items-center gap-[32px] md:mt-[99px] h-fit w-full max-w-[821px] px-[20px] md:w-[821px] md:px-0 mb-[104px]">
            <div className="flex flex-col justify-center items-center">
                <h2 className='text-3xl font-semibold pb-2'>We need to verify your identity</h2>
                <p>Please upload your Government ID</p>
            </div>
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="front-side-file"
                type="file"
                onChange={handleFrontSideImageUpload}
            />
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="back-side-file"
                type="file"
                onChange={handleBackSideImageUpload}
            />

            <div className='identity-field flex gap-5'>
                <label className="block w-[200px] h-[200px] border border-gray-300 rounded-md p-2 overflow-hidden" htmlFor="front-side-file">
                    {frontSideImg && <Image src={frontSideImg} alt="Uploaded" width={200} height={150} />}
                </label>
                <label className="block w-[200px] h-[200px] border border-gray-300 rounded-md p-2 overflow-hidden" htmlFor="back-side-file">
                    {backSideImg && <Image src={backSideImg} alt="Uploaded" width={200} height={150} />}
                </label>
            </div>
            <Button
                onClick={handleSubmit}
                variant={"default"}
                disabled={isUpdating}
                // onClick={checkFormErrors}
                className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[50px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
            >
                {isUpdating && <Loader2 className="mr-2 size-6 animate-spin" />}
                Confirm
            </Button>
        </div>
    )
}
