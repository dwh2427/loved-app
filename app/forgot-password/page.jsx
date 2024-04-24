import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import ForgotPasswordForm from "@/components/form/forgot-password";

export default function ForgotPasswordPage() {
  return (
    <div className="relative h-screen md:px-[10px] md:pb-[10px] md:pt-[70px]">
      <div className="mx-auto flex h-[183.17px] w-screen max-w-[767px] flex-col items-center justify-center md:hidden">
        <Link href="/" className="relative h-[118.65px] w-[189.94px]">
          <Image
            src={Logo}
            alt="Image"
            className="object-cover"
            fill
            sizes="100vw"
          />
        </Link>
      </div>
      <div className="mx-auto hidden h-[74.01px] w-screen max-w-[118.48px] flex-col items-center justify-center md:flex">
        <Link href="/" className="relative h-[74.01px] w-[118.48px]">
          <Image
            src={Logo}
            alt="Image"
            className="object-cover"
            fill
            sizes="100vw"
          />
        </Link>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
