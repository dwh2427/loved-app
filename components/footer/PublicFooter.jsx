import Facebook from "@/public/facebook.svg";
import Instagram from "@/public/instagram.svg";
import LinkedIn from "@/public/linkedin.svg";
import Logo3 from "@/public/lovedLogo.svg";
import Twitter from "@/public/twitter.svg";
import Image from "next/image";
import Link from "next/link";
const PublictFooter = () => {
    return <footer className="mt-[50px] w-screen  bg-[#ECFEFF] px-5 lg:py-[50px] md:px-[32.52px]">
        <div className="max-w-[1495px] mx-auto">
            <div className="mx-auto flex h-[66px] items-center justify-between md:max-w-[1665px]">
                <Link href="/">
                    <Image src={Logo3} alt="" className="size-[66px]" />
                </Link>
                <div className="flex gap-x-[10.41px]">
                    <Image src={Instagram} alt="" className="size-[34.69px]" />
                    <Image src={Facebook} alt="" className="size-[34.69px]" />
                    <Image src={LinkedIn} alt="" className="size-[34.69px]" />
                    <Image src={Twitter} alt="" className="size-[34.69px]" />
                </div>
            </div>
            <div className="mx-auto mt-[18.73px] text-[20.81px] font-bold leading-[74.28px] text-[#650031] md:max-w-[1665px]">
                © 2024 Loved Australia Pty Ltd
            </div>
        </div>
    </footer>
}
export default PublictFooter