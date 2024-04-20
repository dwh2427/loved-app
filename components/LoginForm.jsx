"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  emailAddress: z.string().email({
    message: "Please provide a valid email address",
  }),
  password: z.string().min(3, {
    message: "Please enter your password.",
  }),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const handleSubmit = (values) => {
    console.log({ values });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-center gap-y-[41.41px] mt-[41.41px]"
      >
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem className='w-full px-5'>
              <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black">
                Email Address
              </FormLabel>
              <Input
                placeholder="@.com"
                className="h-[75%] max-h-[102.71px] w-full max-w-[689.17px] rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px]"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className='w-full px-5'>
              <FormLabel className="h-[30px] w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black">
                Password
              </FormLabel>
              <Input
                placeholder="@.com"
                className="h-[75%] max-h-[102.71px] w-full max-w-[689.17px] rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px]"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
