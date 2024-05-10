"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/firebase/config";
import useClientError from "@/hooks/useClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  emailAddress: z.string().email({
    message: "Please provide a valid email address",
  }),
  password: z
    .string()
    .min(6, {
      message:
        "Password must contain atleast 6 characters including a number and special character",
    })
    .refine(
      (password) => {
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const numberRegex = /[0-9]/;

        return specialCharRegex.test(password) && numberRegex.test(password);
      },
      {
        message:
          "Password must contain atleast 6 characters including a number and special character",
      },
    ),
});

export default function SignUpForm() {
  const { toast } = useToast();
  const handleClientError = useClientError()
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName:
        typeof window !== "undefined"
          ? window.localStorage.getItem("firstName") || ""
          : "",
      lastName:
        typeof window !== "undefined"
          ? window.localStorage.getItem("lastName") || ""
          : "",
      emailAddress: "",
      password: "",
    },
  });

  const handleCreatePage = async (params) => {
    try {
      const { family_member_type, last_name, first_name, pageFor, } = params
      const username = `${first_name.split(' ')[0]}${Math.ceil(Math.random() * 235)}`
      const newPageData = { family_member_type, last_name, first_name, pageFor, username }
      const { data } = await apiCaller.put('/dashboard/api', newPageData)
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("familyMemberType");
      localStorage.removeItem("pageFor");


    } catch (error) {
      handleClientError(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { emailAddress, password, firstName, lastName } = form.getValues();
      const res = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password,
      )
        .then()
        .catch((error) => {
          console.log(error.code);
          if (error.code === "auth/email-already-in-use") {
            toast({
              variant: "destructive",
              title: "Email already exists!",
            });
            setLoading(false);
            form.reset();
          }
        });

      if (res?.user) {
        const userId = res.user.uid;
        const userData = {
          uid: userId,
          first_name: firstName,
          last_name: lastName,
          email: emailAddress,
        };


        // collect data for page 
        const pageFor = localStorage.getItem('pageFor')
        const first_name = localStorage.getItem('firstName')
        const last_name = localStorage.getItem('lastName')
        const family_member_type = localStorage.getItem('familyMemberType')
        const pageData = {
          pageFor, first_name, last_name, family_member_type,
        }

        const { data } = await axios.post(`/sign-up/api`, { userData, pageData });
        const signInUser = await signInWithEmailAndPassword(emailAddress, password);
        localStorage.setItem('accToken', await signInUser.user.getIdToken())
        form.reset();
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("familyMemberType");
        localStorage.removeItem("pageFor");
        localStorage.setItem('pageId', data.newPage._id)
        router.push(`/add-photo`)
      }
    } catch (e) {
      handleClientError(e)

    } finally { setLoading(false); }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
      >
        <div className="mx-auto w-full space-y-[41.41px] md:flex md:max-w-[385px] md:space-y-0">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="mx-auto h-[173.06px] w-full max-w-[689.17px] space-y-[8px] md:h-auto md:w-[188px] md:space-y-[8px]">
                <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    className="mx-auto h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] text-black placeholder:text-[#A2AEBA] md:h-[44px] md:w-[188px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="md:auto mx-auto h-[173.06px] w-full max-w-[689.17px] space-y-[8px] md:ml-[9px] md:h-auto md:w-[188px] md:space-y-[8px]">
                <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    className="mx-auto h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] text-black placeholder:text-[#A2AEBA] md:h-[44px] md:w-[188px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:mt-[16px] md:h-auto md:w-[385px] md:space-y-[8px]">
              <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="@.com"
                  className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[385px] md:rounded-[8px] md:border md:p-3 md:text-[18px]  md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                  {...field}
                />
              </FormControl>

              <FormMessage className="whitespace-nowrap" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:mt-[16px] md:h-auto md:w-[385px] md:space-y-[8px]">
              <FormLabel className="h-[30px] w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] placeholder:text-black md:h-[44px] md:w-[385px] md:rounded-[8px] md:border md:p-3 md:text-[18px]  md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="whitespace-nowrap" />
            </FormItem>
          )}
        />
        <p className="w-full max-w-[689.17px] text-[25.88px] leading-[29.12px] md:mx-auto md:mt-[16px] md:h-[28px] md:w-[386px] md:text-[12px] md:leading-[14.4px]">
          By clicking the Sign Up button below, you agree to the Loved{" "}
          <span className="border-b-[0.5px] border-black">
            Terms of Service{" "}
          </span>
          and acknowledge the{" "}
          <span className="border-b-[0.5px] border-black">Privacy Notice</span>.
        </p>
        <Button
          type="submit"
          variant={"default"}
          disabled={loading}
          className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[16px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
          {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
          Sign up
        </Button>
      </form>
    </Form>
  );
}
