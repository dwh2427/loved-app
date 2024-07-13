import BannerImg from "@/public/banner-img.png";
import Picture from "@/public/img-loved-msg.svg";
import LovedMsgLogo from "@/public/loved-msg-person.svg";
import LovedLogo from "@/public/white-loved-logo.svg";
import SponsorLogo from "@/public/sponsor-logo.svg";
import { Heart, MessageCircle, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LovedBox from "@/components/loved-box/lovedBox";



export default async function HomePage() {

  return (
    <div className="relative">
      <main className="max-w-[1495px] xl:px-0 mx-auto">
        <Image src={BannerImg} alt="Picture" width={1495} height={950} className="!h-[910px]" />
        <div className="absolute top-52 left-0 w-full">
          <div className="flex flex-col items-center justify-center text-white">
            <h3 className="text-center text-5xl">
              Share Your Love
            </h3>
            <p className="mt-4 text-center text-[16px]">Your space to honour, treasure and <br /> celebrate those you love and have loved.</p>
          </div>

         
          <div className="flex justify-between gap-4 mt-8 px-4">
            <div className="p-4 w-[270px] h-[500px] rounded-[32px] bg-[#2E266F] items-center justify-center flex flex-col text-white">
              <div className="avatar-section">
                <Image src={LovedMsgLogo} alt="Picture" width={51} height={49} />
              </div>

              <div className="flex flex-col items-center mt-2">
                <h3 className="text-[12px]"> <span className="text-yellow-400 mr-1">To </span> David</h3>
                <p className="text-[12px]">We miss you and love you. We miss you and love you. We miss you and love you. We miss you and... more</p>
                <h3 className="text-[12px] semibold mt-2"><span className="text-yellow-400">From</span> John</h3>
                <div className="mt-2 flex items-center justify-center">
                  <Image src={Picture} alt="Picture" width={125} height={125} />
                </div>
              </div>

              {/* loved share */}
              <div className="loved-share mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart strokeWidth={2.25} size={16} fill="#FF318C" className="text-[#FF318C]" />
                    <MessageCircle size={16} strokeWidth={2.25} />
                    <Share size={16} />
                  </div>
                  <p className="text-[12px] text-yellow-500">/dave</p>
                </div>
                <p className="mt-2 text-[12px]">
                  Liked by <strong>annegraham_photo</strong>  and <strong>others</strong>
                </p>
                <p className="mt-2 text-[12px]">
                  <strong> annegraham_photo</strong> that’s so sweet of you John we miss David so much. He’s in our hearts every day. We... more
                </p>
              </div>
            </div>

            <div className="p-4 w-[270px] h-[500px] rounded-[32px] bg-[#2E266F] items-center justify-center flex flex-col text-white">
              <div className="avatar-section">
                <Image src={LovedMsgLogo} alt="Picture" width={51} height={49} />
              </div>

              <div className="flex flex-col items-center mt-2">
                <h3 className="text-[12px]"> <span className="text-yellow-400 mr-1">To </span> David</h3>
                <p className="text-[12px]">We miss you and love you. We miss you and love you. We miss you and love you. We miss you and... more</p>
                <h3 className="text-[12px] semibold mt-2"><span className="text-yellow-400">From</span> John</h3>
                <div className="mt-2 flex items-center justify-center">
                  <Image src={Picture} alt="Picture" width={125} height={125} />
                </div>
              </div>

              {/* loved share */}
              <div className="loved-share mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart strokeWidth={2.25} size={16} fill="#FF318C" className="text-[#FF318C]" />
                    <MessageCircle size={16} strokeWidth={2.25} />
                    <Share size={16} />
                  </div>
                  <p className="text-[12px] text-yellow-500">/dave</p>
                </div>
                <p className="mt-2 text-[12px]">
                  Liked by <strong>annegraham_photo</strong>  and <strong>others</strong>
                </p>
                <p className="mt-2 text-[12px]">
                  <strong> annegraham_photo</strong> that’s so sweet of you John we miss David so much. He’s in our hearts every day. We... more
                </p>
              </div>
            </div>

            <LovedBox>
              <div className="bg-[#2E266F] h-[40%] flex flex-col justify-center items-center">
                <div className="avatar-section">
                  <Image src={LovedLogo} alt="Picture" width={70} height={65} />
                </div>
                <h3 className="font-medium text-4xl mt-2"> <span className="text-white">To:</span> <span className="text-[#A5B5D4]">name</span></h3>
              </div>

              <div className="flex flex-col min-w-[250px] justify-center h-[60%] bg-[#fff] relative">
                <div className="flex items-center">
                  <p className="text-2xl text-[#A5B5D4] absolute top-[30%] left-[29%]">Your message</p>
                </div>
                <div className="flex flex-col justify-end items-center absolute w-full bottom-6">
                  <Link href="/send-loved" className="w-[80%] text-center items-end justify-end bg-[#FF318C] text-white mt-6 rounded-full py-3 hover:bg-[#FF318C]">Send Love</Link>
                </div>
              </div>
            </LovedBox>


            <div className="p-4 w-[270px] h-[500px] rounded-[32px] bg-[#2E266F] items-center justify-center flex flex-col text-white">
              <div className="avatar-section">
                <Image src={LovedMsgLogo} alt="Picture" width={51} height={49} />
              </div>

              <div className="flex flex-col items-center mt-2">
                <h3 className="text-[12px]"> <span className="text-yellow-400 mr-1">To </span> David</h3>
                <p className="text-[12px]">We miss you and love you. We miss you and love you. We miss you and love you. We miss you and... more</p>
                <h3 className="text-[12px] semibold mt-2"><span className="text-yellow-400">From</span> John</h3>
                <div className="mt-2 flex items-center justify-center">
                  <Image src={Picture} alt="Picture" width={125} height={125} />
                </div>
              </div>

              {/* loved share */}
              <div className="loved-share mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart strokeWidth={2.25} size={16} fill="#FF318C" className="text-[#FF318C]" />
                    <MessageCircle size={16} strokeWidth={2.25} />
                    <Share size={16} />
                  </div>
                  <p className="text-[12px] text-yellow-500">/dave</p>
                </div>
                <p className="mt-2 text-[12px]">
                  Liked by <strong>annegraham_photo</strong>  and <strong>others</strong>
                </p>
                <p className="mt-2 text-[12px]">
                  <strong> annegraham_photo</strong> that’s so sweet of you John we miss David so much. He’s in our hearts every day. We... more
                </p>
              </div>
            </div>
            <div className="p-4 w-[270px] h-[500px] rounded-[32px] bg-[#2E266F] items-center justify-center flex flex-col text-white">
              <div className="avatar-section">
                <Image src={LovedMsgLogo} alt="Picture" width={51} height={49} />
              </div>

              <div className="flex flex-col items-center mt-2">
                <h3 className="text-[12px]"> <span className="text-yellow-400 mr-1">To </span> David</h3>
                <p className="text-[12px]">We miss you and love you. We miss you and love you. We miss you and love you. We miss you and... more</p>
                <h3 className="text-[12px] semibold mt-2"><span className="text-yellow-400">From</span> John</h3>
                <div className="mt-2 flex items-center justify-center">
                  <Image src={Picture} alt="Picture" width={125} height={125} />
                </div>
              </div>

              {/* loved share */}
              <div className="loved-share mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart strokeWidth={2.25} size={16} fill="#FF318C" className="text-[#FF318C]" />
                    <MessageCircle size={16} strokeWidth={2.25} />
                    <Share size={16} />
                  </div>
                  <p className="text-[12px] text-yellow-500">/dave</p>
                </div>
                <p className="mt-2 text-[12px]">
                  Liked by <strong>annegraham_photo</strong>  and <strong>others</strong>
                </p>
                <p className="mt-2 text-[12px]">
                  <strong> annegraham_photo</strong> that’s so sweet of you John we miss David so much. He’s in our hearts every day. We... more
                </p>
              </div>
            </div>

          </div>

        </div>
        <div className="sponsor-area mt-8 flex items-center justify-center">
          <Image src={SponsorLogo} width={700} height={35} alt="sponsor" />
        </div>
      </main>
    </div>
  );
}

