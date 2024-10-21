'use client'
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import Heart from "@/public/assets/img/heart.svg";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function VerifyOtp({ isOpen, setOnCloseOtp, setChangeNumber}) {
  const [pageLink, setPageLink] = useState("");
  const [code, setCode] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { toast } = useToast();
  const router = useRouter();
  
  const [phone, setPhone] = useState("");
  useEffect(() => {
    // Retrieve phone number from local storage
    const storedPhone = localStorage.getItem('phone');
    if (storedPhone) {
      setPhone(storedPhone);
    }
    // Focus on the first input field when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input
      if (value !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === "") {
      // Move focus to the previous input if it's empty
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!isNaN(paste) && paste.length === 4) {
      const newCode = paste.split("");
      setCode(newCode);
  
      // Focus on the last input field after pasting
      inputRefs.current[newCode.length - 1].focus();
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      // Make the POST request and await the response
      const response = await axios.post('/login/api', { phone });

      setCode(new Array(4).fill(""));
      // Check if the status code and response message indicate success
      if (response.status === 200 ) {
        toast({
          variant: "success",
          title: "Successfully send otp!",
          description: response.message,
        });

      } else {

        toast({
          variant: "destructive",
          title: "Error!",
          description: response.message,
        });
      }
      // Focus on the first input field after resending OTP
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (e) {
      // Handle any other errors that occur during the request
      console.error('Error sending OTP:', e.message);
      toast({
        variant: "destructive",
        title: "Error!",
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const response = await axios.post('/login/verify-otp/api', { code: code.join(""), phone });

        if (response.status === 200) {
            sessionStorage.setItem("user", true);
            localStorage.setItem('accToken', response.data.token);

            const redirectUrl = localStorage.getItem('sendLoveUrl') || '/';
            // Remove the URL from localStorage
            localStorage.removeItem('sendLoveUrl');

            window.location.href = redirectUrl;
            
        } else {
            toast({
                variant: "destructive",
                title: "Something wrong!",
            });
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "OTP verification failed! Please resend OTP and try again!",
        });
    } finally {
        setLoading(false);
    }
  };

  const isButtonDisabled = code.some(digit => digit === "");
  return (
    <>


      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 custom-popup custom-overlay">
        <div className="flex lg:w-[64rem] lg:h-[40.4rem] mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
          {/* Left Side - Form Content */}
          <div className="flex-1 flex flex-col items-start lg:items-start left-side-content">
            {/* Logo for mobile only */}
            <div className=" flex flex-col w-full max-w-[766.82px] items-center justify-center otp-logo-div">
              <Link href="/" className="relative max-[600px]:h-[182.62px] w-full max-[600px]:max-w-[189.98px]">
                <Image
                  src={Logo}
                  alt="Image"
                  className="object-cover max-[600px]:w-[50%] md:h-[100%] md:w-[25%] lg:h-[95%] lg:w-[26%] logo-img"
                  width={165}
                  height={40}
                  sizes="100vw"
                />
              </Link>
            </div>

            {/* Form and Verify Code Section */}
            <div className="w-full lg:w-[530px]  lg:rounded-[16px] verify-code-section">

            <div className="flex flex-col justify-center px-4">
            <h2 className="text-start otp-header-text flex flex-col items-start verify-text">
              Verify your number
            </h2>

            <small className="text-start code-sent-to inline-flex items-center space-x-1 show-min-1025">
              <span>Code sent to +{phone}</span><small className="changText cursor-pointer"><button   onClick={() => setChangeNumber(true)}>Change number?</button></small>
            </small>

            <small className="text-start code-sent-to space-x-1 show-max-1024">
              <span>Code sent to +{phone}</span>
              <p>
                <small className="changText cursor-pointer">
                  <a href="#">Change number?</a>
                </small>
              </p>

            </small>

            <div onPaste={handlePaste} className="flex gap-2 mt-4 otp-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="tel" // Change type to "tel"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-[52px] h-[50px] text-center text-2xl rounded-[32px] border border-[#2E266F] focus:outline-none otpBtn"
                />
              ))}
            </div>


              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isButtonDisabled || loading}
                variant={"default"}
                className="otp-sign-in mx-auto h-[40px] w-full max-w-[625.75px] text-base font-semibold rounded-[64.71px] bg-[#FF007A] hover:bg-[#FF318C] focus:bg-[#FF318C] px-[51.77px] py-[32.36px] text-center text-[14px] leading-[37.53px] text-[#FEFFF8] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[40px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[14px] md:leading-[22px] mt-8"
              >
                {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
                Sign In
              </Button>
              <a href="#"  onClick={resendOtp} className="resendBtn">Resend code</a>
            </div>

            </div>
          </div>

          {/* Right Side - Cover Image */}
          <div className="otp-right-side w-full lg:w-1/2 flex flex-col justify-center items-center img w-[350px] h-[350px] lg:w-[512px] lg:h-[598px] bg-cover bg-center rounded-lg login-popup-padding relative" style={{ backgroundImage: 'linear-gradient(180deg, rgba(189, 183, 255, 0.00) 50%, #978EFA 100%), url(/assets/img/covers/signCoverImg.png)', }} >
          <div className="text-on-image bg-white absolute lg:mr-5">
            <Image
                  src={Heart}
                  alt="Heart"
                  width={20}
                  height={20}
                />
            <span className="">You just received love!</span>
          </div>
      </div>
        </div>
      </div>

  </>
  );
}
