import DashBoardHeader from "@/components/DashboardHeader";
import ChangeEmailForm from "@/components/ChangeEmailForm";
import Session from "./session";

export default function page() {
  return (
    <>
      <Session />
      <DashBoardHeader />
      <div className="mx-auto mt-[71px] max-h-[458px] w-full max-w-[513px] rounded-[16px] p-16">
        <div className="mx-auto h-[40px] max-w-[241px] whitespace-nowrap text-center text-[40px] font-black leading-[40px]">
          Change Email
        </div>
        <ChangeEmailForm />
      </div>
    </>
  );
}
