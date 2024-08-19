"use client";
import CustomSlider from "@/components/carousel/public-page-carousel";
import useClientError from "@/hooks/useClientError";
import { countWords, getFirstWords } from "@/lib/countWord";
import LovedLogo from "@/public/white-loved-logo.svg";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

import Comment from "./Comment";

const UserProfile = function ({ params }) {
  const router = useRouter();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullStory, setShowFullSotry] = useState(false);
  const handleClientError = useClientError();
  const base_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const shareUrl = `${base_URL}${params?.slug}`;

  // Fetch page data when component mounts
  useLayoutEffect(() => {
    axios
      .get(`/${params.slug}/api`)
      .then((res) => {
        setLoading(false);
        setPageData(res?.data?.data);
      })
      .catch((error) => {
        router.push("/page_not_found/non_exited");
        handleClientError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, router]);

  // Modal state and copy to clipboard state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isCopied, setIsCopied] = useState(false);

  // Share messages
  const shareText = "Check out this awesome website!";
  const twitterText = `Share Your Love with ${pageData?.first_name} ${pageData?.last_name}`;
  const EmailSubject = `Check out ${pageData?.first_name} ${pageData?.last_name}’s Loved page`;
  const emailText = `Hello,\n\nI thought you might be interested in adding something nice to ${pageData?.first_name} ${pageData?.last_name}’s Loved page, ${shareUrl}\n\nA nice note and contribution would really be a nice way to show your gratitude and care. Otherwise, please feel free to forward this onto someone else that may be interested.`;
  const whatsappText = `Hi, I thought you’d be interested in the Loved page of ${pageData?.first_name} ${pageData?.last_name}.\nYou can add a message to the page, make a contribution or share it with your friends.\nVisit page ${shareUrl}`;

  // Manage body scroll when modal is open/closed
  useEffect(() => {
    const stickyDiv = document.querySelector(".stickydiv");
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
      stickyDiv.classList.remove("sticky");
    } else {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open");
      stickyDiv.classList.add("sticky");
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open");
      stickyDiv.classList.add("sticky");
    };
  }, [isModalOpen]);

  const isAuthenticated = () => {
    // Replace this with your actual authentication check logic
    // For example, check if there's a valid JWT token in localStorage
    return !!localStorage.getItem('accToken'); // example
  };

  const handleClick = () => {
    if (isAuthenticated()) {
      router.push(`/send-loved/?page_username=${params.slug}`);
    } else {
      localStorage.setItem('sendLoveUrl', `/send-loved/?page_username=${params.slug}`)
      router.push('/login');
    }
  };

  // Copy text to clipboard and show "copied" feedback
  const copyToClipboardDynamic = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Handle sharing via email
  const handleEmailShare = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(EmailSubject)}&body=${encodeURIComponent(emailText)}`;
    window.location.href = mailtoUrl;
  };

  // Capitalize text
  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="flex h-fit min-h-screen w-full flex-col overflow-hidden px-3">
      <Head>
        {/* Meta tags for SEO and social sharing */}
        <meta property="og:title" content="Loved" />
        <meta property="og:description" content="A brief description of your website." />
        <meta property="og:image" content={pageData?.images[0]} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Your Site Name" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Loved" />
        <meta name="twitter:description" content="A brief description of your website." />
        <meta name="twitter:image" content={pageData?.images[0]} />
        <meta name="twitter:url" content={shareUrl} />
      </Head>

      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <Loader2 className="size-6 animate-spin text-center" />
        </div>
      ) : (
        <>
          <main className="mx-auto mt-[72px] flex w-full flex-col items-center gap-[40px] md:w-[1000px]">
            <div className="flex w-full flex-col gap-10 md:flex-row">
              <div className="w-full">
                <h1 className="text-center text-5xl font-bold leading-10 text-[#2E266F]">
                  {capitalize(pageData?.first_name)} {capitalize(pageData?.last_name)}
                </h1>

                <div className="mt-5">
                  {pageData?.images.length > 0 && (
                    <Image
                      src={pageData?.images[0]}
                      alt="Picture"
                      width={500}
                      height={330}
                      className="mt-4 h-auto w-full max-w-lg rounded-tl-[64px] rounded-tr-[64px]"
                    />
                  )}
                  <p className="plus-jakarta-sans-font-face max-w-[721px] pt-4 text-[16px] leading-[28.8px] text-[#A2AEBA] md:leading-7">
                    {showFullStory ? pageData?.story : getFirstWords(pageData?.story, 40)}
                    {countWords(pageData?.story) > 40 && (
                      <button className="block text-black" onClick={() => setShowFullSotry((p) => !p)}>
                        {showFullStory ? "See less" : "See more"}
                      </button>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-[54px] w-full cursor-pointer overflow-hidden rounded-[64px] shadow-md md:h-[430px] md:min-w-[500px] xl:max-w-[550px]">
                <div className="h-[430px]">
                  <div className="flex h-[40%] flex-col items-center justify-center bg-[#2E266F]">
                    <div className="avatar-section">
                      <Image src={LovedLogo} alt="Picture" width={70} height={65} />
                    </div>
                    <h3 className="mt-2 text-4xl font-medium">
                      <span className="text-white">To:</span>
                      <span className="text-[#A5B5D4]">name</span>
                    </h3>
                  </div>

                  <div className="relative flex h-[60%] min-w-[250px] flex-col justify-center bg-[#fff]">
                    <div className="flex items-center">
                      <p className="absolute left-[29%] top-[30%] text-2xl text-[#A5B5D4]">Your message</p>
                    </div>
                    <div className="mt-auto flex w-full flex-col items-center justify-end space-y-4 pb-6">
                    <button
                      onClick={handleClick}
                      className="w-[80%] rounded-full bg-[#FF318C] py-3 text-center text-white hover:bg-[#FF318C]"
                    >
                      Share love with {capitalize(pageData?.first_name)} {capitalize(pageData?.last_name)}
                    </button>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="custom-btn w-[80%] rounded-full bg-[#FFFFFF] py-3 text-center text-white hover:bg-[#FF318C]"
                      >
                        Share Page with Friends
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 w-full lg:w-[1248px]">
              <h3 className="mb-10 text-center text-[30px] font-[900] leading-[36px] text-[#650031]">Gallery</h3>
              <div className="relative">
                {pageData && <CustomSlider slides={pageData.images} />}
              </div>
            </div>
          </main>

          {/* Comment component */}
          <Comment params={params} />
        </>
      )}

      {isModalOpen && (
        <div className="z-10000 custom-modal-container fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="custom-modal max-h-full overflow-y-auto">
            <div className="custom-modal-header">
              <button onClick={() => setIsModalOpen(false)} className="close-button">
                <Image src="/close-icon.svg" alt="Close" width={18} height={18} className="modal-icon" />
              </button>
              <div className="modal-center-content">
                <Image src="/share-loved.svg" alt="Share With Friends" width={70} height={70} className="modal-icon" />
                <span className="modal-title">Share With Friends</span>
              </div>
            </div>
            <div className="custom-modal-body overflow-y-auto">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2" onClick={() => copyToClipboardDynamic(shareUrl)}>
                  {isCopied ? (
                    <>
                      <Image src="/checkmark.svg" alt="Link copied" width={70} height={70} />
                      <div className="text-left">
                        <span>Link copied</span>
                        <br />
                        <span className="custom-link-text">{shareUrl}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image src="/share-ink.svg" alt="Share link" width={60} height={60} />
                      <div className="text-left">
                        <span>Share link</span>
                        <br />
                        <span className="custom-link-text">{shareUrl}</span>
                      </div>
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`,
                    "_blank",
                  )
                }
                className="flex items-center gap-2"
              >
                <Image src="/x.svg" alt="X" width={70} height={70} />
                <span>X</span>
              </button>
              <button className="flex items-center gap-2" onClick={handleEmailShare}>
                <Image src="/email.svg" alt="Email" width={70} height={70} />
                <span>Email</span>
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                    "_blank",
                  )
                }
                className="flex items-center gap-2"
              >
                <Image src="/share-facebook.svg" alt="Facebook" width={70} height={70} />
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
                      window.open(fallbackUrl, "_blank");
                    }, 500);
                  } else {
                    window.open(fallbackUrl, "_blank");
                  }
                }}
                className="flex items-center gap-2"
              >
                <Image src="/messenger.svg" alt="Messenger" width={70} height={70} />
                <span>Messenger</span>
              </button>
              <button
                onClick={() =>
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`, "_blank")
                }
                className="flex items-center gap-2"
              >
                <Image src="/whatsapp.svg" alt="WhatsApp" width={70} height={70} />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
