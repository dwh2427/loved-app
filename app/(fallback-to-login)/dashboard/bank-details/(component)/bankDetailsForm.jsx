/* eslint-disable @next/next/no-img-element */
"use client";
import TextInputField from "@/components/form-fields/text-input-field";
import { Form } from "@/components/ui/form";

import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import { zodResolver } from "@hookform/resolvers/zod";
import { es } from "date-fns/locale/es";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
// "With country select" component.

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import "react-phone-input-2/lib/style.css";
import "react-phone-number-input/style.css";
import { z } from "zod";

registerLocale("es", es);

const formSchema = z.object({
  account_holder_name: z.string().min(4),
  account_number: z.string().min(4),
  routing_number: z.string().min(4),
  country: z.string().min(2),
  currency: z.string().min(3),
});

export default function BankDetailsForm({ params }) {
  const stripe_account_id = params?.stripe_account_id;
  const [stripeData, setStripeData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [addingBankDetails, setAddingBankDetails] = useState(false)
  const handleClientError = useClientError();
  const { user } = useAuthState();
  const router = useRouter();
  const apiCaller = useApiCaller();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_holder_name: '',
      account_number: '',
      routing_number: '',
      country: stripeData?.country,
      currency: stripeData?.default_currency,

    },
  });

  const handleSubmit = async () => {
    try {
      if (user) {
        const formdata = form.getValues();
        console.log(formdata)
        setAddingBankDetails(true)
        const data = { ...formdata, stripe_account_id };
        const res = await apiCaller.post("/dashboard/bank-details/api/", data);
        router.push(`/dashboard/withdraw/${stripe_account_id}`)
      }
    } catch (error) {
      handleClientError(error);
    } finally {
      setAddingBankDetails(false)
    }
  };
  useEffect(() => {
    apiCaller
      .get(
        `/dashboard/identity/api/verify_page_by_stripe_id?stripe_account_id=${stripe_account_id}`,
      )
      .then((res) => {
        setStripeData(res.data?.account);
        const isBankAdded = res?.data?.account?.external_accounts?.total_count > 0
        if (isBankAdded) return router.push(`/dashboard/withdraw/${stripe_account_id}`)
        form.setValue('country', res.data?.account?.country)
        form.setValue('currency', res.data?.account?.default_currency)
        setLoading(false)
      })
      .catch((err) => {
        router.push("/not_found/__");
      });
  }, [apiCaller, form, router, setStripeData, stripe_account_id]);

  if (loading) {
    return <Loader2 className="mr-2 size-6 animate-spin" />
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-center gap-y-[41.41px] md:gap-y-[0px]"
      >
        <div className="mx-auto flex  w-full flex-col gap-[16px]  md:mt-[16px] md:max-w-[385px]">
          <TextInputField
            control={form.control}
            name="account_holder_name"
            label="Account Holder Name"
            placeholder="Account Holder Name"

          />


          <TextInputField
            control={form.control}
            name="account_number"
            label="Account number"
            placeholder="Account Number"
            type="number"
          />
          <TextInputField
            control={form.control}
            name="routing_number"
            label="Routing Number"
            type="number"
            placeholder="Routing Number"
          />
          <TextInputField
            control={form.control}
            name="country"
            label="Country"
            placeholder="Country"
            readOnly={true}
          />
          <TextInputField
            control={form.control}
            name="currency"
            label="Currency"
            placeholder="Currency"
            readOnly={true}

          />

        </div>

        {/* <Button className="w-[330px] text-center bg-[#FF007A] text-white p-3 rounded-full">Confirm</Button> */}
        {/* Submit Button */}
        <Button
          type="submit"
          variant={"default"}
          disabled={addingBankDetails}
          // onClick={checkFormErrors}
          className="mx-auto h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:mt-[50px] md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px]"
        >
          {addingBankDetails && <Loader2 className="mr-2 size-6 animate-spin" />}
          Confirm
        </Button>
      </form>
    </Form>
  );
}
