import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="relative h-screen">
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
      <ForgotPasswordForm />
    </div>
  );
}
