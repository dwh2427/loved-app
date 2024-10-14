'use client'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import axios from "axios";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    phone: z.string().min(1, { message: "Please provide a phone number" }),
  });

export default function LoginModal({ isOpen, setOnCloseLogin }) {

  const [pageLink, setPageLink] = useState("");
  const [defaultText, setDefaultText] = useState("Sign in / Sign up");
  const [paragraphText, setParagraphText] = useState("");

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    // Parse the URL
    const parsedUrl = new URL(currentUrl);

    // Get the search parameters
    const params = new URLSearchParams(parsedUrl.search);

    if (params.has('verify')) {
      const verifyValue = params.get('verify');
      localStorage.setItem('verifyValue', verifyValue);
      localStorage.setItem('sendLoveUrl', `/login/received-gift`);
      setDefaultText("Accept your Loved gift");
      setParagraphText("We’ll use your phone number to confirm your identity to claim your gift.");
    }
  }, []);

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
        setOnCloseLogin(true);
       // router.push('/login/verify-otp');
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

  // const PhoneNumberInput = () => {
    const [phone, setPhone] = useState('');
    // Function to handle phone number change and apply formatting
    const handlePhoneChange = (value) => {
      // Remove non-digit characters for processing
      const cleanedValue = value.replace(/\D/g, '');
  
      // Format as (123) 456-7890
      const formattedValue = cleanedValue.replace(
          /(\d{3})(\d{3})(\d{4})/,
          '($1) $2-$3'
      );
  
      setPhone(formattedValue);
    }
  // };
  
    

  return (


    <div className="fixed inset-0 bg-dark bg-opacity-40 flex items-center justify-center z-50 custom-popup custom-overlay">
      <div className="flex lg:w-[64rem] lg:h-[39rem] mx-auto rounded-lg shadow-lg overflow-hidden bg-white sm:my-8">
        {/* Left Side - Sign In Form*/}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 my-6">
          <div className="mx-auto flex h-[183.13px] w-full max-w-[766.82px] flex-col items-center justify-center">
            <Link href="/" className="relative  max-[600px]:h-[182.62px] w-full max-[600px]:max-w-[189.98px]">
              <Image
                src={Logo}
                alt="Image"
                className="object-cover"
                width={165}
                height={40}
                sizes="100vw"
              />
            </Link>
          </div>

          {/* Sign In Form Container */}
          <div className="bg-white rounded-lg w-full max-w-md">
            {/* Sign In Header*/}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-comfortaa" style={{ fontSize: '28px' }}>Sign In</h2>
            <p className="text-gray-600 mb-8">Share a message with a loved one</p>

            {/* Phone Number Input*/}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-[41.41px] flex flex-col items-center gap-y-[17.41px] md:gap-y-[41px]"
                >
                  <div className="space-y-41.41px md:mt-16px md:max-w-385px mx-auto w-full md:space-y-0">
                    <label htmlFor="phone" className="phone-input-label  common-font font-plus-jakarta-sans">Enter your phone number</label>
                    <FormField
                        control={form.control}
                        name={"phone"}
                        render={({ field: { ref, ...field } }) => (
                        <FormItem className="h-173.06px max-w-[450px] space-y-8px md:w-188px md:space-y-8px mx-auto w-full md:h-auto">
                            <FormControl>
                            <PhoneInput
                                country={'au'}
                                onChange={handlePhoneChange}
                                inputStyle={{
                                  width:"100%",
                                  height: "48px",
                                  paddingLeft: "74px", // Ensure text does not overlap with button
                                  borderRadius: "var(--Spacing-3, 12px)",
                                  border: "1px solid var(--Light-Mode-Border-Secondary, #D8D8DA)",
                                  background: "var(--Light-Mode-Background-Default, #FFF)"
                                }}
                                buttonStyle={{
                                  position: "absolute", // Position button absolutely to prevent overlap
                                  zIndex: 1, // Ensure button appears above the input
                                  display: "flex",
                                  padding: "0px 16px 0px 8px",
                                  alignItems: "center",
                                  gap: "var(--Spacing-1, 4px)",
                                  alignSelf: "stretch",
                                  border: "1px solid var(--Light-Mode-Border-Secondary, #D8D8DA)",
                                  background: "var(--Light-Mode-Background-Secondary, #F8F9FB)",
                                  borderRadius: "var(--Spacing-3, 12px) 0px 0px var(--Spacing-3, 12px)",
                                }}
                                containerStyle={{
                                  position: "relative", // Set container to relative to position button properly
                                }}
                                className="phone-input-custom mt-[8px] w-full phone-input-text common-font"
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
                    className="font-comfortaa signBtn mx-auto h-[52px] w-full max-w-[625.75px] text-base font-semibold rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[52px] md:w-[450px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:leading-[22px]"
                    >
                    {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
                    Sign In
                    </Button>
                </form>
                </Form>

            {/*  Terms and Privacy Notice */}
            <p className="text-center text-gray-500 text-xs mt-4 terms-and-services-text">
              By clicking the Sign In button below, you agree to the Loved{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and acknowledge the{" "}
              <a href="#" className="underline">
                Privacy Notice
              </a>.
            </p>
          </div>
        </div>


        {/* Right Side - Cover Image */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center img-none">
          <img
            src="/assets/img/covers/signCoverImg.png"
            alt="Cover Image"
            className="w-[350px] h-[350px] lg:w-[512px] lg:h-[598px] object-cover rounded-lg login-popup-padding"
          />
        </div>
      </div>
    </div>

  );
}
