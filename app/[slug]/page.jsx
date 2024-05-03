'use client'
import PublictFooter from '@/components/footer/PublicFooter';
import Header from '@/components/header/landing';
import Loading from '@/components/loading/loading';
import womenPhoto from '@/public/image 86.png';
import leftArrow from '@/public/left-arrow.png';
import Logo3 from "@/public/logo3.svg";
import rightArrow from '@/public/right-arrow.png';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const User = function ({ params }) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        axios.get(`/${params.slug}/api`).then(res => {
            console.log(res);
            res.data.data === null && router.push('/page_not_found/non_exited')
        }).catch(() => router.push('/page_not_found/non_exited')).finally(setLoading(false))
    }, [params.slug, router])

    if (loading) return <Loading />
    return <div className="max-w-screen overflow-hidden">
        <Header logo={Logo3} />
        <main className="w-full mx-auto px-4 md:w-[1248px] flex flex-col gap-[40px] mt-[72px]">
            <h1 className="font-bold text-3xl md:text-5xl leading-10 md:leading-14">Ash Good</h1>
            <p className=" max-w-[721px] lg:text-[24px] text-[#A2AEBA] leading-[28.8px] md:leading-7">Hipster ipsum tattooed brunch I &apos m baby. Messenger aesthetic readymade jean yes vice copper freegan forage yes. Portland of knausgaard xoxo ethical food normcore try-hard flexitarian. Umami migas chartreuse aesthetic listicle. Lomo rights LaCroix austin book freegan pbr&b fanny distillery bodega.
                <button className="text-black block">See more</button>
            </p>

            <div className="mt-4 lg:w-[1248px]   md:mb-[500px]">
                <h3 className="font-[900]  text-[30px] leading-[36px]  mb-[8px]  text-[#650031]">Moments</h3>
                <div className="relative">
                    <div className="flex gap-[16px] ">
                        <Image src={womenPhoto} alt="" className="w-full h-[200px] md:h-[345px]  rounded-[8px]" />
                        <Image src={womenPhoto} alt="" className="w-full h-[200px] md:h-[345px]  rounded-[8px]" />
                    </div>

                    <button className="absolute top-1/2 md:-left-10 left-0  transform -translate-y-1/2 z-10">
                        <Image src={leftArrow} alt="" className="w-6 h-6 md:w-8 h-8" />
                    </button>
                    <button className="absolute top-1/2 md:-right-10 right-0  transform -translate-y-1/2 z-10">
                        <Image src={rightArrow} alt="" className="w-6 h-6 md:w-8 h-8" />
                    </button>
                </div>


            </div>
        </main>

        <PublictFooter />
    </div>
}

export default User