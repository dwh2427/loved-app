import Image from "next/image";
import { useState } from "react";

export default function ShareButton({ showShareIcon, selectedPage, inputValue }) {

    const base_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const shareText = "Check out this awesome website!";
    const [isCopied, setIsCopied] = useState(false);
    const shareUrl = `${base_URL}${selectedPage?.username}`;
    const capitalizeWords = (str) => {
        if (typeof str !== "string") {
          return "";
        }
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
      };

    const twitterText = `Share Your Love with ${capitalizeWords(inputValue)}`;
    const EmailSubject = `Check out ${capitalizeWords(inputValue)}’s Loved page`;
    const emailText = `Hello,\n\nI thought you might be interested in adding something nice to ${capitalizeWords(inputValue)}’s Loved page, ${shareUrl}\n\nA nice note and contribution would really be a nice way to show your gratitude and care. Otherwise, please feel free to forward this onto someone else that may be interested.`;
    const whatsappText = `Hi, I thought you’d be interested in the Loved page of ${capitalizeWords(inputValue)}.\nYou can add a message to the page, make a contribution or share it with your friends.\nVisit page ${shareUrl}`;

    const handleEmailShare = () => {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(EmailSubject)}&body=${encodeURIComponent(emailText)}`;
        window.location.href = mailtoUrl;
    };


    const copyToClipboardDynamic = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };


  return (
    <div className="custom-body mt-5 text-center">
        <p className="want-more mt-3 text-center text-4xl text-[#2E266F]">
        Want to help more?
        </p>
        <p className="more-page text-center text-[#2E266F]">
        Let people know about this page.
        </p>
        {selectedPage && showShareIcon && (
        <div className="button-container mt-10">
        <div className="left-buttons">
            <button
            className="flex items-center gap-2"
            onClick={() => copyToClipboardDynamic(shareUrl)}
            >
            {isCopied ? (
                <>
                <Image
                    src="/checkmark.svg"
                    alt="Link copied"
                    width={54}
                    height={54}
                />
                <div className="text-left">
                    <span>Link copied</span>
                    <br />
                    <span className="custom-link-text">
                    {shareUrl}
                    </span>
                </div>
                </>
            ) : (
                <>
                <Image
                    src="/share-ink.svg"
                    alt="Share link"
                    width={54}
                    height={54}
                />
                <div className="text-left">
                    <span>Share link</span>
                    <br />
                    <span className="custom-link-text">
                    {shareUrl}
                    </span>
                </div>
                </>
            )}
            </button>
            <button
            onClick={() =>
                window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`,
                "_blank",
                )
            }
            className="flex items-center gap-2"
            >
            <Image src="/x.svg" alt="X" width={54} height={54} />
            <span>X</span>
            </button>
            <button
            className="flex items-center gap-2"
            onClick={handleEmailShare}
            >
            <Image
                src="/email.svg"
                alt="Email"
                width={54}
                height={54}
            />
            <span>Email</span>
            </button>
        </div>
        <div className="right-buttons">
            <button
            onClick={() =>
                window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                "_blank",
                )
            }
            className="flex items-center gap-2"
            >
            <Image
                src="/share-facebook.svg"
                alt="Facebook"
                width={54}
                height={54}
            />
            <span>Facebook</span>
            </button>
            <button
            onClick={() => {
                const fallbackUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=5480962782120712&redirect_uri=${encodeURIComponent(window.location.href)}`;

                const fbMessengerUrl = `fb-messenger://share?link=${encodeURIComponent(shareUrl)}&app_id=3485738945794`;

                const isIOS =
                /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                !window.MSStream;
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
            <Image
                src="/messenger.svg"
                alt="Messenger"
                width={54}
                height={54}
            />
            <span>Messenger</span>
            </button>
            <button
            onClick={() =>
                window.open(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
                "_blank",
                )
            }
            className="flex items-center gap-2"
            >
            <Image
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={54}
                height={54}
            />
            <span>WhatsApp</span>
            </button>
        </div>
        </div>
        ) }

    </div>
  );
}
