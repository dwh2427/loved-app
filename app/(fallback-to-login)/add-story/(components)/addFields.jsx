'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"
const AddStory = () => {
    const [story, setStory] = useState('')

    return <div className="flex flex-col items-center ">
        <textarea type={'text'} className="w-[400px] mb-[86px] h-[109px] p-[16px] border-black border rounded-md border-1" ></textarea>
        <Button
            type="submit"
            variant={"default"}
            //   disabled={loading}
            className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[16px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
            {/* {loading && <Loader2 className="mr-2 size-6 animate-spin" />} */}
            Sign up
        </Button>
    </div>

}
export default AddStory