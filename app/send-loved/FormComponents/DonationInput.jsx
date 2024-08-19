import { Slider } from "@mui/material";
import Image from "next/image";
import {useState, useEffect } from "react";
import useApiCaller from "@/hooks/useApiCaller";
import { Loader2 } from "lucide-react";

export default function DonationInput({
  selectedPage,
  register,
  tipAmount,
  handleInputChange,
  errorMessage,
  setGetTipAmountPercent,
  getTipAmmountPercent,
  set_application_amount_fee,
  setClientSecret, 
  setFormStep, // Ensure this is correctly passed
  setErrorMessage,
  trigger // Trigger validation manually
}) {
  const apiCaller = useApiCaller();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate the total amount (tipAmount + percentage amount)
  const applicationFeeAmount = (tipAmount * getTipAmmountPercent) / 100;
  const totalAmount = tipAmount + applicationFeeAmount;

  useEffect(() => {
    // Optionally, update the application fee or any other state based on the total amount
    set_application_amount_fee(applicationFeeAmount);
  }, [applicationFeeAmount, set_application_amount_fee]);
  
  const handleContinueClick =  async () => {
    try {
      const isValid = await trigger(); // Validate all fields
      if (!isValid) return; // If validation fails, stop execution
      setIsLoading(true);
      if(tipAmount> 0){
        if (tipAmount < 5) {
          setErrorMessage("The minimum donation amount is 5.");
          return;
        }
  
        const response = await apiCaller.post(
          "send-loved/FormComponents/api",
          {
            tipAmount,
            applicationFeeAmount,
            currency: selectedPage?.currency || "USD", // Include currency if needed
          }
        );
  
        // Ensure you are accessing the correct part of the response object
        const clientSecret = response?.data?.clientSecret || response?.clientSecret;
        setIsLoading(false);
        if (!clientSecret) {
       
          throw new Error("Client secret not found in the response");
        }
        
      setClientSecret(clientSecret);
      setFormStep(2);  
      }

  
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating payment intent:", error);
    }

            // Navigate to step 2
  };

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

  

  return (
    <>
      <div className="form-group relative mt-5 rounded-[25px] bg-[#F1F1F1] px-2 py-2">
        <div className="flex items-center justify-between">
          <label className="block flex items-center gap-1" type="text">
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
              {...register("tipAmount", { valueAsNumber: true })}
              onChange={(e) => {
                handleInputChange(e); // Call the existing handler
              }}
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
        <div className="form-group relative mt-5 rounded-[25px] bg-[#F1F1F1] px-2 py-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1" type="text">
              <Image src="/tip.svg" alt="tip" width={24} height={25} />
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
            <Slider
              aria-label="tip_amount"
              defaultValue={getTipAmmountPercent || 17}
              onChange={(e, v) => setGetTipAmountPercent(v)}
              valueLabelDisplay="on"
              className="mt-10 h-1"
              step={1}
              min={0}
              max={100}
            />
          </div>


        </div>
      )}
        <button
            type="button"
            className="items center mt-3 block flex w-full justify-center gap-2 rounded-full bg-[#FF318C] py-3 text-center text-white hover:bg-[#FF318C]"
            onClick={handleContinueClick}
          >
           {isLoading && <Loader2 className="mr-2 size-6 animate-spin" />}
             Continue
        </button>
    </>
  );
}
