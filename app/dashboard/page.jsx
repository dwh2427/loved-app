import DashBoardHeader from "@/components/DashboardHeader.jsx";
import LogoutButton from "./LogoutButton.jsx";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <DashBoardHeader />
      <div className="mx-auto mt-[71px] h-[258px] w-full max-w-[530px] p-16">
        <div className="h-full w-full flex flex-col justify-center gap-y-[10px]">
          <div className="mx-auto h-[40px] max-w-[91px] text-center text-[40px] font-black leading-[40px]">
            Dash
          </div>
          <Link
            href="/change-email"
            className="h-[20px] text-center w-max mx-auto text-[18px] leading-[20px] text-[#004318]"
          >
            Change Email
          </Link>
          <Link
            href="/change-password"
            className="h-[20px] text-center w-max mx-auto text-[18px] leading-[20px] text-[#004318]"
          >
            Change Password
          </Link>
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
