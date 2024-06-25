'use client'
import useAuthState from '@/hooks/useAuthState';
import loveLogo from '@/public/lovedLogo.svg';
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ProfileDropdown from '../button/profile-dropdown';

export default function Header() {
    const { user } = useAuthState();
    const pathname = usePathname().split('/')[1];
    const expectedPath = ["send-loved", "getting-started"];
    if (pathname !== "send-loved") {
        typeof window !== 'undefined' && localStorage.removeItem("comment_page_name")
        typeof window !== 'undefined' && localStorage.removeItem("comment_user_name")
        typeof window !== 'undefined' && localStorage.removeItem("comment_page_id")
    }
    return (
        <>

            {
                !expectedPath.includes(pathname) ?
                    <header className="flex shadow-md h-24 items-center xl:h-[126px] w-full px-10">
                        <div className="max-w-[1495px] mx-auto flex h-[74px] items-center justify-between w-full">

                            <Link href="/find-loved" className="search-loved relative cursor-pointer">
                                <svg className="size-4 absolute left-2 top-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <p className="w-full cursor-pointer px-10 py-1 pl-7 pr-1 text-[18px] font-[500] leading-[15px] text-[#586580] outline-none">Find Someone Loved</p>
                            </Link>

                            <Link href="/" className="flex gap-1">
                                <Image src={loveLogo} alt="loved" width={170} height={40} />
                            </Link>

                            <div className="hidden h-[62px] flex-shrink-0 items-center gap-x-[32px] md:flex">
                                {pathname === "dashboard" ? <ProfileDropdown /> : <>
                                    {user ?
                                        (
                                            <Link
                                                href={"/dashboard"}
                                                className="text-center text-[18px] font-[900] leading-[22px] text-black"
                                            >
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                href={"/login"}
                                                className="w-[54px] text-center text-[18px] font-[900] leading-[22px] text-black"
                                            >
                                                Sign in
                                            </Link>
                                        )}

                                    <Link
                                        href="/getting-started"
                                        className="self-center whitespace-nowrap rounded-full border-[#FF007A] border px-[20px] py-[10px] text-[18px] font-[900] text-[#FF007A] hover:bg-[#FF007A] hover:text-white focus:bg-[#FF007A] focus:text-white focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50"
                                    >
                                        Start Loved page
                                    </Link></>}
                            </div>

                            <button className="md:hidden">
                                <Menu className="size-10" />
                            </button>

                        </div>
                    </header>
                    :
                    ""

            }
        </>
    );
}
