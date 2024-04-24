import DashBoardHeader from "@/components/header/dashboard";
import Logout from "@/components/button/logout";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <DashBoardHeader />
      <div className="mx-auto mt-[71px] h-[258px] w-full max-w-[530px] p-16">
        <div className="flex h-full w-full flex-col justify-center gap-y-[10px]">
          <div className="mx-auto h-[40px] max-w-[91px] text-center text-[40px] font-black leading-[40px]">
            Dash
          </div>
          <Link
            href="/change-email"
            className="mx-auto h-[20px] w-max text-center text-[18px] leading-[20px] text-[#004318]"
          >
            Change Email
          </Link>
          <Link
            href="/change-password"
            className="mx-auto h-[20px] w-max text-center text-[18px] leading-[20px] text-[#004318]"
          >
            Change Password
          </Link>
          <Logout />
        </div>
      </div>
    </>
  );
}
