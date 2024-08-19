"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

// Import Twilio dependencies

// Initialize Twilio with credentials from environment variables

const formSchema = z.object({
  phone: z.string().min(1, { message: "Please provide a phone number" }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  const handleSubmit = async () => {  // Declare function as async
    try { 
      setLoading(true);
      const { phone } = form.getValues();
      localStorage.setItem('phone', phone);
      // Wait for the axios post request to resolve
      const response = await axios.post('/login/api', { phone });
      // Check the response status
      if (response.status === 200) {
        router.push('/login/verify-otp');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (e) {
      console.error('Error sending OTP:', e);
      toast({
        variant: "destructive",
        title: "Error sending OTP",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }
  
    

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[16px]"
      >
        <div className="space-y-41.41px md:mt-16px md:max-w-385px mx-auto w-full md:flex md:space-y-0">
          <FormField
            control={form.control}
            name={"phone"}
            render={({ field: { ref, ...field } }) => (
              <FormItem className="h-173.06px max-w-[395px] space-y-8px md:w-188px md:space-y-8px mx-auto w-full md:h-auto">
                <FormControl>
                <PhoneInput
                    country={'au'}
                    inputStyle={{
                      width: "calc(100% - 20px)", // Adjust width considering the button width
                      height: "50px",
                      borderRadius: "32px",
                      paddingLeft: "70px", // Ensure text does not overlap with button
                    }}
                    buttonStyle={{
                      width: "70px", // Set the width for the code holder
                      borderTopLeftRadius: "32px",
                      borderBottomLeftRadius: "32px",
                      position: "absolute", // Position button absolutely to prevent overlap
                      zIndex: 1, // Ensure button appears above the input
                    }}
                    containerStyle={{
                      position: "relative", // Set container to relative to position button properly
                    }}
                    className="phone-input-custom mt-[8px] w-full"
                    placeholder="Phone Number"
                    {...field}
                    inputExtraProps={{
                      ref,
                      required: true,
                      autoFocus: true,
                    }}
                  />

                </FormControl>
                <FormMessage className="whitespace-nowrap" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant={"default"}
          className="mx-auto h-[58px] w-full max-w-[625.75px] text-base font-semibold rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:leading-[22px]"
        >
          {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
          Continue
        </Button>
      </form>
    </Form>
  );
}
