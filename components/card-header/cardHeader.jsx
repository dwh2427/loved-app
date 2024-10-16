'use client'
import Image from 'next/image'
import Link from 'next/link'
import loveLogoMain from '@/public/card-logo.svg';
import backIcon from '@/public/back-icon.svg';
import saveIcon from '@/public/save-icon.svg';
import { useRouter } from 'next/navigation';

export default function CardHeader({ pageLink }) {
    const router = useRouter();

    return (
        <>
            <header className="flex items-center h-[64px] w-full px-6">
                <div className="max-w-[1495px] mx-auto flex h-[74px] items-center justify-between w-full">
                    
                    {/* Left Side - Back Icon */}
                    <div className="flex items-center">
                        <Image
                            width={59}
                            height={16}
                            src={backIcon}
                            alt="back"
                            className="cursor-pointer"
                            onClick={() => router.back()}  // Optional: Navigate back on click
                        />
                    </div>
                    
                    {/* Center - Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/" className="flex gap-1">
                            <Image
                                width={101}
                                height={24}
                                src={loveLogoMain}
                                alt="loved"
                            />
                        </Link>
                    </div>

                    {/* Right Side - Save Icon */}
                    <div className="flex items-center">
                        <Image
                            width={104}
                            height={38}
                            src={saveIcon}
                            alt="save"
                            className="cursor-pointer"
                            onClick={() => console.log('Save clicked')}  // Add functionality for save click
                        />
                    </div>
                </div>
            </header>

            {/* Border after the header */}
            <hr className="border-t-[1px] border-[#E9E9EB] w-full" />
        </>
    );
}
