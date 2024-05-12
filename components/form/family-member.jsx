"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  familyMemberType: z.string(),
});

export default function FamilyMemberForm() {
  const [loading, setLoading] = useState("");
  const [familyMemberType, setFamilyMemberType] = useState("Aunt");
  const handleClientError = useClientError()
  const router = useRouter();
  const apiCaller = useApiCaller()
  const pathname = usePathname();
  const params = useParams()
  const { user } = useAuthState()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      familyMemberType: "Aunt",
    },
  });

  const handleCreatePage = async (params) => {
    try {
      const { family_member_type, last_name, first_name, pageFor } = params
      const newPageData = { family_member_type, last_name, first_name, pageFor, }
      const { data } = await apiCaller.post('/getting-started/api', { pageData: newPageData })
      localStorage.setItem('pageId', data?._id)
      router.push(`/additional-details`)

    } catch (error) {
      handleClientError(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const { firstName, lastName, familyMemberType, } = form.getValues();
    const username = `${firstName.split(' ')[0]}${Math.ceil(Math.random() * 235)}`
    localStorage.setItem('username', username)
    if (user) {
      return handleCreatePage({
        first_name: firstName,
        last_name: lastName,
        family_member_type: familyMemberType,
        pageFor: params.slug,

      })

    } else {
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("familyMemberType", familyMemberType);
      router.push("/sign-up");
    }
  }

  const handleFamilyMemberTypeChange = (selectedType) => {
    setFamilyMemberType(selectedType);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
      >
        {pathname === "/getting-started/family-member" && (
          <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
            Who is your {familyMemberType || "[family member]"}?
          </h3>
        )}
        {pathname === "/getting-started/yourself" && (
          <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
            Put your name
          </h3>
        )}
        {pathname === "/getting-started/friend" && (
          <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
            Who is your friend?
          </h3>
        )}
        <div className="mx-auto w-full space-y-[41.41px] md:mt-[16px] md:flex md:max-w-[385px] md:space-y-0">
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
                    placeholder="John"
                    className="mx-auto h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] text-black placeholder:text-[#A2AEBA] md:h-[44px] md:w-[188px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Last Name Field */}
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
                    placeholder="Doe"
                    className="mx-auto h-[75%] max-h-[102.71px] w-full rounded-[16.18px] border-[1.94px] px-[23.3px] py-[32.36px] text-[32.36px] leading-[37.53px] text-black placeholder:text-[#A2AEBA] md:h-[44px] md:w-[188px] md:rounded-[8px] md:border md:p-3 md:text-[18px] md:leading-[20px] md:placeholder:h-[20px] md:placeholder:w-full md:placeholder:text-[18px] md:placeholder:leading-[20px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* Family Member Type Field */}
        {pathname === "/getting-started/family-member" && (
          <FormField
            control={form.control}
            name="familyMemberType"
            render={({ field }) => (
              <FormItem className="h-[173.06px] w-full max-w-[689.17px] space-y-[5.18px] md:mt-[16px] md:h-auto md:w-[385px] md:space-y-[8px]">
                <FormLabel className="h-[30px] max-w-[160px] text-[25.88px] font-semibold leading-[29.12px] text-black md:h-[18px] md:w-[75px] md:text-[12px] md:font-bold md:leading-[14.4px]">
                  Family Member Type
                </FormLabel>
                <Select
                  onValueChange={(selected) => {
                    field.onChange(selected);
                    handleFamilyMemberTypeChange(selected);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="justify-start gap-x-1 text-[18px] font-normal leading-[20px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aunt">Aunt</SelectItem>
                    <SelectItem value="Brother">Brother</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="GrandFather">GrandFather</SelectItem>
                    <SelectItem value="GrandMother">GrandMother</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Sister">Sister</SelectItem>
                    <SelectItem value="Uncle">Uncle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
    </Form>
  );
}
