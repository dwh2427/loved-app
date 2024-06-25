'use client'
import LovedAnimate from "@/components/lotties/loved-animate";
// import LovedBoxHeader from "@/components/loved-box/lovedBoxHeader";
import { useToast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
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
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Lottie from "react-lottie";
import { z } from "zod";

const LovedBoxHeader = dynamic(() => import('@/components/loved-box/lovedBoxHeader'), {
    ssr: false,
});


const formSchema = z.object({
    inputValue: z.string().nonempty("Please enter a valid name"),
    text: z.string().nonempty("Please enter a comment"),
    username: z.string().nonempty("Please enter your name"),

});

export default function SendLove() {
    const { toast } = useToast();
    const [lovedMsg, setLovedMsg] = useState('');
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
    const [cardsError, setCardsError] = useState()
    const [pageLink, setPageLink] = useState('');
    const [pageLoading, setPageLoading] = useState(false)
    const [application_amount_fee, set_application_amount_fee] = useState(0)
    const capitalize = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    const searchParams = useSearchParams();
    const pageUsername = searchParams.get('page_username')
    const stripe = useStripe();
    const elements = useElements();
    const apiCaller = useApiCaller();
    const [errorMessage, setErrorMessage] = useState("");

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
                const response = await axios.get('/send-loved/api');
                setPages(response.data);
            } catch (error) {
                // console.log(error)
            }
        };
        getPages();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value.trim();
        setValue("inputValue", e.target.value);

        if (value) {
            const valueLowerCase = value.toLowerCase();
            const words = valueLowerCase.split(' ');

            const filtered = pages?.filter((suggestion) => {
                const firstName = suggestion?.first_name?.toLowerCase() || '';
                const lastName = suggestion?.last_name?.toLowerCase() || '';

                if (words.length > 1) {
                    return words.every(word => firstName.includes(word) || lastName.includes(word));
                } else {
                    return firstName.includes(valueLowerCase) || lastName.includes(valueLowerCase);
                }
            });

            setFilteredSuggestions(filtered.length > 0 ? filtered : []);
        } else {
            setFilteredSuggestions([]);
        }
    };

    useEffect(() => {
        if (pageUsername) {
            setPageLoading(true)
            axios
                .get(`/send-loved/api/get-page-data?username=${pageUsername}`)
                .then((res) => {
                    setPageLoading(false);
                    setSelectedPage(res?.data?.data);
                    setPageLink(res?.data?.data?.username);
                    setValue("inputValue", `${res?.data?.data?.first_name} ${res?.data?.data?.last_name}`);
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
        setValue("inputValue", `${suggestion?.first_name} ${suggestion?.last_name}`);
        setError("inputValue", '')
        // setValue("username", suggestion?.username);
        setValue("pageName", suggestion?.username);
        setValue("pageOwnerId", suggestion?.uid);

        setFilteredSuggestions([]);
    };

    const handleClear = () => {
        setValue("inputValue", "");
        // setValue("username", "");
        setValue("pageName", "");
        setValue("pageOwnerId", "");
        setFilteredSuggestions(pages);
        localStorage.removeItem('public_page', "");
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
            setValue('tipAmount', value, { shouldValidate: true });
        }
        if (value === "") {
            setValue('tipAmount', '', { shouldValidate: true });
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
            console.log(data)
            formData.append('image', imageFile || null);
            formData.append("username", data.username);
            formData.append("email", email);
            formData.append("application_fee", application_amount_fee);
            formData.append("page_name", data.pageName);
            formData.append("comment", data.text);
            formData.append("tipAmount", tipAmount);
            formData.append("page_owner_id", selectedPage.uid);

            // Check if page exists
            const pageExists = pages?.find((page) => page.username === selectedPage.username);
            if (!pageExists) {
                setLovedLoading(false);
                throw new Error('Page not found');
            }

            const cardNumberElement = elements.getElement(CardNumberElement);
            const cardExpiryElement = elements.getElement(CardExpiryElement);
            const cardCvcElement = elements.getElement(CardCvcElement);

            if (tipAmount > 0) {
                if (tipAmount < 5) {
                    setErrorMessage("The minimum donation amount is 5.");
                    return
                }
                setCardsError()
                if (!cardNumberElement._complete) {
                    setCardsError('Card number is incomplete')
                    return
                }
                if (!cardExpiryElement._complete) {
                    setCardsError('Card expiry date is incomplete')
                    return

                }
                if (!cardCvcElement._complete) {
                    setCardsError('Card CVC is incomplete')
                    return

                }

                setIsPaymentProccess(true);

                const paymentIntent = await createPaymentIntent(data.tipAmount, selectedPage.currency, 'card', selectedPage.stripe_acc_id, application_amount_fee);
                if (paymentIntent.client_secret) {
                    const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
                        payment_method: {
                            card: cardNumberElement,

                        },
                    });

                    if (result.error) {
                        setIsPaymentProccess(false);
                        throw new Error(result.error.message);
                    } else {
                        toast({ variant: 'success', title: "Thank you! Your payment is successful!" });
                        setIsPaymentProccess(false);
                    }
                }
            }
            setLovedLoading(true);
            const response = await axios.post('/send-loved/api', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const responseData = response.data;
            if (responseData) {
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
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                    color: '#aab7c4',
                },

            },
            invalid: {
                color: '#fa755a',
            },
        },
    };

    const createPaymentIntent = async (amount, currency, paymentType, connectedAccountId, application_amount_fee) => {

        try {
            const response = await apiCaller
                .post('send-loved/api/create-payment-intent', {
                    amount: tipAmount,
                    currency,
                    payment_method_types: [paymentType],
                    connectedAccountId,
                    application_amount_fee
                });
            return response.data;
        } catch (error) {
            handleClientError(error);
        }
    };


    const toTitleCase = str => str?.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    const [getTipAmmountPercent, setGetTipAmountPercent] = useState(17)
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const parentElem = document.querySelector('.MuiSlider-valueLabel');
        const elements = document.querySelector('.MuiSlider-valueLabelLabel');

        if (!parentElem) {
            console.error('Parent element not found');
            return;
        }

        if (!elements) {
            console.error('Elements not found');
            return;
        }
        parentElem.style.background = 'white';
        parentElem.style.color = '#2E266F';
        const feeAmount = (Number(tipAmount) * (Number(getTipAmmountPercent) / 100));
        set_application_amount_fee(feeAmount);

        elements.innerHTML = `$${feeAmount.toFixed(2)} <span style="color:gray">(${getTipAmmountPercent}%)</span>`;
    }, [getTipAmmountPercent, tipAmount]);

    const handleUsernameInput = (event) => {
        const regex = /^[a-zA-Z-]*$/;
        if (!regex.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^a-zA-Z-]/g, '');
        }
    };

    return (
        <>
            <LovedBoxHeader pageLink={pageLink} />
            <div className='mx-auto px-5 max-w-[1495px] flex justify-center items-center'>
                <div className="w-[400px] flex justify-center items-center mx-auto py-10">
                    {
                        pageLoading || lovedLoading ? <div className="flex flex-col items-center justify-center h-[530px]">
                            {
                                !stopLovedLoading && <Lottie
                                    options={defaultOptions}
                                    height={55}
                                    width={60}
                                />
                            }

                            {stopLovedLoading && <Image src={LovedLogo} alt="Loved Logo" width={50} height={47} />}
                            {lovedMsg && <p className="mt-3 text-[#2E266F] text-center text-4xl">Your message <br /> has been sent</p>}
                        </div>
                            :
                            <div className="flex flex-col items-center justify-center">
                                <Image src={LovedLogo} alt="Loved Logo" width={50} height={47} />
                                <h2 className="mt-3 text-4xl text-center text-[#2E266F]">Send Love</h2>
                                <p className="my-3 text-[12px] text-[#586580] plus-jakarta-sans-font-face leading-4 text-center">Find them by searching their first and last name. Don’t worry <br /> if they’re not already on Loved, we’ll help you set them up.</p>


                                <form onSubmit={handleSubmit(onSubmit)} method="POST" encType="multipart/form-data">
                                    <div className="form-group relative">
                                        <input value={inputValue && toTitleCase(inputValue)}
                                            {...register("inputValue")}
                                            onChange={handleChange}
                                            className={`w-[330px] focus:outline-none  bg-[#F1F1F1] pl-10 p-3 ${filteredSuggestions.length > 0 ? "rounded-t-[25px] rounded-tl-[25px] rounded-tr-[25px]" : "rounded-full"}`}
                                            type="text"
                                            placeholder="Find or add a loved one" />
                                        <Image src={SearchBar} alt="Search Bar" width={17} height={17} className="absolute top-4 left-3" />
                                        {inputValue && <Image onClick={handleClear} src={CloseTextIcon} alt="close" width={17} height={17} className="absolute top-4 right-3 cursor-pointer" />}
                                        {filteredSuggestions.length > 0 && (
                                            <ul className="absolute shadow-sm z-50 left-0 right-0 border-t border-t-[#A5B5D4]  bg-white ">
                                                {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => handleClick(suggestion)}
                                                        className="px-2 pt-2 pb-1 flex gap-2 cursor-pointer border-b-[0.5px] border-[#A5B5D4] bg-[#F1F1F1]"
                                                    >
                                                        <div className="flex items-center">
                                                            {suggestion?.images !== undefined && suggestion?.images.length > 0 ? <Image src={suggestion?.images[0]} alt="Profile Image" width={30} height={30} className="w-10 h-10 rounded-full" /> : <Image src={PlusIcon} alt="Plus Icon" width={20} height={20} />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-[16px] font-medium">{capitalize(suggestion?.first_name)} {" "} {capitalize(suggestion?.last_name)}</p>
                                                            <span className="text-sm text-[#A5B5D4]">
                                                                {suggestion?.additional_info?.city}{suggestion?.additional_info?.city && ", "} {" "} {suggestion?.additional_info?.country === "AU" ? "Australia" : suggestion?.additional_info?.country}
                                                            </span>

                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {errors.inputValue && <p className="text-red-500 text-xs mt-1">{errors.inputValue.message}</p>}
                                    </div>
                                    <div className="form-group relative my-5">
                                        <textarea   {...register("text")} value={text} rows={4} className="w-[330px] bg-[#F1F1F1] rounded-[25px] pl-10 p-3 resize-none" type="text" placeholder="Message" />
                                        <Image src={MessageIcon} alt="Search Bar" width={17} height={17} className="absolute top-4 left-3" />
                                        {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
                                    </div>

                                    <div className="form-group relative">
                                        <input onChange={handleFileChange} type="file" id="file" className="hidden" name="image" />
                                        <label htmlFor="file" className="w-[330px] block  bg-[#F1F1F1] rounded-full pl-10 p-2" type="text" placeholder={`${imageName ? imageName : "Add photo"}`}>
                                            <span className="text-[#c5cad1]">Add photo</span>
                                        </label>
                                        <Image src={CameraIcon} alt="Search Bar" width={17} height={17} className="absolute top-3.5 left-3" />
                                        {previewUrl && <Image src={previewUrl} alt="Preview" width={330} height={250} className="w-[330px] h-[250px] object-cover rounded-[25px] mt-4" />}
                                    </div>

                                    <div className="px-2 py-2  rounded-[25px] mt-5 bg-[#F1F1F1] form-group relative">
                                        <div className=" flex justify-between items-center  ">
                                            <label className="block flex items-center gap-1" type="text"  >
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.5" d="M12.1357 22.1238C17.3322 22.1238 21.5447 17.9113 21.5447 12.7148C21.5447 7.51826 17.3322 3.30566 12.1357 3.30566C6.93916 3.30566 2.72656 7.51826 2.72656 12.7148C2.72656 17.9113 6.93916 22.1238 12.1357 22.1238Z" stroke="#A5B5D4" />
                                                    <g clip-path="url(#clip0_1794_5249)">
                                                        <path d="M11.9991 12.8057C11.5772 12.8057 11.1725 12.9733 10.8742 13.2716C10.5758 13.57 10.4082 13.9746 10.4082 14.3966C10.4082 14.8185 10.5758 15.2232 10.8742 15.5215C11.1725 15.8199 11.5772 15.9875 11.9991 15.9875C12.421 15.9875 12.8257 15.8199 13.1241 15.5215C13.4224 15.2232 13.59 14.8185 13.59 14.3966C13.59 13.9746 13.4224 13.57 13.1241 13.2716C12.8257 12.9733 12.421 12.8057 11.9991 12.8057ZM11.3173 14.3966C11.3173 14.2157 11.3891 14.0423 11.517 13.9145C11.6449 13.7866 11.8183 13.7148 11.9991 13.7148C12.1799 13.7148 12.3534 13.7866 12.4812 13.9145C12.6091 14.0423 12.6809 14.2157 12.6809 14.3966C12.6809 14.5774 12.6091 14.7508 12.4812 14.8787C12.3534 15.0066 12.1799 15.0784 11.9991 15.0784C11.8183 15.0784 11.6449 15.0066 11.517 14.8787C11.3891 14.7508 11.3173 14.5774 11.3173 14.3966Z" fill="#586580" />
                                                        <path d="M14.5111 9.44974L13.0661 7.42383L7.75293 11.6684L7.45838 11.6652V11.6697H7.22656V17.1243H16.772V11.6697H16.3347L15.4647 9.12474L14.5111 9.44974ZM15.3743 11.6697H10.8161L14.2111 10.5125L14.9029 10.2911L15.3743 11.6697ZM13.6129 9.7561L10.1084 10.9506L12.8838 8.73337L13.6129 9.7561ZM8.13565 15.3829V13.4102C8.32742 13.3422 8.50161 13.2323 8.64552 13.0885C8.78942 12.9447 8.89941 12.7706 8.96747 12.5788H15.0311C15.0991 12.7706 15.2091 12.9448 15.353 13.0887C15.4969 13.2326 15.6711 13.3426 15.8629 13.4106V15.3834C15.6711 15.4514 15.4969 15.5614 15.353 15.7053C15.2091 15.8492 15.0991 16.0234 15.0311 16.2152H8.96838C8.90028 16.0232 8.79018 15.8489 8.64612 15.7049C8.50205 15.5609 8.32765 15.4509 8.13565 15.3829Z" fill="#586580" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1794_5249">
                                                            <rect width="10.9091" height="10.9091" fill="white" transform="translate(6.54492 7.12402)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg> Cash Donation <span className="bg-[#CBD3E2] p-1 text-white text-[12px] rounded-lg">{selectedPage?.currency || 'USD'}</span>
                                            </label>
                                            <div>$
                                                <input
                                                    {...register("tipAmount", {
                                                        valueAsNumber: true,
                                                    })}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    value={tipAmount}
                                                    className="w-20 bg-[#F1F1F1] px-2 focus:border-0" placeholder="0" />

                                            </div>

                                        </div>

                                    </div>
                                    {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                                    {tipAmount > 0 && <div className="px-2 py-2  rounded-[25px] mt-5 bg-[#F1F1F1] form-group relative">
                                        <div className=" flex justify-between items-center  ">
                                            <label className="flex items-center gap-1 " type="text" >
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.5" d="M12.1357 22.3504C17.3322 22.3504 21.5447 18.1378 21.5447 12.9413C21.5447 7.74482 17.3322 3.53223 12.1357 3.53223C6.93916 3.53223 2.72656 7.74482 2.72656 12.9413C2.72656 18.1378 6.93916 22.3504 12.1357 22.3504Z" stroke="#A5B5D4" />
                                                    <path d="M12.4432 8.58765C13.0341 8.16219 13.7196 7.94947 14.4937 7.94947C14.9191 7.94947 15.3859 8.06174 15.8941 8.2981C16.4023 8.52856 16.8041 8.80038 17.0996 9.11356C17.7082 9.86992 17.9623 10.7504 17.8737 11.7549C17.7791 12.7595 17.4482 13.5454 16.875 14.1008L12.39 18.5858C12.2777 18.6981 12.1359 18.7513 11.9705 18.7513C11.805 18.7513 11.6691 18.6981 11.5568 18.5858C11.5022 18.532 11.4593 18.4675 11.4308 18.3963C11.4023 18.3251 11.3889 18.2488 11.3914 18.1722C11.3914 18.0067 11.4446 17.8649 11.5568 17.7527L14.2691 15.0404C14.4168 14.9104 14.4168 14.7745 14.2691 14.6267C14.1214 14.479 13.9855 14.479 13.8555 14.6267L11.1432 17.339C11.0885 17.3941 11.023 17.4372 10.9508 17.4657C10.8786 17.4942 10.8012 17.5074 10.7237 17.5045C10.5582 17.5045 10.4223 17.4513 10.31 17.339C10.2554 17.2852 10.2125 17.2207 10.184 17.1495C10.1555 17.0783 10.1421 17.002 10.1446 16.9254C10.1446 16.7599 10.1977 16.6181 10.31 16.5058L13.0223 13.7936C13.1818 13.6458 13.1818 13.4981 13.0223 13.3504C12.8864 13.2026 12.7564 13.2026 12.6087 13.3504L9.89638 16.0922C9.84107 16.1464 9.77544 16.189 9.70338 16.2174C9.63131 16.2459 9.55428 16.2595 9.47684 16.2577C9.31138 16.2577 9.16956 16.2045 9.04547 16.0922C8.92729 15.9799 8.8682 15.844 8.8682 15.6786C8.8682 15.5131 8.9332 15.3654 9.0632 15.2354L11.7814 12.5172C11.9291 12.3695 11.9291 12.2336 11.7814 12.1036C11.6337 11.9736 11.4918 11.9736 11.3618 12.1036L8.62002 14.8277C8.49002 14.9458 8.35411 15.0108 8.20638 15.0108C8.04093 15.0108 7.89911 14.9517 7.79274 14.8277C7.68047 14.7095 7.62138 14.5676 7.62138 14.4022C7.62138 14.2367 7.68047 14.1008 7.79274 13.9886C9.60093 12.1686 10.7177 11.0695 11.1432 10.6617L13.2468 12.7417C13.4773 12.9604 13.7432 13.0726 14.0682 13.0726C14.4818 13.0726 14.8068 12.9072 15.0491 12.5763C15.2146 12.334 15.2737 12.0681 15.2264 11.7726C15.1791 11.4772 15.055 11.229 14.8541 11.0222L12.4432 8.58765ZM13.6605 12.3281L11.1432 9.80492L6.95956 13.9886C6.4632 13.4863 6.17956 12.7181 6.11456 11.6722C6.04956 10.6322 6.3332 9.7281 6.95956 8.97174C7.66274 8.27447 8.50184 7.91992 9.47684 7.91992C10.4577 7.91992 11.2909 8.27447 11.9705 8.97174L14.4937 11.4949C14.6059 11.6072 14.6591 11.7431 14.6591 11.9086C14.6591 12.074 14.6059 12.2158 14.4937 12.3281C14.3814 12.4345 14.2455 12.4936 14.0682 12.4936C13.9087 12.4936 13.7727 12.4345 13.6605 12.3281Z" fill="#586580" />
                                                </svg>
                                                Tip the loved service <span className="bg-[#CBD3E2] p-1 text-white text-[12px] rounded-lg">{selectedPage?.currency || 'USD'}</span>
                                            </label>
                                        </div>
                                        <div>
                                            <span className="text-[#9AA3B1] text-[12px] mb-5">
                                                Support our service which we offer at no charge to you
                                            </span>
                                            {/* <input type="range" className="w-full" /> */}
                                            <Slider
                                                aria-label="tip_amount"
                                                defaultValue={17}
                                                // getAriaValueText={valuetext}
                                                onChange={(e, v) => {
                                                    setGetTipAmountPercent(v)
                                                }}
                                                valueLabelDisplay="on"
                                                className="mt-10 h-1"
                                                step={1}
                                                min={0}
                                                max={100}
                                            />
                                        </div>
                                    </div>}

                                    <div className="relative mt-5 bg-[#F1F1F1] p-4 rounded-[25px] max-w-[330px] flex items-center">
                                        <div className="flex items-center">
                                            <Image src={MansIcon} alt="Info" className="mr-2" width={17} height={17} />
                                            <span className="text-[#2E266F]">From</span>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="form-group relative mb-2">
                                                <input value={username}
                                                    {...register('username', {
                                                        pattern: {
                                                            value: /^[a-zA-Z-]+$/,
                                                            message: 'Only letters and hyphens are allowed',
                                                        },
                                                    })}
                                                    onInput={handleUsernameInput}
                                                    className={`w-full bg-[#F1F1F1] pl-4 p-2 rounded-full text-right`}
                                                    type="text"
                                                    placeholder="Name"
                                                />

                                            </div>
                                            <div className="form-group relative">
                                                <input value={email}
                                                    {...register('email')}
                                                    className={`w-full bg-[#F1F1F1] pl-4 p-2 rounded-full text-right`}
                                                    type="email"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}

                                    {/* cards elements */}

                                    {/* {Number(tipAmount) > 0 && */}
                                    <div className='form-group relative mt-5 bg-[#F1F1F1] px-2 py-4 rounded-[25px] max-w-[330px]'>
                                        <p className='text-[#2E266F] mb-1 flex itemx-center gap-1'>
                                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.5" d="M12.1357 21.8035C17.3322 21.8035 21.5447 17.5909 21.5447 12.3944C21.5447 7.19795 17.3322 2.98535 12.1357 2.98535C6.93916 2.98535 2.72656 7.19795 2.72656 12.3944C2.72656 17.5909 6.93916 21.8035 12.1357 21.8035Z" stroke="#A5B5D4" />
                                                <g clip-path="url(#clip0_1797_6293)">
                                                    <path d="M6.98672 10.2579H17.013V9.83323C17.013 8.8929 16.5337 8.41797 15.5794 8.41797H8.42029C7.46613 8.41797 6.98652 8.8929 6.98652 9.83342L6.98672 10.2579ZM6.98672 14.6868C6.98672 15.6273 7.46594 16.0976 8.42029 16.0976H15.5794C16.5335 16.0976 17.0131 15.6273 17.0131 14.6868V11.2945H6.98633L6.98672 14.6868ZM8.51165 13.5727V12.728C8.51165 12.4724 8.6897 12.2897 8.95912 12.2897H10.0777C10.3471 12.2897 10.5252 12.4724 10.5252 12.728V13.5727C10.5252 13.833 10.3471 14.011 10.0777 14.011H8.95893C8.68951 14.011 8.51165 13.833 8.51165 13.5727Z" fill="#586580" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1797_6293">
                                                        <rect width="10.9091" height="10.9091" fill="white" transform="translate(6.54492 6.80371)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                            Credit or Debit Payment Information</p>
                                        <div className="form-group p-2 my-2">
                                            <CardNumberElement

                                                options={{ ...CARD_ELEMENT_OPTIONS, placeholder: 'Card Number' }}
                                            />
                                        </div>
                                        <div className="my-2">
                                            <div className="flex justify-between  p-2">
                                                <div className='w-1/2 '>
                                                    <CardExpiryElement
                                                        options={{ ...CARD_ELEMENT_OPTIONS, placeholder: 'Expiry' }}

                                                    />

                                                </div>
                                                <div className='w-[20%] '>
                                                    <CardCvcElement
                                                        options={{ ...CARD_ELEMENT_OPTIONS, placeholder: 'CVV' }}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    {/* } */}
                                    {cardsError && <p className="text-red-500 text-xs mt-1">{cardsError}</p>}
                                    <button type="submit" disabled={!stripe || !elements} className="w-full flex items center justify-center gap-2 text-center bg-[#FF318C] text-white block rounded-full mt-3 py-3 hover:bg-[#FF318C]">
                                        {isPaymentProccess && <Loader2 className="mr-2 size-6 animate-spin" />}
                                        Send Love</button>
                                </form>
                            </div>}
                </div>
            </div>
        </>
    )
}
