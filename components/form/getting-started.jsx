"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";

export default function GettingStartedForm() {
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMemberTypeChange = (event) => {
    setSelectedMemberType(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1));
    router.push(`/getting-started/${selectedMemberType}`);
    setLoading(false);
  };
  return (
    <div className="md:mx-auto md:mt-[22px] md:h-[508px] md:w-[591px] md:rounded-[16px] md:p-16">
      <div className="md:mx-auto md:h-[70px] md:w-[402px] md:space-y-[10px]">
        <h2 className="mx-auto max-h-[65px] max-w-[325px] whitespace-nowrap text-center text-[48.53px] font-black leading-[64.71px] tracking-[0.01em] text-black md:h-[40px] md:w-max md:text-[40px] md:leading-[40px] md:tracking-normal">
          Getting Started
        </h2>
        <p className="mx-auto mt-[41.41px] h-auto max-w-[582.39px] text-center text-[32.36px] font-medium leading-[37.53px] text-[#650031] md:h-[20px] md:w-max md:text-[18px] md:font-normal md:leading-[20px]">
          We&apos;re here to guide you on the Loved journey
        </p>
      </div>
      <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] md:mt-[46px] md:w-full md:whitespace-nowrap md:text-[25px]">
        Who are you creating a loved page for?
      </h3>
      <div className="grid place-items-center">
        <Label className="w-full cursor-pointer">
          <Input
            type="radio"
            className="peer sr-only"
            name="memberType"
            value="yourself"
            onChange={handleMemberTypeChange}
          />
          <div className="mx-auto mt-4 h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-transparent px-[51.77px] py-[32.36px] text-center text-[32.36px] font-bold leading-[37.53px] text-[#000000]/70 ring-[1px] ring-[#000000]/70 transition-all focus:bg-transparent focus-visible:ring-[1px] focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 peer-checked:bg-[#650031]/5 peer-checked:text-[#650031] peer-checked:ring-[2px] peer-checked:ring-[#650031] dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:leading-[22px]">
            Yourself
          </div>
        </Label>
        <Label className="w-full cursor-pointer">
          <Input
            type="radio"
            className="peer sr-only"
            name="memberType"
            value="family-member"
            onChange={handleMemberTypeChange}
          />
          <div className="mx-auto mt-4 h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-transparent px-[51.77px] py-[32.36px] text-center text-[32.36px] font-bold leading-[37.53px] text-[#000000]/70 ring-[1px] ring-[#000000]/70 transition-all focus:bg-transparent focus-visible:ring-[1px] focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 peer-checked:bg-[#650031]/5 peer-checked:text-[#650031] peer-checked:ring-[2px] peer-checked:ring-[#650031] dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:leading-[22px]">
            Family Member
          </div>
        </Label>
        <Label className="w-full cursor-pointer">
          <Input
            type="radio"
            className="peer sr-only"
            name="memberType"
            value="friend"
            onChange={handleMemberTypeChange}
          />
          <div className="mx-auto mt-4 h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-transparent px-[51.77px] py-[32.36px] text-center text-[32.36px] font-bold leading-[37.53px] text-[#000000]/70 ring-[1px] ring-[#000000]/70 transition-all focus:bg-transparent focus-visible:ring-[1px] focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 peer-checked:bg-[#650031]/5 peer-checked:text-[#650031] peer-checked:ring-[2px] peer-checked:ring-[#650031] dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:leading-[22px]">
            Friend
          </div>
        </Label>
        <Button
          onClick={handleSubmit}
          variant={"default"}
          disabled={!selectedMemberType || loading}
          className={`mx-auto mt-[86px] h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50 md:h-[62px] md:w-[384px] md:rounded-[100px] md:px-[25px] md:py-[20px] md:text-center md:text-[18px] md:font-black md:leading-[22px] ${selectedMemberType ? "" : "cursor-not-allowed"}`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
