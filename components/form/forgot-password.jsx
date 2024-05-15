"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  emailAddress: z.string().email({
    message: "Please provide a valid email address",
  }),
});

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { emailAddress } = form.getValues();

      await sendPasswordResetEmail(auth, emailAddress);
      form.reset();

      toast({
        variant: "destructive",
        title:
          "A password reset email has been sent to the provided email address, if it exists in our database.",
      });
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto flex max-w-[767px] flex-col items-center justify-between p-[41.42px] md:mt-[22px] md:p-16"
      >
        <h2 className="mx-auto max-h-[38px] w-full max-w-[582.53px] whitespace-nowrap text-center text-[32.36px] font-medium leading-[37.54px] tracking-[0.01em] md:max-h-[20px] md:w-[402px] md:text-[18px] md:leading-[20px] md:text-[#004318]">
          Forgot password
        </h2>
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem className="mt-[41.42px] h-auto w-[689.17px] space-y-[5.18px] md:mt-[16px] md:h-auto md:w-[385px] md:space-y-[8px]">
              <FormLabel className="h-[30px] w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:min-h-[14px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="@.com"
                  className="md:placeholder:h-[20px]md:placeholder:text-center h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[385px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:font-normal md:leading-[20px] md:placeholder:text-[18px] md:placeholder:font-normal md:placeholder:leading-[20px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"default"}
          disabled={loading}
          className="absolute bottom-[41.89px] mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:static md:mt-[16px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
          {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
          Send Password Reset Email
        </Button>
      </form>
    </Form>
  );
}
