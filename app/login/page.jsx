import LoginForm from "@/components/form/login";
import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import FallbackToDashboard from "../(fallback-to-dash)/layout";

export default function LoginPage() {
  return (
    <FallbackToDashboard>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex-1 flex flex-col items-center lg:items-start">
          <div className="mx-auto h-[183.13px] w-full max-w-[766.82px] flex flex-col items-center justify-center lg:hidden">
            <Link href="/" className="relative h-[118.62px] w-full max-w-[189.98px]">
              <Image
                src={Logo}
                alt="Image"
                className="object-cover"
                width={165}
                height={40}
                sizes="100vw"
              />
            </Link>
          </div>
          <Link
            href="/"
            className="mt-[150px] hidden lg:mx-auto lg:flex lg:h-[74.01px] lg:w-[118.48px]"
          >
            <div className="relative h-[74.01px] w-[118.48px]">
              <Image
                src={Logo}
                alt="Image"
                className="object-cover"
                width={165}
                height={40}
                sizes="100vw"
              />
            </div>
          </Link>
          <div className="w-full px-4 lg:px-0 lg:mx-auto lg:w-[530px] lg:space-y-[16px] lg:rounded-[16px] lg:px-16">
            <div className="lg:h-[70px] lg:w-[402px] lg:space-y-[10px] text-center">
              <h2 className="mx-auto max-h-[65px] max-w-[325px] whitespace-nowrap text-[32px] font-black leading-[40px] tracking-[0.01em] text-black lg:h-[40px] lg:w-[263px] lg:text-[40px] lg:leading-[40px]">
                Welcome back
              </h2>
              <p className="mx-auto mt-[20px] max-h-[38px] max-w-[582.39px] text-[18px] font-medium leading-[22px] text-black lg:h-[20px] lg:w-[402px] lg:text-[18px] lg:font-normal lg:leading-[20px]">
                Sign in
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
        <Sidebar />
      </div>
    </FallbackToDashboard>
  );
}
