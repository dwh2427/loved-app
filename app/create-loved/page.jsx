"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import Logo from "@/public/logo.png";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import FallbackToLoginLayout from "../(fallback-to-login)/layout";
import Session from "./session";
const base_urls = process.env.NEXT_PUBLIC_BASE_URL;

export default function CreateLovedPage() {
    const { user, loading } = useAuthState()
    const base_url = base_urls.replace(/^https?:\/\//i, "");
    const { toast } = useToast();
    const [insertUsername, setInsertUserName] = useState(``)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
    const router = useRouter()
    const handleClientError = useClientError()
    const apiCaller = useApiCaller()
    const [twitterText, settwitterText] = useState('')
    const [EmailSubject, setEmailSubject] = useState('')
    const [emailText, setemailText] = useState('')
    const [whatsappText, setwhatsappText] = useState('')
    const [pageId, setPageId] = useState('')
    const shareUrl = insertUsername;


    const handleUpdatePageLink = async (newValue) => {
        try {
            const value = newValue.split('/')[1]
            setIsUpdating(true)
            await apiCaller.put('/dashboard/api', { newUsername: value, _id: pageId })
            localStorage.removeItem('pageId')
            localStorage.removeItem('username')

            toast({ variant: 'success', title: "Thank you! Page link updated successfully!" });
        } catch (error) {
            handleClientError(error)
        } finally {
            setIsUpdating(false);
        }
    };

    const shareText = "Check out this awesome website!";
    const [isCopied, setIsCopied] = useState(false);



    useEffect(() => {
        if (!loading) {
            const username = localStorage.getItem('username')
            const pageId = localStorage.getItem('pageId')
            if (!username && !pageId) router.replace('/')
            setPageId(pageId)
            setInsertUserName(`${base_url}${username}`)

            settwitterText(`Share Your Love with ${user.first_name} ${user.last_name}`);
            setEmailSubject(`Check out ${user.first_name} ${user.last_name}’s Loved page`);
            setemailText(`Hello,\n\nI thought you might be interested in adding something nice to ${user.first_name} ${user.last_name}’s Loved page, ${shareUrl}\n\nA nice note and contribution would really be a nice way to show your gratitude and care. Otherwise, please feel free to forward this onto someone else that may be interested.`);
            setwhatsappText(`Hi, I thought you’d be interested in the Loved page of ${user.first_name} ${user.last_name}.\nYou can add a message to the page, make a contribution or share it with your friends.\nVisit page ${shareUrl}`);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [base_url, user]);



    const handleChange = (e) => {
        setInsertUserName(e.target.value);
        handleUpdatePageLink(e.target.value);
    };

    const skipToDashboard = async () => {
        router.push(`/dashboard`);
    };

    const copyToClipboardDynamic = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const handleEmailShare = () => {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(EmailSubject)}&body=${encodeURIComponent(emailText)}`;
        window.location.href = mailtoUrl;
    };

    return (
        <FallbackToLoginLayout>
            <Session />
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
                    <h3 className="mx-auto mt-[41.41px] w-4/5 text-center text-[40px] font-bold leading-[30px] text-[#650031] md:mt-[86px] md:w-full md:whitespace-nowrap md:text-[25px]">
                        Congrats your page for Dave is ready
                    </h3>
                    <p className="mx-auto mt-[41.41px] text-center text-[25px] font-bold leading-[30px] md:mt-[46px]">
                        Your Page URL is
                    </p>
                    <Input
                        onChange={handleChange}
                        value={insertUsername}
                        className="mx-auto mt-[16px] h-[62px] w-[384px] rounded-[8px] border border-black/70 px-[25px] py-[20px] text-center text-[18px] font-bold leading-[22px] text-black/70"
                    />

                    <button
                        disabled={isUpdating}
                        onClick={() => {
                            const value = insertUsername.split('/')[1]
                            apiCaller.put('/dashboard/api', { newUsername: value, _id: pageId })
                                .then((data) => { localStorage.setItem('username', value) })
                                .catch(err => { })
                                .finally(
                                    setIsModalOpen(true)
                                )

                        }} // Open the modal on click
                        className="mx-auto mt-[100px] h-[60px] w-full gap-2 flex justify-center max-w-[400px] rounded-[30px] bg-[#FF007A] px-[20px] py-[15px] text-center text-[18px] font-black leading-[22px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 md:mt-[100px]"
                    >
                        {isUpdating && <Loader2 />}
                        Share Page
                    </button>

                    <button
                        disabled={isUpdating}
                        onClick={() => skipToDashboard()}
                        className="mx-auto h-[60px] w-full gap-2 flex justify-center max-w-[400px] rounded-[30px] border-2 border-[#FF007A] bg-transparent px-[20px] py-[15px] text-center text-[18px] font-black leading-[22px] text-[#FF007A] hover:bg-[#FF007A] hover:text-[#FFFFFF] focus:bg-[#FF007A] focus:text-[#FFFFFF] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 md:mt-[20px]"
                    >
                        {isUpdating && <Loader2 />}
                        Skip
                    </button>

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="custom-modal">
                                <div className="custom-modal-header">
                                    <button onClick={() => setIsModalOpen(false)} className="close-button">X</button>
                                    <div className="modal-center-content">
                                        <Image src="/share-loved.svg" alt="Logo" width={54} height={54} className="modal-icon" />
                                        <h2 className="modal-title">Share With Friends</h2>
                                    </div>
                                </div>


                                <div className="custom-modal-body">
                                    <button className="flex items-center gap-2" onClick={() => copyToClipboardDynamic(shareUrl)}>
                                        {isCopied ? (
                                            <>
                                                <Image src="/checkmark.svg" alt="Link copied" width={54} height={54} />
                                                <span>Link copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Image src="/share-ink.svg" alt="Share link" width={54} height={54} />
                                                <span>Share link</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => window.open(
                                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`,
                                            '_blank'
                                        )}
                                        className="flex items-center gap-2">
                                        <Image src="/x.svg" alt="X" width={54} height={54} />
                                        <span>X</span>
                                    </button>
                                    <button className="flex items-center gap-2" onClick={handleEmailShare}>
                                        <Image src="/email.svg" alt="Email" width={54} height={54} />
                                        <span>Email</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(
                                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                                            '_blank'
                                        )}
                                        className="flex items-center gap-2">
                                        <Image src="/share-facebook.svg" alt="Facebook" width={54} height={54} />
                                        <span>Facebook</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const fallbackUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=2480962782120712&redirect_uri=${encodeURIComponent(window.location.href)}`;

                                            const fbMessengerUrl = `fb-messenger://share?link=${encodeURIComponent(shareUrl)}&app_id=3485738945794`;

                                            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                                            const isAndroid = /Android/.test(navigator.userAgent);

                                            if (isIOS || isAndroid) {
                                                window.location.href = fbMessengerUrl;
                                                setTimeout(() => {
                                                    window.open(fallbackUrl, '_blank');
                                                }, 500);
                                            } else {
                                                window.open(fallbackUrl, '_blank');
                                            }

                                        }}

                                        className="flex items-center gap-2">
                                        <Image src="/messenger.svg" alt="Messenger" width={54} height={54} />
                                        <span>Messenger</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(
                                            `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
                                            '_blank'
                                        )}
                                        className="flex items-center gap-2">
                                        <Image src="/whatsapp.svg" alt="WhatsApp" width={54} height={54} />
                                        <span>WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}



                </div>
                <Sidebar />
            </div>
        </FallbackToLoginLayout>
    );
}
