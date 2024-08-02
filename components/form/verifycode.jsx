"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import axios from 'axios';

const Verifycode = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const [phone, setPhone] = useState("");
  useEffect(() => {
    // Retrieve phone number from local storage
    const storedPhone = localStorage.getItem('phone');
    if (storedPhone) {
      setPhone(storedPhone);
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
    const paste = e.clipboardData.getData("text");
    if (!isNaN(paste) && paste.length === 6) {
      const newCode = paste.split("");
      setCode(newCode);
      inputRefs.current[newCode.length - 1].focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Add your submission logic here
     console.log("Submitted code:", code.join(""));
    
        try {
          alert(1);
          const response = await axios.post('/login/verify-otp/api', { code: code.join(""), phone });
          
          if (response.status === 200) {
            sessionStorage.setItem("user", true);
            localStorage.setItem('accToken', await res.data.token)
            router.push("/dashboard");

          } else {
            console.error("Failed to verify OTP:", response.data);
            throw new Error('Failed to verify OTP');
          }
        } catch (error) {
          console.error("Error during OTP verification:", error);
          // You can display an error message to the user here
        } finally {
          setLoading(false);
        }
      };
  const isButtonDisabled = code.some(digit => digit === "");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-center otp-header-text mt-9">
        Enter verification code
      </h2>

      <small className="code-sent-to">Code sent to (917) 470 2387</small>

      <div onPaste={handlePaste} className="flex gap-2 mt-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-[52px] h-[50px] text-center text-2xl rounded-[32px] border border-[#2E266F] focus:outline-none"
          />
        ))}
      </div>
      <a href="#" className="resend-code">Resend code</a>

      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={isButtonDisabled || loading}
        variant={"default"}
        className="mx-auto h-[58px] w-full max-w-[625.75px] text-base font-semibold rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:leading-[22px]"
      >
        {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
        Continue
      </Button>
    </div>
  );
};

export default Verifycode;
