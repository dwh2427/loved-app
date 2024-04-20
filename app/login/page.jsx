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
        className="mx-auto flex h-[183.13px] w-screen max-w-[766.82px] flex-col items-center justify-center"
      >
        <div className="relative h-[118.62px] w-full max-w-[189.98px]">
          <Image
            src={Logo}
            alt="Image"
            className="object-cover"
            fill
            sizes="100vw"
          />
        </div>
      </Link>
      <h2 className="mx-auto max-h-[65px] max-w-[325px] whitespace-nowrap text-center text-[48.53px] font-black leading-[64.71px] tracking-[0.01em] text-black">
        Welcome back
      </h2>

      <p className="mx-auto mt-[41.41px] max-h-[38px] w-40 max-w-[582.39px] text-center text-[32.36px] font-medium leading-[37.53px] text-black">
        Sign in
      </p>
      <LoginForm />
      <p className="mt-[41.41px] h-[30px] w-full max-w-[689.17px] self-start px-5 text-[25.88px] font-bold leading-[29.12px]">
        Forgot Password?
      </p>
      <p className="mt-[41.41px] w-full max-w-[689.17px] px-5 text-[25.88px] leading-[29.12px]">
        By clicking the Sign In button below, you agree to the Loved{" "}
        <span className="border-b-[0.5px] border-black">Terms of Service</span>
        and acknowledge the{" "}
        <span className="border-b-[0.5px] border-black">Privacy Notice</span>.
      </p>
      <p className="mt-[41.41px] h-[30px] w-full max-w-[689.17px] self-start px-5 text-[25.88px] leading-[29.12px]">
        Don&apos;t have an account?{" "}
        <Link href={""} className="font-bold">
          Sign up
        </Link>
      </p>
      <div className="px-5">
        <Button
          variant={"default"}
          className="mb-[42.24px] mt-[41.41px] h-[102.71px] w-full max-w-[625.75px] rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[32.36px] text-center text-[32.36px] font-black leading-[37.53px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50"
        >
          Sign in
        </Button>
      </div>
    </>
  );
}
