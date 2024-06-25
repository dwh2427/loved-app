// app/getting-started/page.jsx

import GettingStartedForm from "@/components/form/getting-started";
import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <div className="lg:flex lg:w-screen">
      <div className="lg:flex lg:flex-1 lg:flex-col">
        <div className="mx-auto flex h-[183.13px] w-screen max-w-[766.82px] flex-col items-center justify-center md:hidden">
          <Link
            href="/"
            className="relative h-[118.62px] w-full max-w-[189.98px] md:h-[74.01px] md:max-w-[118.48px]"
          >
            <Image
              src={Logo}
              alt="Image"
              className="object-cover"
              sizes="100vw"
              width={165}
              height={40}
            />
          </Link>
        </div>
        <Link
          href="/"
          className="mt-[70px] hidden md:mx-auto md:flex md:w-[118.48px]"
        >
          <div className="relative md:w-[118.48px] mt-20">
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
        <GettingStartedForm />
      </div>
      <Sidebar />
    </div>
  );
}
