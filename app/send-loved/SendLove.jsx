"use client";
import dynamic from "next/dynamic";
import LovedAnimate from "@/components/lotties/loved-animate";
import { useToast } from "@/components/ui/use-toast";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Lottie from "react-lottie";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Elements, useElements, useStripe, PaymentElement, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
import Image from "next/image";
import LovedLogo from "@/public/send-loved-logo.svg";

// Importing components
import SearchInput from "./FormComponents/SearchInput";
import MessageInput from "./FormComponents/MessageInput";
import FileInput from "./FormComponents/FileInput";
import DonationInput from "./FormComponents/DonationInput";
import PaymentInfo from "./FormComponents/PaymentInfo";
import UserInfo from "./FormComponents/UserInfo";
import ShareButton from "./FormComponents/ShareButton";
import SchedulePopup from './FormComponents/SchedulePopup'; // Import the Popup component



const LovedBoxHeader = dynamic(() => import("@/components/loved-box/lovedBoxHeader"), {
  ssr: false,
});

const formSchema = z.object({
  inputValue: z.string().nonempty("Please enter a valid name"),
  text: z.string().nonempty("Please enter a comment"),
  username: z.string().nonempty("Username is required").regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),
  email: z.string().nonempty("Email is required").email("Invalid email address"),
});


export default function SendLove() {
  const { user, loading } = useAuthState();
  const { toast } = useToast();
  const [lovedMsg, setLovedMsg] = useState("");
  const [pages, setPages] = useState([]);
  const [lovedLoading, setLovedLoading] = useState(false);
  const [stopLovedLoading, setStopLovedLoading] = useState(false);
  const [isPaymentProccess, setIsPaymentProccess] = useState(false);
  const handleClientError = useClientError();
  const [imageFile, setImageFile] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  const [customPageLink, setCustomPageLink] = useState("dashboard");
  const [pageLoading, setPageLoading] = useState(false);
  const [application_amount_fee, set_application_amount_fee] = useState(0);
  const [showShareIcon, setShowShareIcon] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [getTipAmmountPercent, setGetTipAmountPercent] = useState(17);
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [paymentConfirm, setPaymentConfirm] = useState(null);
  const [isSubmitPayment, setIsSubmitPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (optional "+" followed by 1-15 digits)
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to manage the popup visibility
  const [scheduledTime, setScheduledTime] = useState(""); // State to manage the popup visibility
  const [scheduledDate, setScheduledDate] = useState("");// State to manage the popup visibility

  const {
    register,
    setValue,
    getValues,
    watch,
    setError,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const inputValue = watch("inputValue");
  const text = watch("text");
  const tipAmount = watch("tipAmount");
  const username = watch("username");
  const email = watch("email");

  useEffect(() => {
    if (user && !loading) {
      // Assuming user data contains firstname, lastname, and email
      const { first_name, last_name, email, phone, uid } = user;
        
      // Combine firstname and lastname to create the username or set it as an empty string
      const combinedUsername = first_name && last_name ? `${first_name.toLowerCase()} ${last_name.toLowerCase()}` : "";
      setValue("username", combinedUsername);

      // Set email or empty string
      setValue("email", email || "");

      // Set phone number if available


      if(phone){
        setPhoneNumber(phone);
      }

      if(uid){
        setLoginUserId(uid);
      }
      
    }
  }, [user, loading, setValue]);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LovedAnimate,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: 'flat',
    },
    allowedPaymentMethods: ['card', 'link', "google_pay", 'apple_pay'],
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await axios.get("/send-loved/api");
        setPages(response.data);
      } catch (error) {
        // console.log(error)
      }
    };
    getPages();
  }, []);

useEffect(() => {
  const sendLovedMessage = async () => {
    if (paymentConfirm) {
      try {

        const formData = new FormData();
        formData.append("image", imageFile || null);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("application_fee", application_amount_fee);
        formData.append("comment", text);
        formData.append("tipAmount", tipAmount);
        formData.append("inputValue", inputValue);
        formData.append("stripe_acc_id", selectedPage?.stripe_acc_id);
        formData.append("scheduled_time", scheduledTime);
        formData.append("scheduled_date", scheduledDate);

        if (selectedPage) {
          formData.append("page_name", selectedPage.username);
          formData.append("page_owner_id", selectedPage.uid);
          setCustomPageLink(selectedPage.username);
        } else {
          formData.append("page_name", "");
          formData.append("page_owner_id", "");
        }

        formData.append("paymentIntentId", paymentIntentId);

        setIsPaymentProccess(true);
        setLovedLoading(true);

        const accessToken = localStorage.getItem("accToken");
        const response = await axios.post("/send-loved/api", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        const isEmail = emailRegex.test(inputValue);
        const isPhone = phoneRegex.test(inputValue);

        const responseData = response.data;
        if (responseData) {
          if (isEmail || isPhone || selectedPage?.username === undefined) {
            setShowShareIcon(false);
          }

          setStopLovedLoading(true);
          setLovedMsg("Your message has been sent");
        } else {
          setLovedLoading(false);
        }
      } catch (error) {
        setLovedLoading(false);
        handleClientError(error);
      }
    }
  };

  sendLovedMessage();
}, [paymentConfirm]);


  const handleSendLoveClick = async (e) => {
    e.preventDefault();
    setIsSubmitPayment(false); // Trigger payment confirmation in PaymentInfo
    const isValid = await trigger(["username", "email"]); // Validate UserInfo step

    if (!isValid) return; // If validation fails, stop execution
    setIsSubmitPayment(true); // Trigger payment confirmation in PaymentInfo
  };

  const handleScheduleLoveClick = async (e) => {
    e.preventDefault();
    const isValid = await trigger(["username", "email"]); // Validate UserInfo step
    if (!isValid) return; // If validation fails, stop execution
    setShowPopup(true);
  };
    // Function to close the popup
    const handleClosePopup = () => {
      setShowPopup(false);
    };


  return (
    <>
      <LovedBoxHeader pageLink={customPageLink} />
      <div className="mx-auto flex max-w-[1495px] items-center justify-center px-5">
        <div className="mx-auto flex w-[560px] items-center justify-center py-10">
          {pageLoading || lovedLoading ? (
            <div className="flex h-[530px] flex-col items-center justify-center">
              {!stopLovedLoading && <Lottie options={defaultOptions} height={55} width={60} />}
              {stopLovedLoading && (
                <Image src={LovedLogo} alt="Loved Logo" width={50} height={47} />
              )}
              {lovedMsg && (
                <p className="message-sent mt-3 text-center text-4xl text-[#2E266F]">
                  Your message has <br /> been sent
                </p>
              )}
              {lovedMsg && (
                <ShareButton showShareIcon={showShareIcon} selectedPage={selectedPage} inputValue={inputValue} />
              )}

            </div>
          ) : (
            <form method="POST" encType="multipart/form-data">

              {formStep === 1 && (
              <div>
              <SearchInput
                inputValue={inputValue}
                setValue={setValue} // Pass the setValue function to update state
                watch={watch} // Pass the watch function if used in the component
                pages={pages} // Pass the list of pages for filtering suggestions
                setSelectedPage={setSelectedPage} // Pass the function to update the selected page
                errors={errors} // Pass any form validation errors
                setError={setError}
              />

              <MessageInput text={text} register={register} errors={errors} />
              <FileInput setImageFile={setImageFile} />
             <DonationInput
                selectedPage={selectedPage}
                register={register}
                tipAmount={tipAmount}
                errorMessage={errorMessage}
                setGetTipAmountPercent={setGetTipAmountPercent}
                getTipAmmountPercent={getTipAmmountPercent}
                set_application_amount_fee={set_application_amount_fee}
                setClientSecret={setClientSecret} // Pass setClientSecret down
                setFormStep={setFormStep}  // Pass the state here
                setErrorMessage={setErrorMessage}
                trigger={trigger} // Pass the trigger function for manual validation
                setValue={setValue} // Pass the setValue function to update state
                phoneNumber={phoneNumber}
                email={email}
                inputValue={inputValue}
                loginUserId={loginUserId}
                setPaymentConfirm={setPaymentConfirm}
            />
      
              </div>
               )}

             {formStep === 2 && (
              <div>
              <UserInfo
                username={username}
                register={register}
                email={email}
                errors={errors}
              />
              
                {Number(tipAmount) > 0 && clientSecret && (
                  <Elements stripe={stripePromise} options={options}>
                    <PaymentInfo 
                      clientSecret={clientSecret} 
                      setIsPaymentProccess={setIsPaymentProccess}
                      isSubmitPayment={isSubmitPayment}
                      setPaymentConfirm={setPaymentConfirm}
                      setPaymentIntentId={setPaymentIntentId}
                      setIsSubmitPayment={setIsSubmitPayment}
                      />
                  </Elements>
                )}

                <button
                  type="submit"
                  disabled={!paymentConfirm && isPaymentProccess}
                  onClick={handleSendLoveClick}
                  className="items center mt-3 block flex w-full justify-center gap-2 rounded-full bg-[#FF318C] py-3 text-center text-white hover:bg-[#FF318C]"
                >
                  {isPaymentProccess && <Loader2 className="mr-2 size-6 animate-spin" />}
                  Send Love
                </button>

                <button
                type="button"
                onClick={handleScheduleLoveClick}
                className="items-center mt-3 block flex w-full justify-center gap-2 rounded-full bg-[#F1F1F1] py-3 text-center hover:bg-[#FF318C] shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                Schedule Love
              </button>

                </div>
               )}

            {showPopup && (
              <SchedulePopup 
                message="You can’t send to yourself"
                onClose={handleClosePopup}
                setScheduledTime={setScheduledTime}
                setScheduledDate={setScheduledDate}
                setIsSubmitPayment={setIsSubmitPayment}
              />
            )}

            </form>
          )}
        </div>
      </div>
    </>
  );
}
