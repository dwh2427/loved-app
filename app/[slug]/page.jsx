'use client'
import PublictFooter from "@/components/footer/PublicFooter";
import Header from "@/components/header/landing";
import womenPhoto from "@/public/image 86.png";
import leftArrow from "@/public/left-arrow.png";
import Logo3 from "@/public/logo3.svg";
import rightArrow from "@/public/right-arrow.png";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const User = function ({ params }) {
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`/${params.slug}/api`)
      .then((res) => {
        console.log(res);
        res.data.data === null && router.push("/page_not_found/non_exited");
      })
      .catch(() => router.push("/page_not_found/non_exited"))
      .finally(setLoading(false));
  }, [params.slug, router]);

  return (
    <div className="max-w-screen overflow-hidden">
      <Header logo={Logo3} />
      <main className="mx-auto mt-[72px] flex w-full flex-col gap-[40px] px-4 md:w-[1248px]">
        <h1 className="md:leading-14 text-3xl font-bold leading-10 md:text-5xl">
          Ash Good
        </h1>
        <p className=" max-w-[721px] leading-[28.8px] text-[#A2AEBA] md:leading-7 lg:text-[24px]">
          Hipster ipsum tattooed brunch I &apos m baby. Messenger aesthetic
          readymade jean yes vice copper freegan forage yes. Portland of
          knausgaard xoxo ethical food normcore try-hard flexitarian. Umami
          migas chartreuse aesthetic listicle. Lomo rights LaCroix austin book
          freegan pbr&b fanny distillery bodega.
          <button className="block text-black">See more</button>
        </p>

        <div className="mt-4 md:mb-[500px]   lg:w-[1248px]">
          <h3 className="mb-[8px]  text-[30px] font-[900]  leading-[36px]  text-[#650031]">
            Moments
          </h3>
          <div className="relative">
            <div className="flex gap-[16px] ">
              <Image
                src={womenPhoto}
                alt=""
                className="h-[200px] w-full rounded-[8px]  md:h-[345px]"
              />
              <Image
                src={womenPhoto}
                alt=""
                className="h-[200px] w-full rounded-[8px]  md:h-[345px]"
              />
            </div>

            <button className="absolute left-0 top-1/2 z-10  -translate-y-1/2 transform md:-left-10">
              <Image src={leftArrow} alt="" className="h-8 w-6 md:w-8" />
            </button>
            <button className="absolute right-0 top-1/2 z-10  -translate-y-1/2 transform md:-right-10">
              <Image src={rightArrow} alt="" className="h-8 w-6 md:w-8" />
            </button>
          </div>
        </div>
      </main>

      <PublictFooter />
    </div>
  );
};

export default User;
