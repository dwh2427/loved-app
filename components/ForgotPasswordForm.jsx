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
import { Button } from "./ui/button";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

const formSchema = z.object({
  emailAddress: z.string().email({
    message: "Please provide a valid email address",
  }),
});

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const handleSubmit = async () => {
    try {
      const { emailAddress } = form.getValues();

      await sendPasswordResetEmail(auth, emailAddress);
      form.reset();

      alert(
        "A password reset email has been sent to the provided email address, if it exists in our database.",
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto flex max-w-[767px] flex-col items-center justify-between p-[41.42px]"
      >
        <h2 className="mx-auto max-h-[38px] w-full max-w-[582.53px] whitespace-nowrap text-center text-[32.36px] font-medium leading-[37.54px] tracking-[0.01em] text-black md:h-[40px] md:w-[263px] md:text-[40px] md:leading-[40px]">
          Forgot password
        </h2>
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem className="mt-[41.42px] h-[173.06px] w-[689.17px] space-y-[5.18px] md:h-[88px] md:w-[385px] md:space-y-[8px]">
              <FormLabel className="h-[30px] w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="@.com"
                  className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[385px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:font-normal md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-[53px] md:placeholder:text-center md:placeholder:text-[18px] md:placeholder:font-normal md:placeholder:leading-[20px]"
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
          className="absolute bottom-[41.89px] mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
          Send Password Reset Email
        </Button>
      </form>
    </Form>
  );
}
