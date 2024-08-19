"use client";
import LovedAnimate from "@/components/lotties/loved-animate";
// import LovedBoxHeader from "@/components/loved-box/lovedBoxHeader";
import { useToast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import CameraIcon from "@/public/camera-icon.svg";
import CloseTextIcon from "@/public/close-text.svg";
import MansIcon from "@/public/mans-icon.svg";
import MessageIcon from "@/public/message-icon.svg";
import PlusIcon from "@/public/plus-rounded.svg";
import SearchBar from "@/public/search-bar.svg";
import LovedLogo from "@/public/send-loved-logo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slider } from "@mui/material";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Lottie from "react-lottie";
import { z } from "zod";
const base_URL = process.env.NEXT_PUBLIC_BASE_URL;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (optional "+" followed by 1-15 digits)
import { useRouter } from 'next/navigation';

const LovedBoxHeader = dynamic(
  () => import("@/components/loved-box/lovedBoxHeader"),
  {
    ssr: false,
  },
);

const formSchema = z.object({
  inputValue: z.string().nonempty("Please enter a valid name"),
  text: z.string().nonempty("Please enter a comment"),
  username: z.string().nonempty("Please enter your name"),
});

const capitalizeWords = (str) => {
  if (typeof str !== "string") {
    return "";
  }
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function SendLove() {

  const { user, loading } = useAuthState();
  const { toast } = useToast();
  const [lovedMsg, setLovedMsg] = useState("");
  const [pages, setPages] = useState([]);
  const [lovedLoading, setLovedLoading] = useState(false);
  const [stopLovedLoading, setStopLovedLoading] = useState(false);
  const [isPaymentProccess, setIsPaymentProccess] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleClientError = useClientError();
  const [imageName, setImageName] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [cardsError, setCardsError] = useState();
  const [pageLink, setPageLink] = useState(null);
  const [customPageLink, setcustomPageLink] = useState(`dashboard`);
  const [pageLoading, setPageLoading] = useState(false);
  const [application_amount_fee, set_application_amount_fee] = useState(0);
  const [showShareIcon, setshowShareIcon] = useState(true);
  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  const searchParams = useSearchParams();
  const pageUsername = searchParams.get("page_username");
  const stripe = useStripe();
  const elements = useElements();
  const apiCaller = useApiCaller();
  const [errorMessage, setErrorMessage] = useState("");
  const [countryCode, setCountryCode] = useState('');
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setError,
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
        const response = await axios.get('https://ipinfo.io?token=6d1710dc4afd5f');
        const country = response.data.country;
        console.log(country);
        if (country === 'US') {
          setValue("countryCode", "+1");
        } else if (country === 'AU') {
          setValue("countryCode", "+61");
        } else if (country === 'BD') {  // Adding Bangladesh
          setValue("countryCode", "+880");
        }else{
          setValue("countryCode", "+1");
        }
        // Add other countries as needed
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [setValue]);


// Filtering function for real-time search
const handleChange = (e) => {
  let value = e.target.value;

  // Automatically add country code if the input starts with a number
  const countryCode = watch("countryCode");
  if (/^\d/.test(value) && !value.startsWith(countryCode)) {
    value = countryCode + value;
  }

  setValue("inputValue", value);

  if (value) {
    const valueLowerCase = value.toLowerCase();
    const words = valueLowerCase.split(" ");

    const filtered = pages?.filter((suggestion) => {
      const firstName = suggestion?.first_name?.toLowerCase() || "";
      const lastName = suggestion?.last_name?.toLowerCase() || "";
      const email = suggestion?.email?.toLowerCase() || "";
      const phone = suggestion?.phone?.toLowerCase() || "";

      if (words.length > 1) {
        return words.every(
          (word) =>
            firstName.includes(word) ||
            lastName.includes(word) ||
            email.includes(word) ||
            phone.includes(word)
        );
      } else {
        return (
          firstName.includes(valueLowerCase) ||
          lastName.includes(valueLowerCase) ||
          email.includes(valueLowerCase) ||
          phone.includes(valueLowerCase)
        );
      }
    });

    setFilteredSuggestions(filtered.length > 0 ? filtered : []);
  } else {
    setFilteredSuggestions([]);
  }
};


  // Regex patterns for US, Australian, and Bangladeshi phone numbers
  const usPhoneRegex = /^\(?\+?1\)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const auPhoneRegex = /^\(?\+?61\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;
  const bdPhoneRegex = /^\(?\+?880\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;

  // Format functions
  const formatUSPhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return number;
  };

  const formatAUPhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `+61 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return number;
  };

  const formatBDPhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `+880 ${match[1]} ${match[2]} ${match[3]}`;
    }
    return number;
  };


// Validation and formatting function
const handleBlur = (e) => {
  let value = e.target.value.trim();

  // Check if the value contains '@' for email validation
  if (value.includes('@')) {
    if (!emailRegex.test(value.toLowerCase())) {
      alert('Please enter a valid email address.');
      return;
    }
  } 
  // Check if the value contains numbers for phone validation and formatting
  else if (/\d/.test(value)) {
    const isUSPhone = usPhoneRegex.test(value);
    const isAUPhone = auPhoneRegex.test(value);
    const isBDPhone = bdPhoneRegex.test(value);

    if (isUSPhone) {
      value = formatUSPhone(value);
    } else if (isAUPhone) {
      value = formatAUPhone(value);
    } else if (isBDPhone) {
      value = formatBDPhone(value);
    } else {
      alert('Please enter a valid US, Australian, or Bangladeshi phone number.');
      return;
    }
  }

  // Set the formatted value
  setValue("inputValue", value); // Update the value after formatting
};
  
  useEffect(() => {
    if (pageUsername) {
      setPageLoading(true);
      axios
        .get(`/send-loved/api/get-page-data?username=${pageUsername}`)
        .then((res) => {
          setPageLoading(false);
          setSelectedPage(res?.data?.data);
          setPageLink(res?.data?.data?.username);
          setValue(
            "inputValue",
            `${res?.data?.data?.first_name} ${res?.data?.data?.last_name}`,
          );
        })
        .catch((error) => {
          setPageLoading(false);
          console.error(error);
        });
    }
  }, [pageUsername, setValue]);

  const handleClick = (suggestion) => {
    setSelectedPage(suggestion);
    setPageLink(suggestion?.username);
    setValue(
      "inputValue",
      `${suggestion?.first_name} ${suggestion?.last_name}`,
    );
    setError("inputValue", "");
    // setValue("username", suggestion?.username);
    setValue("pageName", suggestion?.username);
    setValue("pageOwnerId", suggestion?.uid);
    console.log(suggestion);
    setFilteredSuggestions([]);
  };

  const handleClear = () => {
    setValue("inputValue", "");
    // setValue("username", "");
    setValue("pageName", "");
    setValue("pageOwnerId", "");
    setSelectedPage(null);
    setFilteredSuggestions(pages);
    localStorage.removeItem("public_page", "");
  };

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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      console.log(data);
      formData.append("image", imageFile || null);
      formData.append("username", data.username);
      formData.append("email", email);
      formData.append("application_fee", application_amount_fee);

      formData.append("comment", data.text);
      formData.append("tipAmount", tipAmount);
      formData.append("inputValue", inputValue);
      if (selectedPage) {
        formData.append("page_name", selectedPage.username);
        formData.append("page_owner_id", selectedPage.uid);
        setcustomPageLink(selectedPage.username);
        // Check if page exists
    }else{
      formData.append("page_name", "");
      formData.append("page_owner_id", "");
    }
    const isEmail = emailRegex.test(inputValue);
    const isPhone = phoneRegex.test(inputValue);

    if (!isEmail && !isPhone && selectedPage?.username === undefined) {
      setError("inputValue", {
        type: "manual",
        message: "Please enter a valid email, phone number, or page.",
      });
      return;
    }

    
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (tipAmount > 0) {
        if (tipAmount < 5) {
          setErrorMessage("The minimum donation amount is 5.");
          return;
        } 
        setCardsError();
        if (!cardNumberElement._complete) {
          setCardsError("Card number is incomplete");
          return;
        }
        if (!cardExpiryElement._complete) {
          setCardsError("Card expiry date is incomplete");
          return;
        }
        if (!cardCvcElement._complete) {
          setCardsError("Card CVC is incomplete");
          return;
        }

        setIsPaymentProccess(true);
        const { token, error } = await stripe.createToken(cardNumberElement);
       
        const token2 = await stripe.createToken(cardNumberElement);
      

        const { radarSession } = await stripe.createRadarSession();
        const currency = selectedPage?.currency || 'aud';
        const stripeAccId = selectedPage?.stripe_acc_id || '';

        
        if (token) {
          const result = await confirmPaymentIntent(
            radarSession,
            token,
            token2,
            data.text,
            data.username,
            email,
            tipAmount,
            currency,
            application_amount_fee,
            stripeAccId,
            inputValue
          );

          if (result.error) {
            setIsPaymentProccess(false);
            throw new Error(result.error.message);
          } else {
            formData.append("charge_id", result.id);
            toast({
              variant: "success",
              title: "Thank you! Your payment is successful!",
            });
            setIsPaymentProccess(false);
          }
        }
      }

      setLovedLoading(true);
      const accessToken = localStorage.getItem("accToken");
      const response = await axios.post("/send-loved/api", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const responseData = response.data;
      if (responseData) {
        if (isEmail || isPhone || selectedPage?.username === undefined) {
          setshowShareIcon(false);
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
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  const confirmPaymentIntent = async (
    radarSession,
    cardNumberElement,
    tokenId,
    comments,
    name,
    email,
    amount,
    currency,
    application_amount_fee,
    connectedAccountId,
    inputValue
  ) => {
    try {
      console.log(tokenId)
      const response = await apiCaller.post(
        "send-loved/api/confirm-payment-intent",
        {
          radarSession,
          cardNumberElement,
          tokenId,
          comments,
          name,
          email,
          amount,
          currency,
          application_amount_fee,
          connectedAccountId,
          inputValue
        },
      );
      return response.data;
    } catch (error) {
      handleClientError(error);
    }
  };

  const toTitleCase = (str) =>
    str?.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  const [getTipAmmountPercent, setGetTipAmountPercent] = useState(17);
  useEffect(() => {
    if (typeof document === "undefined") return;

    const parentElem = document.querySelector(".MuiSlider-valueLabel");
    const elements = document.querySelector(".MuiSlider-valueLabelLabel");

    if (!parentElem) {
      console.error("Parent element not found");
      return;
    }

    if (!elements) {
      console.error("Elements not found");
      return;
    }
    parentElem.style.background = "white";
    parentElem.style.color = "#2E266F";
    const feeAmount = Number(tipAmount) * (Number(getTipAmmountPercent) / 100);
    set_application_amount_fee(feeAmount);

    elements.innerHTML = `$${feeAmount.toFixed(2)} <span style="color:gray">(${getTipAmmountPercent}%)</span>`;
  }, [getTipAmmountPercent, tipAmount]);

  const handleUsernameInput = (event) => {
    const regex = /^[a-zA-Z\s-]*$/; // Allow letters, spaces, and hyphens
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z\s-]/g, ""); // Remove all characters except letters, spaces, and hyphens
    }
  };

  const shareText = "Check out this awesome website!";
  const [isCopied, setIsCopied] = useState(false);
  const shareUrl = `${base_URL}${selectedPage?.username}`;

  const twitterText = `Share Your Love with ${capitalizeWords(inputValue)}`;
  const EmailSubject = `Check out ${capitalizeWords(inputValue)}’s Loved page`;
  const emailText = `Hello,\n\nI thought you might be interested in adding something nice to ${capitalizeWords(inputValue)}’s Loved page, ${shareUrl}\n\nA nice note and contribution would really be a nice way to show your gratitude and care. Otherwise, please feel free to forward this onto someone else that may be interested.`;
  const whatsappText = `Hi, I thought you’d be interested in the Loved page of ${capitalizeWords(inputValue)}.\nYou can add a message to the page, make a contribution or share it with your friends.\nVisit page ${shareUrl}`;

  const handleEmailShare = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(EmailSubject)}&body=${encodeURIComponent(emailText)}`;
    window.location.href = mailtoUrl;
  };

  const copyToClipboardDynamic = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <>
      <LovedBoxHeader pageLink={customPageLink} />
      <div className="mx-auto flex max-w-[1495px] items-center justify-center px-5">
        <div className="mx-auto flex w-[560px] items-center justify-center py-10">
          {pageLoading || lovedLoading ? (
            <div className="flex h-[530px] flex-col items-center justify-center">
              {!stopLovedLoading && (
                <Lottie options={defaultOptions} height={55} width={60} />
              )}

              {stopLovedLoading && (
                <Image
                  src={LovedLogo}
                  alt="Loved Logo"
                  width={50}
                  height={47}
                />
              )}
              {lovedMsg && (
                <p className="message-sent mt-3 text-center text-4xl text-[#2E266F]">
                  Your message has <br /> been sent
                </p>
              )}
              {lovedMsg && (
                <div className="custom-body mt-5 text-center">
                  <p className="want-more mt-3 text-center text-4xl text-[#2E266F]">
                    Want to help more?
                  </p>
                  <p className="more-page text-center text-[#2E266F]">
                    Let people know about this page.
                  </p>
                  { showShareIcon && (
                  <div className="button-container mt-10">
                    <div className="left-buttons">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => copyToClipboardDynamic(shareUrl)}
                      >
                        {isCopied ? (
                          <>
                            <Image
                              src="/checkmark.svg"
                              alt="Link copied"
                              width={54}
                              height={54}
                            />
                            <div className="text-left">
                              <span>Link copied</span>
                              <br />
                              <span className="custom-link-text">
                                {shareUrl}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Image
                              src="/share-ink.svg"
                              alt="Share link"
                              width={54}
                              height={54}
                            />
                            <div className="text-left">
                              <span>Share link</span>
                              <br />
                              <span className="custom-link-text">
                                {shareUrl}
                              </span>
                            </div>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`,
                            "_blank",
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Image src="/x.svg" alt="X" width={54} height={54} />
                        <span>X</span>
                      </button>
                      <button
                        className="flex items-center gap-2"
                        onClick={handleEmailShare}
                      >
                        <Image
                          src="/email.svg"
                          alt="Email"
                          width={54}
                          height={54}
                        />
                        <span>Email</span>
                      </button>
                    </div>
                    <div className="right-buttons">
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                            "_blank",
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Image
                          src="/share-facebook.svg"
                          alt="Facebook"
                          width={54}
                          height={54}
                        />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => {
                          const fallbackUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=5480962782120712&redirect_uri=${encodeURIComponent(window.location.href)}`;

                          const fbMessengerUrl = `fb-messenger://share?link=${encodeURIComponent(shareUrl)}&app_id=3485738945794`;

                          const isIOS =
                            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                            !window.MSStream;
                          const isAndroid = /Android/.test(navigator.userAgent);

                          if (isIOS || isAndroid) {
                            window.location.href = fbMessengerUrl;
                            setTimeout(() => {
                              window.open(fallbackUrl, "_blank");
                            }, 500);
                          } else {
                            window.open(fallbackUrl, "_blank");
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <Image
                          src="/messenger.svg"
                          alt="Messenger"
                          width={54}
                          height={54}
                        />
                        <span>Messenger</span>
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
                            "_blank",
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Image
                          src="/whatsapp.svg"
                          alt="WhatsApp"
                          width={54}
                          height={54}
                        />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                  ) }

                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Image src={LovedLogo} alt="Loved Logo" width={50} height={47} />
              <h2 className="mt-3 text-center text-4xl text-[#2E266F]">
                Send Love
              </h2>
              <p className="plus-jakarta-sans-font-face my-3 text-center text-[12px] leading-4 text-[#586580]">
                Find them by searching their first and last name. Don’t worry{" "}
                <br /> if they’re not already on Loved, we’ll help you set them
                up.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
                encType="multipart/form-data"
              >
                <div className="form-group relative">
                <input
                  value={inputValue}
                  onChange={handleChange} // Filtering on type
                  onBlur={handleBlur}     // Validation and formatting on blur
                  autoComplete="new-password"
                  className={`w-[330px] bg-[#F1F1F1]  p-3 pl-10 focus:outline-none ${
                    filteredSuggestions.length > 0
                      ? 'rounded-t-[25px] rounded-tl-[25px] rounded-tr-[25px]'
                      : 'rounded-full'
                  }`}
                  type="text"
                  placeholder="Name, mobile phone or email"
                />

                    <Image
                    src={SearchBar}
                    alt="Search Bar"
                    width={17}
                    height={17}
                    className="absolute left-3 top-4"
                  />
                  {inputValue && (
                    <Image
                      onClick={handleClear}
                      src={CloseTextIcon}
                      alt="close"
                      width={17}
                      height={17}
                      className="absolute right-3 top-4 cursor-pointer"
                    />
                  )}
                  {filteredSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 z-50 border-t border-t-[#A5B5D4] bg-white  shadow-sm ">
                      {filteredSuggestions
                        .slice(0, 8)
                        .map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => handleClick(suggestion)}
                            className="flex cursor-pointer gap-2 border-b-[0.5px] border-[#A5B5D4] bg-[#F1F1F1] px-2 pb-1 pt-2"
                          >
                            <div className="flex items-center">
                              {suggestion?.images !== undefined &&
                              suggestion?.images.length > 0 ? (
                                <Image
                                  src={suggestion?.images[0]}
                                  alt="Profile Image"
                                  width={30}
                                  height={30}
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <Image
                                  src={PlusIcon}
                                  alt="Plus Icon"
                                  width={20}
                                  height={20}
                                />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[16px] font-medium">
                                {capitalize(suggestion?.first_name)}{" "}
                                {capitalize(suggestion?.last_name)}
                              </p>
                              <span className="text-sm text-[#A5B5D4]">
                                {suggestion?.additional_info?.city}
                                {suggestion?.additional_info?.city && ", "}{" "}
                                {suggestion?.additional_info?.country === "AU"
                                  ? "Australia"
                                  : suggestion?.additional_info?.country}
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  {errors.inputValue && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.inputValue.message}
                    </p>
                  )}
                </div>
                <div className="form-group relative my-5">
                  <textarea
                    {...register("text")}
                    value={text}
                    rows={4}
                    className="w-[330px] resize-none rounded-[25px] bg-[#F1F1F1] p-3 pl-10"
                    type="text"
                    placeholder="Message"
                  />
                  <Image
                    src={MessageIcon}
                    alt="Search Bar"
                    width={17}
                    height={17}
                    className="absolute left-3 top-4"
                  />
                  {errors.text && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.text.message}
                    </p>
                  )}
                </div>

                <div className="form-group relative">
                  <input
                    onChange={handleFileChange}
                    type="file"
                    id="file"
                    className="hidden"
                    name="image"
                  />
                  <label
                    htmlFor="file"
                    className="block w-[330px]  rounded-full bg-[#F1F1F1] p-2 pl-10"
                    type="text"
                    placeholder={`${imageName ? imageName : "Add photo"}`}
                  >
                    <span className="text-[#c5cad1]">Add photo</span>
                  </label>
                  <Image
                    src={CameraIcon}
                    alt="Search Bar"
                    width={17}
                    height={17}
                    className="absolute left-3 top-3.5"
                  />
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={330}
                      height={250}
                      className="mt-4 h-[250px] w-[330px] rounded-[25px] object-cover"
                    />
                  )}
                </div>

                <div className="form-group relative  mt-5 rounded-[25px] bg-[#F1F1F1] px-2 py-2">
                  <div className=" flex items-center justify-between  ">
                    <label
                      className="block flex items-center gap-1"
                      type="text"
                    >
                      <Image
                        src="/cash-donations.svg"
                        alt="donations"
                        className="mr-2"
                        width={24}
                        height={25}
                      />
                      Cash Donation{" "}
                      <span className="rounded-lg bg-[#CBD3E2] p-1 text-[12px] text-white">
                        {selectedPage?.currency || "USD"}
                      </span>
                    </label>
                    <div>
                      $
                      <input
                        {...register("tipAmount", {
                          valueAsNumber: true,
                        })}
                        onChange={handleInputChange}
                        type="number"
                        value={tipAmount}
                        className="w-20 bg-[#F1F1F1] px-2 focus:border-0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                {errorMessage && (
                  <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
                )}
                {tipAmount > 0 && (
                  <div className="form-group relative  mt-5 rounded-[25px] bg-[#F1F1F1] px-2 py-2">
                    <div className=" flex items-center justify-between  ">
                      <label className="flex items-center gap-1 " type="text">
                        <Image
                          src="/tip.svg"
                          alt="tip"
                          width={24}
                          height={25}
                        />
                        Tip the loved service{" "}
                        <span className="rounded-lg bg-[#CBD3E2] p-1 text-[12px] text-white">
                          {selectedPage?.currency || "USD"}
                        </span>
                      </label>
                    </div>
                    <div>
                      <span className="mb-5 text-[12px] text-[#9AA3B1]">
                        Support our service which we offer at no charge to you
                      </span>
                      {/* <input type="range" className="w-full" /> */}
                      <Slider
                        aria-label="tip_amount"
                        defaultValue={17}
                        // getAriaValueText={valuetext}
                        onChange={(e, v) => {
                          setGetTipAmountPercent(v);
                        }}
                        valueLabelDisplay="on"
                        className="mt-10 h-1"
                        step={1}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                )}

                <div className="relative mt-5 flex max-w-[330px] items-center rounded-[25px] bg-[#F1F1F1] p-4">
                  <div className="flex items-center">
                    <Image
                      src={MansIcon}
                      alt="Info"
                      className="mr-2"
                      width={17}
                      height={17}
                    />
                    <span className="text-[#2E266F]">From</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="form-group relative mb-2">
                      <input
                        value={username}
                        {...register("username", {
                          pattern: {
                            value: /^[a-zA-Z-]+$/,
                            message: "Only letters and hyphens are allowed",
                          },
                        })}
                        onInput={handleUsernameInput}
                        className={`w-full rounded-full bg-[#F1F1F1] p-2 pl-4 text-right`}
                        type="text"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group relative">
                      <input
                        value={email}
                        {...register("email")}
                        className={`w-full rounded-full bg-[#F1F1F1] p-2 pl-4 text-right`}
                        type="email"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </p>
                )}

                {/* cards elements */}

                { Number(tipAmount) > 0 &&
                <div className="form-group relative mt-5 max-w-[330px] rounded-[25px] bg-[#F1F1F1] px-2 py-4">
                  <p className="itemx-center mb-1 flex gap-1 text-[#2E266F]">
                    <Image
                      src="/credit-card.svg"
                      alt="card"
                      width="24"
                      height="25"
                    />
                    Credit or Debit Payment Information
                  </p>
                  <div className="form-group my-2 p-2">
                    <CardNumberElement
                      options={{
                        ...CARD_ELEMENT_OPTIONS,
                        placeholder: "Card Number",
                      }}
                    />
                  </div>
                  <div className="my-2">
                    <div className="flex justify-between  p-2">
                      <div className="w-1/2 ">
                        <CardExpiryElement
                          options={{
                            ...CARD_ELEMENT_OPTIONS,
                            placeholder: "Expiry",
                          }}
                        />
                      </div>
                      <div className="w-[20%] ">
                        <CardCvcElement
                          options={{
                            ...CARD_ELEMENT_OPTIONS,
                            placeholder: "CVV",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                 } 
                {cardsError && (
                  <p className="mt-1 text-xs text-red-500">{cardsError}</p>
                )}
                <button
                  type="submit"
                  disabled={!stripe || !elements}
                  className="items center mt-3 block flex w-full justify-center gap-2 rounded-full bg-[#FF318C] py-3 text-center text-white hover:bg-[#FF318C]"
                >
                  {isPaymentProccess && (
                    <Loader2 className="mr-2 size-6 animate-spin" />
                  )}
                  Send Love
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
