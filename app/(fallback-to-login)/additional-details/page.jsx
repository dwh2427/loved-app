import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import AdditionalDetailsForm from "./(components)/Forms";

export default function FamilyMemberPage({ params }) {

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
                <AdditionalDetailsForm params={params} />
            </div>
            <Sidebar />
        </div>
    );
}
