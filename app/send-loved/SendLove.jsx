"use client";
import dynamic from "next/dynamic";
import LovedAnimate from "@/components/lotties/loved-animate";
import { useToast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
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
import { useRouter } from "next/navigation";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
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

const base_URL = process.env.NEXT_PUBLIC_BASE_URL;

const LovedBoxHeader = dynamic(() => import("@/components/loved-box/lovedBoxHeader"), {
  ssr: false,
});

const formSchema = z.object({
  inputValue: z.string().nonempty("Please enter a valid name"),
  text: z.string().nonempty("Please enter a comment"),
});



export default function SendLove() {
  const { user, loading } = useAuthState();
  const { toast } = useToast();
  const [lovedMsg, setLovedMsg] = useState("");
  const [pages, setPages] = useState([]);
  const [lovedLoading, setLovedLoading] = useState(false);
  const [stopLovedLoading, setStopLovedLoading] = useState(false);
  const [isPaymentProccess, setIsPaymentProccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleClientError = useClientError();
  const [imageName, setImageName] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [cardsError, setCardsError] = useState();
  const [customPageLink, setCustomPageLink] = useState("dashboard");
  const [pageLoading, setPageLoading] = useState(false);
  const [application_amount_fee, set_application_amount_fee] = useState(0);
  const [showShareIcon, setShowShareIcon] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [getTipAmmountPercent, setGetTipAmountPercent] = useState(17);
  const searchParams = useSearchParams();
  const pageUsername = searchParams.get("page_username");
  const stripe = useStripe();
  const elements = useElements();
  const apiCaller = useApiCaller();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [paymentConfirm, setPaymentConfirm] = useState(null);
  const [isSubmitPayment, setIsSubmitPayment] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (optional "+" followed by 1-15 digits)

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
    allowedPaymentMethods: ['card', 'link'],
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

 


  // Handles file selection and preview
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageName(selectedFile["name"]);
      const reader = new FileReader();
      reader.onload = () => {
        const base64URL = reader.result;
        setPreviewUrl(base64URL);
      };
      reader.readAsDataURL(selectedFile);
      setImageFile(selectedFile);
    }
  };

  // Manages changes in the donation amount input
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (parseInt(value) <= 50000 && value > 0) {
      setValue("tipAmount", value, { shouldValidate: true });
    }
    if (value === "") {
      setValue("tipAmount", "", { shouldValidate: true });
    }

    if (value < 5) {
      setErrorMessage("The minimum donation amount is 5.");
    } else {
      setErrorMessage("");
    }
  };

  // Validates and formats the username input field
  const handleUsernameInput = (event) => {
    const regex = /^[a-zA-Z\s-]*$/; // Allow letters, spaces, and hyphens
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z\s-]/g, ""); // Remove all characters except letters, spaces, and hyphens
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
    const fetchLocation = async () => {
      try {
        const response = await axios.get("https://ipinfo.io?token=6d1710dc4afd5f");
        const country = response.data.country;
        if (country === "US") {
          setValue("countryCode", "+1");
        } else if (country === "AU") {
          setValue("countryCode", "+61");
        } else if (country === "BD") {
          setValue("countryCode", "+880");
        } else {
          setValue("countryCode", "+1");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [setValue]);


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

        if (selectedPage) {
          formData.append("page_name", selectedPage.username);
          formData.append("page_owner_id", selectedPage.uid);
          setCustomPageLink(selectedPage.username);
        } else {
          formData.append("page_name", "");
          formData.append("page_owner_id", "");
        }

        formData.append("charge_id", "test chargeid");

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
    setIsPaymentProccess(true);
    setIsSubmitPayment(true); // Trigger payment confirmation in PaymentInfo
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
              <FileInput
                imageName={imageName}
                handleFileChange={handleFileChange}
                previewUrl={previewUrl}
              />
             <DonationInput
                selectedPage={selectedPage}
                register={register}
                tipAmount={tipAmount}
                handleInputChange={handleInputChange}
                errorMessage={errorMessage}
                setGetTipAmountPercent={setGetTipAmountPercent}
                getTipAmmountPercent={getTipAmmountPercent}
                set_application_amount_fee={set_application_amount_fee}
                setClientSecret={setClientSecret} // Pass setClientSecret down
                setFormStep={setFormStep}  // Pass the state here
                setErrorMessage={setErrorMessage}
                trigger={trigger} // Pass the trigger function for manual validation
            />
      
              </div>
               )}

             {formStep === 2 && (
              <div>
              <UserInfo
                username={username}
                register={register}
                handleUsernameInput={handleUsernameInput}
                email={email}
                errors={errors}
              />
              
              {Number(tipAmount) > 0 && clientSecret && (
                  <Elements stripe={stripePromise} options={options}>
                    <PaymentInfo clientSecret={clientSecret} setIsPaymentProccess={setIsPaymentProccess} isSubmitPayment={isSubmitPayment} setPaymentConfirm={setPaymentConfirm} />
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

                </div>
               )}

            </form>
          )}
        </div>
      </div>
    </>
  );
}
