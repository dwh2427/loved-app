'use client'
import CustomSlider from "@/components/carousel/public-page-carousel";
import PublictFooter from "@/components/footer/PublicFooter";
import Header from "@/components/header/landing";
import useClientError from "@/hooks/useClientError";
import { countWords, getFirstWords } from "@/lib/countWord";
import Logo3 from "@/public/logo3.svg";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const User = function ({ params }) {
  const router = useRouter();
  const [pageData, setPageData] = useState(null)
  const handleClientError = useClientError()
  useEffect(() => {
    axios
      .get(`/${params.slug}/api`)
      .then((res) => {
        setPageData(res.data.data)
      })
      .catch((error) => { router.push("/page_not_found/non_exited"); handleClientError(error) })
    // .finally(setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, router]);
  const [showFullStory, setShowFullSotry] = useState(false)
  return (
    <div className="max-w-screen overflow-hidden">
      <Header logo={Logo3} />
      <main className="mx-auto mt-[72px] flex w-full flex-col gap-[40px] px-4 md:w-[1248px]">
        <h1 className="md:leading-14 text-3xl font-bold leading-10 md:text-5xl">
          {pageData?.first_name} {pageData?.last_name}
        </h1>
        <p className=" max-w-[721px] leading-[28.8px] text-[#A2AEBA] md:leading-7 lg:text-[24px]">
          {showFullStory ? pageData?.story : getFirstWords(pageData?.story, 40)}
          {
            countWords(pageData?.story) > 40 && <button className="block text-black" onClick={() => setShowFullSotry(p => !p)}>{showFullStory ? 'See less' : 'See more'}</button>}
        </p>

        <div className="mt-4 md:mb-[500px]   lg:w-[1248px]">
          <h3 className="mb-[8px]  text-[30px] font-[900]  leading-[36px]  text-[#650031]">
            Moments
          </h3>


          <div className="relative">
            {pageData && <CustomSlider slides={pageData.images} />}
            {/* <button className="absolute left-0 top-1/2 z-10  -translate-y-1/2 transform md:-left-10">
              <Image src={leftArrow} alt="" className="h-8 w-6 md:w-8" />
            </button>
            <button className="absolute right-0 top-1/2 z-10  -translate-y-1/2 transform md:-right-10">
              <Image src={rightArrow} alt="" className="h-8 w-6 md:w-8" />
            </button> */}
          </div>
        </div>
      </main>

      <PublictFooter />
    </div>
  );
};

export default User;
