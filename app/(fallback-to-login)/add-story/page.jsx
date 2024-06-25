import Sidebar from "@/components/sidebar/sidebar";
import Logo from "@/public/lovedLogo.svg";
import Image from "next/image";
import Link from "next/link";
import AddStory from "./(components)/addFields";

export default function AddAttachments() {
    return (
        <>
            <div className="lg:flex lg:w-screen">
                <div className="lg:flex-1">
                    <div className="mx-auto flex w-screen max-w-[766.82px] flex-col items-center justify-center md:hidden">
                        <Link
                            href="/"
                            className="relative w-full max-w-[189.98px] md:max-w-[118.48px]"
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
                        className="mt-[70px] hidden md:mx-auto md:flex md:w-[118.48px]"
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
                    <div className="md:mx-auto md:h-[646px] max-w-fit flex flex-col items-center   md:space-y-[16px] md:rounded-[16px] md:p-[64px]">
                        <div className="md:mx-auto  md:w-[402px]  md:relative">
                            <h2 className="mx-auto whitespace-nowrap text-center text-[25px] font-black ">
                                Add a story to their page
                            </h2>
                        </div>

                        <AddStory />
                    </div>
                </div>
                <Sidebar />
            </div>
        </>
    );
}
