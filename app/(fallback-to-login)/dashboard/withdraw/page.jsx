"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WithDraw() {
	const router = useRouter()
	useEffect(() => { router.push('/') }, [router])
	return (
		<div className="mx-auto mt-6 flex flex-col justify-center items-center gap-[32px] md:mt-[99px] h-fit w-full max-w-[821px] px-[20px] md:w-[821px] md:px-0 mb-[104px]">
		</div>
	)
}
