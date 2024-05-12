"use client";

import TextInputField from "@/components/form-fields/text-input-field";
import { Button } from "@/components/ui/button";
import {
    Form
} from "@/components/ui/form";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    date_of_birth: z.string(),
    city: z.string().min(1, {
        message: "City is required",
    }),
    state: z.string().min(1, {
        message: "State is required",
    }),
    postal_code: z.string().min(4, {
        message: "Postal code is required",
    }),
    phone: z.string().min(9).max(11),
    goal: z.string().min(1),
    street_address: z.string().min(1),
});

export default function AdditionalDetailsForm() {
    const [loading, setLoading] = useState("");
    const handleClientError = useClientError()
    const { user } = useAuthState()
    const router = useRouter();
    const apiCaller = useApiCaller()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_of_birth: "",
            city: "",
            street_address: "",
            state: "",
            postal_code: "",
            phone: "",
            goal: "",
        },
    });

    const handleSubmit = async () => {
        setLoading(true);
        const pageId = localStorage.getItem('pageId')
        try {
            if (user) {
                const formdata = form.getValues()
                const data = { ...formdata, pageId }
                const res = await apiCaller.post('/api/api/stripe', data)
                router.push('/add-photo')

            }
        } catch (error) {
            handleClientError(error)
        } finally { setLoading(false) }

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
            >

                <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
                    Where will the contributions go to?
                </h3>

                <div className="mx-auto w-full  md:mt-[16px] flex flex-col  md:max-w-[385px] gap-[16px]">
                    <TextInputField
                        control={form.control}
                        name="goal"
                        label="Goal"
                        placeholder="Enter goal" />

                    <TextInputField
                        control={form.control}
                        name="phone"
                        type="number"
                        label="Phone"
                        placeholder="Enter phone" />


                    <TextInputField
                        control={form.control}
                        name="street_address"
                        label="Street Address"
                        placeholder="Enter street address" />

                    <div className="flex gap-[16px]">
                        <TextInputField
                            control={form.control}
                            name="city"
                            label="City"
                            placeholder="Enter city" />

                        <TextInputField
                            control={form.control}
                            name="state"
                            label="State"
                            placeholder="Enter state" />
                    </div>

                    <div className="flex gap-[16px]">
                        <TextInputField
                            control={form.control}
                            name="postal_code"
                            label="Postal Code"
                            type="number"
                            placeholder="Enter postal code" />

                        <TextInputField
                            control={form.control}
                            name="date_of_birth"
                            type="date"
                            label="Date Of Birth"
                            placeholder="Select date of birth" />
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant={"default"}
                    disabled={loading}
                    className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[86px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
                >
                    {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
                    Continue
                </Button>
            </form>
        </Form >
    );
}
