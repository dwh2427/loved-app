'use client'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useApiCaller from "@/hooks/useApiCaller"
import useClientError from "@/hooks/useClientError"
import { Loader2 } from "lucide-react"
// import { Loader2 } from "lucide"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
const AddStory = () => {
    const [pageId, setPageId] = useState('')
    const [story, setStory] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const apiCaller = useApiCaller()
    const handleClientError = useClientError()
    const router = useRouter()

    const handleAddStory = async () => {
        try {
            if (!story) {
                return toast({ variant: 'destructive', title: 'Please type your story' })
            }
            setIsAdding(true)
            await apiCaller.put('/add-story/api', { pageId, story })

            router.push(`/create-loved`)
        } catch (error) {
            handleClientError(error)
        } finally { setIsAdding(false) }
    }

    useEffect(() => {
        const pageId = window !== undefined && localStorage.getItem('pageId')
        setPageId(pageId)
    }, [])

    return <div className="flex flex-col items-center ">
        <textarea type={'text'} value={story} onChange={(e) => setStory(e.target.value)} className="w-[400px] mb-[86px] h-[109px] p-[16px] border-black border rounded-md border-1" ></textarea>
        <Button

            onClick={handleAddStory}
            variant={"default"}
            //   disabled={loading}
            className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[16px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
            {isAdding && <Loader2 className="mr-2 size-6 animate-spin" />}
            Continue
        </Button>
    </div>

}
export default AddStory