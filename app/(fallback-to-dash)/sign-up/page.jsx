import SignUpForm from "@/components/form/sign-up";
import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import FallbackToDashboard from "../layout";

export default function SignUpPage() {
  return (
    <FallbackToDashboard>
      <div className="lg:flex lg:w-screen">
        <div className="lg:flex-1">
          <div className="mx-auto flex w-screen max-w-[766.82px] flex-col items-center justify-center md:hidden">
            <Link
              href="/"
              className="relative w-full max-w-[189.98px] md:h-[74.01px] md:max-w-[118.48px]"
            >
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
            className="mt-[130px] hidden md:mx-auto md:flex md:w-[118.48px]"
          >
            <div className="relative md:w-[118.48px]">
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
          <div className="md:mx-auto mt-10 md:h-[646px] md:w-[530px] md:space-y-[16px] md:rounded-[16px] md:px-[64px]">
            <div className="md:mx-auto md:h-[70px] md:w-[402px] md:space-y-[10px] md:relative">
              <h2 className="mx-auto max-h-[40px] whitespace-nowrap text-center text-[40px] font-black leading-[40px] tracking-[0.01em] text-black md:max-w-none md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:text-[40px] md:leading-[40px]">
                Let&apos;s create your account
              </h2>
              <p className="mx-auto md:absolute md:bottom-0 mt-[41.41px] max-h-[38px] w-40 max-w-[582.39px] text-center text-[32.36px] font-medium leading-[37.53px] text-[#004318] md:h-[20px] md:w-[402px] md:text-[18px] md:font-normal md:leading-[20px]">
                Sign Up
              </p>
            </div>
            <p className="mx-auto mt-[41.41px] h-[30px] w-full max-w-[689.17px] self-start text-[25.88px] leading-[29.12px] md:h-[14px] md:max-w-[386px] md:text-[12px] md:leading-[14.4px]">
              Already have an account?{" "}
              <Link href={"/login"} className="font-bold">
                Sign in
              </Link>
            </p>
            <SignUpForm />
          </div>
        </div>
        <Sidebar />
      </div>
    </FallbackToDashboard>
  );
}
