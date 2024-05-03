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
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  emailAddress: z.string().email({
    message: "Please provide a valid email address",
  }),
  password: z.string().min(3, {
    message: "Please enter your password.",
  }),
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [loading, setLoading] = useState(false);
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
      const { emailAddress, password } = form.getValues();
      const res = await signInWithEmailAndPassword(emailAddress, password);

      if (!res) {
        alert("Incorrect email address or password. Please try again.");
        return;
      }

      sessionStorage.setItem("user", true);
      form.reset();
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[16px]"
      >
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:h-auto md:w-[385px] md:space-y-[8px]">
              <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:h-auto md:w-[385px] md:space-y-[8px]">
              <FormLabel className="h-[30px] w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] md:h-[44px] md:w-[385px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:font-normal md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-[53px] md:placeholder:text-center md:placeholder:text-[18px] md:placeholder:font-normal md:placeholder:leading-[20px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          href="/forgot-password"
          className="mx-auto h-[30px] w-full max-w-[689.17px] self-start text-[25.88px] font-bold leading-[29.12px] md:h-[14px] md:w-[386px] md:text-[12px] md:leading-[14.4px]"
        >
          Forgot Password?
        </Link>
        <p className="w-full max-w-[689.17px] text-[25.88px] leading-[29.12px] md:mx-auto md:h-[28px] md:w-[386px] md:text-[12px] md:leading-[14.4px]">
          By clicking the Sign In button below, you agree to the Loved{" "}
          <span className="border-b-[0.5px] border-black">
            Terms of Service
          </span>
          and acknowledge the{" "}
          <span className="border-b-[0.5px] border-black">Privacy Notice</span>.
        </p>
        <p className="mx-auto h-[30px] w-full max-w-[689.17px] self-start text-[25.88px] leading-[29.12px] md:hidden">
          Don&apos;t have an account?{" "}
          <Link href={"/getting-started"} className="font-bold">
            Sign up
          </Link>
        </p>
        <Button
          type="submit"
          disabled={loading}
          variant={"default"}
          className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
          Sign in
        </Button>
        <p className="mx-auto hidden h-[30px] w-full max-w-[689.17px] self-start text-[25.88px] leading-[29.12px] md:block md:h-[14px] md:w-[386px] md:text-[12px] md:leading-[14.4px]">
          Don&apos;t have an account?{" "}
          <Link href={"/getting-started"} className="font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
