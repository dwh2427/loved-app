'use client'
import CustomSlider from "@/components/carousel/public-page-carousel";
import useClientError from "@/hooks/useClientError";
import { countWords, getFirstWords } from "@/lib/countWord";
import LovedMsgLogo from "@/public/loved-msg-person.svg";
import LovedLogo from "@/public/white-loved-logo.svg";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const metadata = {
	title: '...',
	description: '...',
}

const UserProfile = function ({ params }) {
	const router = useRouter();
	const [pageData, setPageData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [showFullStory, setShowFullSotry] = useState(false)
	const [comments, setComment] = useState([])
	const handleClientError = useClientError()

	useEffect(() => {
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

	useEffect(() => {
		if (isComment) {
			setComment(allComment)
		}
	}, [allComment, isComment])


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

							<div onClick={() => router.push(`/send-loved/?page_username=${params.slug}`)} className="mt-[54px] cursor-pointer shadow-md min-w-[500px] max-w-[500] h-[430px] xl:max-w-[550px] rounded-[64px] overflow-hidden">
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
										<div className="flex flex-col justify-end items-center absolute w-full bottom-6">
											<button className="w-[80%] text-center items-end justify-end bg-[#FF318C] text-white mt-6 rounded-full py-3 hover:bg-[#FF318C]">Send Love</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-4 lg:w-[1248px]">
							<h3 className="mb-10 text-center text-[30px] font-[900]  leading-[36px]  text-[#650031]">
								Gallery
							</h3>

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

		</div>
	);
};


export default UserProfile;
