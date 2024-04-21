import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <>
      <Link
        href="/"
        className="mx-auto flex h-[183.13px] w-screen max-w-[766.82px] flex-col items-center justify-center md:hidden"
      >
        <div className="relative h-[118.62px] w-full max-w-[189.98px] md:h-[74.01px] md:max-w-[118.48px]">
          <Image
            src={Logo}
            alt="Image"
            className="object-cover"
            fill
            sizes="100vw"
          />
        </div>
      </Link>
      <Link
        href="/"
        className="mt-[70px] hidden md:mx-auto md:flex md:h-[74.01px] md:w-[118.48px]"
      >
        <div className="relative md:h-[74.01px] md:w-[118.48px]">
          <Image
            src={Logo}
            alt="Image"
            className="object-cover"
            fill
            sizes="100vw"
          />
        </div>
      </Link>
      <div className="md:mx-auto md:mt-[22px] md:h-[592px] md:w-[530px] md:space-y-[16px] md:rounded-[16px] md:p-16">
        <div className="md:h-[70px] md:w-[402px] md:space-y-[10px]">
          <h2 className="mx-auto max-h-[65px] max-w-[325px] whitespace-nowrap text-center text-[48.53px] font-black leading-[64.71px] tracking-[0.01em] text-black md:h-[40px] md:w-[263px] md:text-[40px] md:leading-[40px]">
            Welcome back
          </h2>
          <p className="mx-auto mt-[41.41px] max-h-[38px] w-40 max-w-[582.39px] text-center text-[32.36px] font-medium leading-[37.53px] text-black md:h-[20px] md:w-[402px] md:text-[18px] md:font-normal md:leading-[20px]">
            Sign in
          </p>
        </div>
        <LoginForm />
      </div>
    </>
  );
}
