import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";
import SignUpForm from "@/components/form/sign-up";
import Sidebar from "@/components/sidebar/sidebar";

export default function SignUpPage() {
  return (
    <>
      <div className="lg:flex lg:w-screen">
        <div className="lg:flex-1">
          <div className="mx-auto flex h-[183.13px] w-screen max-w-[766.82px] flex-col items-center justify-center md:hidden">
            <Link
              href="/"
              className="relative h-[118.62px] w-full max-w-[189.98px] md:h-[74.01px] md:max-w-[118.48px]"
            >
              <Image
                src={Logo}
                alt="Image"
                className="object-cover"
                fill
                sizes="100vw"
              />
            </Link>
          </div>
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
          <div className="md:mx-auto md:mt-[86px] md:h-[592px] md:w-[530px] md:space-y-[16px] md:rounded-[16px] md:p-0">
            <div className="md:mx-auto md:h-[70px] md:w-[402px] md:space-y-[10px]">
              <h2 className="mx-auto max-h-[40px] max-w-[169px] whitespace-nowrap text-center text-[40px] font-black leading-[40px] tracking-[0.01em] text-black md:h-[40px] md:w-[263px] md:text-[40px] md:leading-[40px]">
                Welcome
              </h2>
              <p className="mx-auto mt-[41.41px] max-h-[38px] w-40 max-w-[582.39px] text-center text-[32.36px] font-medium leading-[37.53px] text-[#004318] md:h-[20px] md:w-[402px] md:text-[18px] md:font-normal md:leading-[20px]">
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
    </>
  );
}
