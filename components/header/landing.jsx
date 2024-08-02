'use client'
import useAuthState from '@/hooks/useAuthState';
import loveLogo from '@/public/lovedLogo.svg';
import { ChevronDown, ChevronUp, Loader2, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import ProfileDropdown from '../button/profile-dropdown';

export default function Header() {
    const { user, loading } = useAuthState();
    const pathname = usePathname().split('/')[1];
    const expectedPath = ["send-loved", "getting-started", "login"];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSendingOpen, setIsSendingOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const sendingRef = useRef(null);
    const resourcesRef = useRef(null);
    const aboutRef = useRef(null);
    const mobileMenuRef = useRef(null);

    if (pathname !== "send-loved") {
        typeof window !== 'undefined' && localStorage.removeItem("comment_page_name")
        typeof window !== 'undefined' && localStorage.removeItem("comment_user_name")
        typeof window !== 'undefined' && localStorage.removeItem("comment_page_id")
    }

    const handleClickOutside = (event) => {
        // Check if the click is outside the mobile menu or on a link
        if (
            (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) ||
            event.target.tagName === 'A' // Check if clicked element is a link
        ) {
            setIsMobileMenuOpen(false);
        }
        // if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        //     setIsMobileMenuOpen(false);
        // }
        if (sendingRef.current && !sendingRef.current.contains(event.target)) {
            setIsSendingOpen(false);
        }
        if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
            setIsResourcesOpen(false);
        }
        if (aboutRef.current && !aboutRef.current.contains(event.target)) {
            setIsAboutOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const MobileMenuItem = ({ title, isOpen, setIsOpen, children }) => (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-2  hover:bg-gray-100 text-[#2E266F] text-[16px] leading-[17px] plus-jakarta-sans-700 !font-bold"
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && (
                <div className="">
                    {children}
                </div>
            )}
        </div>
    );

    // when scroll then navbar shadow is active
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                document.getElementById('header')?.classList?.add('shadow-md');
            } else {
                document.getElementById('header')?.classList?.remove('shadow-md');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {!expectedPath.includes(pathname) && (
                <header className="flex items-center h-[111px] d-rs-nav-height w-full px-[24px] py-[26px]" id='header'>
                    <div className="max-w-[1495px] mx-auto flex h-[111px] p-[9px] items-center justify-between w-full">

                        <Link href="/find-loved" className="flex gap-1 sm:hidden">
                            <svg className="size-[24px] text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000000" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </Link>

                        <Link href="/" className="flex sm:gap-[90px]">
                            <Image src={loveLogo} alt="loved" width={120} height={30} />
                        </Link>

                        {/* Mobile menu button */}
                        <button className="md:hidden" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
                        </button>

                        {/* Desktop menu */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/find-loved" className="search-loved relative cursor-pointer ">
                                <svg className="size-4 absolute left-2 top-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <p className="w-full cursor-pointer px-10 py-1 pl-7 pr-1 text-[16px] font-[500] leading-[18px] text-[#586580] outline-none">Find Someone Loved</p>
                            </Link>

                            <Link
                                href={"/loved-pages"}
                                className="text-center text-[16px] plus-jakarta-sans-500 leading-[18px] text-[#2E266F]"
                            >
                                Loved Pages
                            </Link>

                            <div ref={sendingRef} className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-between text-center text-[16px] plus-jakarta-sans-500 leading-[18px] ${isSendingOpen ? "text-gray-400" : "text-[#2E266F]"}`}
                                        onClick={() => setIsSendingOpen(!isSendingOpen)}
                                    >
                                        Sending & Receiving
                                        <svg
                                            className={`-mr-1 h-5 w-5 transition-transform transform ${isSendingOpen ? "rotate-180" : "rotate-0"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                        >
                                            <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {isSendingOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <Link
                                                href="javascript:void(0)"
                                                className="block px-4 py-2 leading-5 text-[16px] text-black plus-jakarta-sans-700 !font-bold hover:bg-gray-100"
                                                role="menuitem"
                                                style={{ pointerEvents: 'none', cursor: 'default' }}
                                            >
                                                Sending & Receiving
                                            </Link>

                                            <Link
                                                href="/donation-tips"
                                                className="block px-4 py-2 text-[16px] text-black hover:bg-gray-100 font-[500] leading-[18px]"
                                                role="menuitem"
                                            >
                                                Donation / Tips
                                            </Link>

                                            <Link
                                                href="/loved-notes"
                                                className="block px-4 py-2 text-[16px] text-black hover:bg-gray-100 font-[500] leading-[18px]"
                                                role="menuitem"
                                            >
                                                Loved Notes
                                            </Link>

                                            <Link
                                                href="/flowers"
                                                className="block px-4 py-2 text-[16px] text-black hover:bg-gray-100 font-[500] leading-[18px]"
                                                role="menuitem"
                                            >
                                                Flowers
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div ref={resourcesRef} className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-between text-center text-[16px] plus-jakarta-sans-500 leading-[18px] ${isResourcesOpen ? "text-gray-500" : "text-[#2E266F]"}`}
                                        onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                                    >
                                        <span>Resources</span>
                                        <svg
                                            className={`-mr-1 h-5 w-5 transition-transform transform ${isResourcesOpen ? "rotate-180" : "rotate-0"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                        >
                                            <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {isResourcesOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <Link
                                                href="javascript:void(0)"
                                                style={{ pointerEvents: 'none', cursor: 'default' }}
                                                className="block px-4 py-2 text-[16px] text-black plus-jakarta-sans-700 !font-bold  hover:bg-gray-100 font-[500] leading-[18px]"
                                                role="menuitem"
                                            >
                                                Resources
                                            </Link>

                                            <Link
                                                href="/frequently-asked-questions"
                                                className="block px-4 py-2 text-[16px] hover:bg-gray-100 font-[500] leading-[18px]"
                                                role="menuitem"
                                            >
                                                FAQs
                                            </Link>

                                            <Link
                                                href="/pricing"
                                                className="block px-4 py-2 text-[16px] hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Pricing
                                            </Link>

                                            <Link
                                                href="/help"
                                                className="block px-4 py-2 text-[16px] hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Get help
                                            </Link>

                                            <Link
                                                href="/how-to-guide"
                                                className="block px-4 py-2 text-[16px] hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                How to guide
                                            </Link>

                                            <Link
                                                href="/blog"
                                                className="block px-4 py-2 text-[16px] hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Blog
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div ref={aboutRef} className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-between text-center text-[16px] plus-jakarta-sans-500 leading-4 ${isAboutOpen ? "text-gray-500" : "text-[#2E266F]"}`}
                                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                                    >
                                        <span>About Us</span>
                                        <svg
                                            className={`-mr-1 h-5 w-5 transition-transform transform ${isAboutOpen ? "rotate-180" : "rotate-0"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                        >
                                            <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {isAboutOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <Link
                                                href="javascript:void(0)"
                                                style={{ pointerEvents: 'none', cursor: 'default' }}
                                                className="block px-4 py-2 text-[16px] text-black plus-jakarta-sans-700 !font-bold hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                About Us
                                            </Link>

                                            <Link
                                                href="/who-we-are"
                                                className="block px-4 py-2 text-[16px] text-black hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Who we are
                                            </Link>

                                            <Link
                                                href="/hiring"
                                                className="block px-4 py-2 text-[16px] text-black hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Hiring
                                            </Link>

                                            <Link
                                                href="/press-page"
                                                className="block px-4 py-2 text-[16px] text-black hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Press Page
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                        {/* vertical line */}
                        <div className="w-px h-8 bg-gray-400 d-rs-hidden"></div>

                        {/* Desktop auth buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {loading ? <Loader2 className="mr-2 size-6 animate-spin" /> :user ? (
                                <>
                                    <Link href="/dashboard" className="font-semibold leading-[18px]">Dashboard</Link>
                                    <button onClick={() => {
                                        sessionStorage.removeItem("user");
                                        localStorage.clear();
                                        window.location.replace("/login");
                                    }} className="font-semibold leading-[18px]]">Sign out</button>
                                </>
                            ) : (
                                <Link href="/login" className="font-semibold text-[#586580] leading-[18px]">Sign in</Link>
                            )}
                            <Link
                                href="/getting-started"
                                className="text-[#FF007A] border-[#FF007A] border-[3px] border px-5 py-3 rounded-full font-semibold hover:bg-opacity-90"
                            >
                                Start Loved One
                            </Link>
                        </div>

                        {/* Mobile menu */}
                        <div
                            ref={mobileMenuRef}
                            className={`absolute top-20 left-0 w-full bg-white  overflow-scroll shadow-md z-50 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                        >
                            <div className="flex flex-col px-10 py-6 space-y-4 mb-5">
                                <div className="flex flex-col items-center gap-4">
                                    <Link
                                        href="/getting-started"
                                        className=" onClick={closeMobileMenu} w-full text-[#FF318C] text-center border-[#FF318C] border border-[3px] rounded-[100px] hover:bg-opacity-90 text-[16px] font-[700] leading-[18px] px-[20px] py-[25px] gap-[20px]"
                                    >
                                        Start Loved One
                                    </Link>

                                    {user ? (
                                        <>
                                            <Link onClick={closeMobileMenu} href="/dashboard" className="font-semibold w-full text-center border-[3px] text-[#586580] border-[#A5B5D4]  px-[20px] py-[25px] gap-[20px] rounded-[100px] hover:bg-opacity-90">Dashboard</Link>
                                            <button onClick={() => {
                                                sessionStorage.removeItem("user");
                                                localStorage.clear();
                                                window.location.replace("/login");
                                            }} className="font-semibold w-full text-center text-[#586580] text-[16px] leading-[18px] px-[20px] py-[25px] gap-[20px]">Sign out</button>
                                        </>
                                    ) : (
                                        <Link href="/login" className="font-semibold text-[#586580] text-[16px] leading-[18px] flex px-[25px] py-[20px] gap-[20px]">Sign in</Link>
                                    )}

                                </div>

                                <Link onClick={closeMobileMenu} href="/find-loved" className="flex items-center gap-[5px] custom-fsl-padding">
                                    <Search size={20} />
                                    <span>Find Someone Loved</span>
                                </Link>
                                <Link href="/loved-pages" onClick={closeMobileMenu} className="py-2 text-[16px] leading-[17px] plus-jakarta-sans-700 !font-bold text-[#2E266F]">Loved Pages</Link>
                                <MobileMenuItem title="Sending & Receiving" isOpen={isSendingOpen} setIsOpen={setIsSendingOpen}>
                                    {/* <Link href="/dashboard" className="block py-2 text-[16px] leading-4 plus-jakarta-sans-700">Sending & Receiving</Link> */}
                                    <Link href="/donation-tips" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Donation / Tips</Link>
                                    <Link href="/loved-notes" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Loved Notes</Link>
                                    <Link href="/flowers" onClick={closeMobileMenu} className="block text-[#2E266F] py-2 text-[16px] font-[500] leading-[17px]">Flowers</Link>
                                </MobileMenuItem>
                                <MobileMenuItem title="Resources" isOpen={isResourcesOpen} setIsOpen={setIsResourcesOpen}>
                                    {/* <Link href="/dashboard" className="block py-2">Resources</Link> */}
                                    <Link href="/frequently-asked-questions" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">FAQs</Link>
                                    <Link href="/pricing" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Pricing</Link>
                                    <Link href="/help" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Get help</Link>
                                    <Link href="/how-to-guide" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">How to guide</Link>
                                    <Link href="/blog" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Blog</Link>

                                </MobileMenuItem>
                                <MobileMenuItem title="About Us" isOpen={isAboutOpen} setIsOpen={setIsAboutOpen}>
                                    {/* <Link href="/dashboard" className="block py-2">About Us</Link> */}
                                    <Link href="/who-we-are" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Who we are</Link>
                                    <Link href="/hiring" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Hiring</Link>
                                    <Link href="/press-page" onClick={closeMobileMenu} className="block py-2 text-[#2E266F] text-[16px] font-[500] leading-[17px]">Press Page</Link>
                                </MobileMenuItem>
                                {/* {user ? (
                                    <Link href="/dashboard" className="font-semibold py-2">Dashboard</Link>
                                ) : (
                                    <Link href="/login" className="font-semibold py-2">Sign in</Link>
                                )}
                                <Link
                                    href="/getting-started"
                                    className="bg-[#FF007A] text-white px-4 py-2 rounded-full font-semibold text-center"
                                >
                                    Start Loved page
                                </Link> */}

                                <div className="hidden h-[62px] flex-shrink-0 items-center gap-x-[32px] md:flex">
                                    {pathname === "dashboard" ? <ProfileDropdown /> : <>
                                        {loading ? <Loader2 className="mr-2 size-6 animate-spin" /> : user ?
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
                            </div>
                        </div>
                    </div>
                </header>
            )}
        </>
    );
}