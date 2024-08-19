import Image from "next/image";
import { useState } from "react";
import {
  facebookShareUrl,
  twitterShareUrl,
  emailShareUrl,
  whatsappShareUrl,
} from "../utils/sharedTextUtils";

const ShareButtons = ({
  shareUrl,
  twitterText,
  emailText,
  EmailSubject,
  whatsappText,
  isCopied,
  copyToClipboardDynamic,
  handleEmailShare,
}) => {
  const handleFBMessengerShare = () => {
    const fallbackUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      shareUrl
    )}&app_id=5480962782120712&redirect_uri=${encodeURIComponent(
      window.location.href
    )}`;

    const fbMessengerUrl = `fb-messenger://share?link=${encodeURIComponent(
      shareUrl
    )}&app_id=3485738945794`;

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS || isAndroid) {
      window.location.href = fbMessengerUrl;
      setTimeout(() => {
        window.open(fallbackUrl, "_blank");
      }, 500);
    } else {
      window.open(fallbackUrl, "_blank");
    }
  };

  return (
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
                <span className="custom-link-text">{shareUrl}</span>
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
                <span className="custom-link-text">{shareUrl}</span>
              </div>
            </>
          )}
        </button>
        <button
          onClick={() =>
            window.open(twitterShareUrl(twitterText, shareUrl), "_blank")
          }
          className="flex items-center gap-2"
        >
          <Image src="/x.svg" alt="X" width={54} height={54} />
          <span>X</span>
        </button>
        <button className="flex items-center gap-2" onClick={handleEmailShare}>
          <Image src="/email.svg" alt="Email" width={54} height={54} />
          <span>Email</span>
        </button>
      </div>
      <div className="right-buttons">
        <button
          onClick={() =>
            window.open(facebookShareUrl(shareUrl, shareText), "_blank")
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
          onClick={handleFBMessengerShare}
          className="flex items-center gap-2"
        >
          <Image src="/messenger.svg" alt="Messenger" width={54} height={54} />
          <span>Messenger</span>
        </button>
        <button
          onClick={() =>
            window.open(whatsappShareUrl(whatsappText), "_blank")
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
  );
};

export default ShareButtons;