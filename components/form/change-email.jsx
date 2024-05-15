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
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react";
import { auth } from "@/firebase/config";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    newEmail: z.string().email({
      message: "Please provide a valid email address",
    }),
    confirmNewEmail: z.string(),
  })
  .refine((data) => data.confirmNewEmail === data.newEmail, {
    message: "These emails do not match",
    path: ["confirmNewEmail"],
  });

export default function ChangeEmailForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: "",
      confirmNewEmail: "",
    },
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { newEmail } = form.getValues();

      const isVerified = await verifyBeforeUpdateEmail(
        auth.currentUser,
        newEmail,
      );

      if (!isVerified) {
        setLoading(false)
        toast({
          variant: "success",
          title: "Please check your inbox on your new email address.",
        });
        router.back();
      }
    } catch (e) {
      console.error(e);
      setLoading(false); 
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:mt-[16px] md:gap-y-[16px]"
      >
        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:h-auto md:w-[386px] md:space-y-[8px]">
              <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:max-h-[14px] md:max-w-[57px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                New email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="@.com"
                  className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[386px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:font-normal md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-[53px] md:placeholder:text-center md:placeholder:text-[18px] md:placeholder:font-normal md:placeholder:leading-[20px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewEmail"
          render={({ field }) => (
            <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:h-auto md:w-[386px] md:space-y-[8px]">
              <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:max-h-[14px] md:max-w-[57px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                Confirm new email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="@.com"
                  className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[386px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:font-normal md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-[53px] md:placeholder:text-center md:placeholder:text-[18px] md:placeholder:font-normal md:placeholder:leading-[20px]"
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
          className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
          {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
          Confirm
        </Button>
      </form>
    </Form>
  );
}
