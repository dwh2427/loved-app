"use client";

import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectInputField from "../form-fields/select-input-field";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "../ui/form";
import { Input } from "../ui/input";

import useGetCountry from "@/hooks/useGetCountry";
import country from '@/public/countrys.json';
const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  familyMemberType: z.string(),
  country: z.string(),
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
  const { data, countryLoading } = useGetCountry()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      familyMemberType: "Aunt",
      country: data?.country_code
    },
  });


  const handleCreatePage = async (params) => {

    try {
      const { data } = await apiCaller.post('/getting-started/api', { pageData: params })
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
    const { firstName, lastName, familyMemberType, country } = form.getValues();
    const username = `${firstName.split(' ')[0]}${Math.ceil(Math.random() * 235)}`
    localStorage.setItem('username', username)
    localStorage.setItem('icon', `https:${data.icon}`)
    localStorage.setItem('country_code', country)


    const newPageData = {
      first_name: firstName,
      last_name: lastName,
      family_member_type: familyMemberType,
      pageFor: params.slug,
      country: country
    }
    if (user) {
      return handleCreatePage(newPageData)

    } else {
      const jsonNewpageData = JSON.stringify(newPageData)
      localStorage.setItem('newPageData', jsonNewpageData)
      router.push("/sign-up");
    }
  }

  const handleFamilyMemberTypeChange = (selectedType) => {
    setFamilyMemberType(selectedType);
  };


  const countryOptions = []
  country?.forEach(i => {
    if (Object.values(i).every(e => e)) {
      countryOptions.push({ ...i, label: i.name, value: i.country_code })
    }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[41.41px] flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
      >


        {countryLoading ? <Loader2 className="mt-5" /> : <>

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
              )
              }
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
            <SelectInputField
              control={form.control}
              name="familyMemberType"
              label="Family Member Type"
              options={[
                { value: 'Aunt', label: 'Aunt' },
                { value: 'Brother', label: 'Brother' },
                { value: 'Father', label: 'Father' },
                { value: 'GrandFather', label: 'GrandFather' },
                { value: 'GrandMother', label: 'GrandMother' },
                { value: 'Mother', label: 'Mother' },
                { value: 'Sister', label: 'Sister' },
                { value: 'Uncle', label: 'Uncle' }
              ]}
              onChange={handleFamilyMemberTypeChange}
            />
          )}

          <SelectInputField
            name={'country'}
            control={form.control}
            label={'Country'}
            options={countryOptions}
            form={form}
            defaultValue={data.country_code}
            onChange={(data) => localStorage.setItem('country_code', data)}
          />
          {/* Submit Button */}
        </>}
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

