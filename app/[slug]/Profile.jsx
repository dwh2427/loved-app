'use client'
import CustomSlider from "@/components/carousel/public-page-carousel";
import useClientError from "@/hooks/useClientError";
import { countWords, getFirstWords } from "@/lib/countWord";
import LovedMsgLogo from "@/public/loved-msg-person.svg";
import LovedLogo from "@/public/white-loved-logo.svg";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";


const UserProfile = function ({ params }) {
	const router = useRouter();
	const [pageData, setPageData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [showFullStory, setShowFullSotry] = useState(false)
	const [comments, setComment] = useState([])
	const handleClientError = useClientError()
	const base_URL = process.env.NEXT_PUBLIC_BASE_URL

	const shareUrl = `${base_URL}${params?.slug}`;


	useLayoutEffect(() => {
		axios
			.get(`/${params.slug}/api`)
			.then((res) => {
				setLoading(false)
				setPageData(res?.data?.data)
			})
			.catch((error) => { router.push("/page_not_found/non_exited"); handleClientError(error) })
		// .finally(setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.slug, router]);

	const [isComment, setIsCommentLoading] = useState(true)
	const [allComment, setAllComment] = useState([])
	useEffect(() => {
		const getComment = async () => {
			const res = await axios.get(`/${params.slug}/api/all_comment?pageName=${params.slug}`);
			if (res?.data?.data) {
				setComment(res?.data?.data)
				setAllComment(res?.data?.data)
				setIsCommentLoading(false)
			}
			setIsCommentLoading(false)

		}
		getComment();

	}, [params.slug])

	const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
	const [isCopied, setIsCopied] = useState(false);

	
		const shareText = "Check out this awesome website!";

		const twitterText = `Share Your Love with ${pageData?.first_name} ${pageData?.last_name}`;
		const EmailSubject = `Check out ${pageData?.first_name} ${pageData?.last_name}’s Loved page`;
		const emailText = `Hello,\n\nI thought you might be interested in adding something nice to ${pageData?.first_name} ${pageData?.last_name}’s Loved page, ${shareUrl}\n\nA nice note and contribution would really be a nice way to show your gratitude and care. Otherwise, please feel free to forward this onto someone else that may be interested.`;
		const whatsappText = `Hi, I thought you’d be interested in the Loved page of ${pageData?.first_name} ${pageData?.last_name}.\nYou can add a message to the page, make a contribution or share it with your friends.\nVisit page ${shareUrl}`;

	

	useEffect(() => {
		if (isComment) {
			setComment(allComment)
		}
	}, [allComment, isComment])

	
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


	const capitalize = (text) => {
		if (!text) return '';
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	}

	const handleToSendLoved = async () => {
		// localStorage.setItem('comment_user_name', pageData?.first_name + ' ' + pageData?.last_name);
		// localStorage.setItem('comment_page_name', pageData?.username);
		// localStorage.setItem('comment_page_id', pageData?.uid);
		router.push(`/send-loved/?page_username=${params.slug}`)
	}
	
	return (

		<div className="min-h-screen overflow-hidden flex flex-col h-fit w-full">
			<Head>
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
			{loading ?
				<div className="flex flex-col items-center justify-center mt-32">
					<Loader2 className="mr-2 size-6 animate-spin text-center" />
				</div>
				: <>
					<main className="mx-auto mt-[72px] flex flex-col gap-[40px] items-center w-[1000px]">

						<div className="flex gap-10 ">
							<div className="w-full">
								<h1 className="text-5xl text-[#2E266F] text-center font-bold leading-10">
									{capitalize(pageData?.first_name)} {capitalize(pageData?.last_name)}
								</h1>

								<div className="mt-5">
									{pageData?.images.length > 0 && <Image src={pageData?.images[0]} alt="Picture" width={500} height={330} className="mt-4 h-[330px] w-[500px] rounded-tl-[64px] rounded-tr-[64px]" />}
									<p className="pt-4 max-w-[721px] leading-[28.8px] text-[#A2AEBA] md:leading-7 text-[16px] plus-jakarta-sans-font-face">
										{showFullStory ? pageData?.story : getFirstWords(pageData?.story, 40)}
										{
											countWords(pageData?.story) > 40 && <button className="block text-black" onClick={() => setShowFullSotry(p => !p)}>{showFullStory ? 'See less' : 'See more'}</button>}
									</p>
								</div>
							</div>

							<div  className="mt-[54px] cursor-pointer shadow-md min-w-[500px] max-w-[500] h-[430px] xl:max-w-[550px] rounded-[64px] overflow-hidden">
								<div className="h-[430px]">
									<div className="bg-[#2E266F] flex flex-col justify-center items-center h-[40%]">
										<div className="avatar-section">
											<Image src={LovedLogo} alt="Picture" width={70} height={65} />
										</div>
										<h3 className="font-medium text-4xl mt-2"> <span className="text-white">To:</span> <span className="text-[#A5B5D4]">name</span></h3>
									</div>

									<div className="flex flex-col min-w-[250px] justify-center bg-[#fff] relative h-[60%]">
										<div className="flex items-center">
											<p className="text-2xl text-[#A5B5D4] absolute top-[30%] left-[29%]">Your message</p>
										</div>
										<div className="flex flex-col justify-end items-center w-full mt-auto pb-6 space-y-4">
											<button onClick={() => router.push(`/send-loved/?page_username=${params.slug}`)} className="w-[80%] text-center bg-[#FF318C] text-white rounded-full py-3 hover:bg-[#FF318C]">Share love with {capitalize(pageData?.first_name)} {capitalize(pageData?.last_name)}</button>
											<button  onClick={() => setIsModalOpen(true)} className="w-[80%] text-center bg-[#FFFFFF] custom-btn text-white rounded-full py-3 hover:bg-[#FF318C]">Share Page with Friends</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-4 lg:w-[1248px]">
							<h3 className="mb-10 text-center text-[30px] font-[900]  leading-[36px]  text-[#650031]">
								Gallery
							</h3>
							whatsappText
							<div className="relative">
								{pageData && <CustomSlider slides={pageData.images} />}
							</div>
						</div>

					</main>

					<section className="mx-auto mt-[72px] flex flex-col gap-4 items-center w-[500px]">
						{isComment ? "Loading..." : ""}
						{
							comments?.length > 0 && comments?.map((cm, index) => <div key={index}>
								<div className="min-w-[500px] mx-auto">
									<div className="p-4 rounded-md gap-2 items-start justify-start flex">
										<div className="avatar-section">
											<Image src={LovedMsgLogo} alt="Picture" width={51} height={49} />
										</div>

										<div className="flex flex-col justify-center">
											<p className="text-[16px] font-semibold">{capitalize(cm?.username)}</p>
											<p className="text-[12px] mt-1">{cm?.comment}</p>
											<div className="mt-2 flex">
												{cm?.image && <Image src={cm?.image} alt="Picture" width={125} height={125} />}
											</div>
										</div>
									</div>
								</div>
							</div>
							)
						}
					</section>
				</>}

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
	);
};


export default UserProfile;
