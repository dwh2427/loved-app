'use client'

import { useRouter } from "next/navigation"

export default function LovedBox({ children }) {
	const router = useRouter();
	return (
		<div onClick={() => router.push('/send-loved')} className="cursor-pointer shadow-md w-[500px] max-w-[500] xl:max-w-[550px] rounded-[64px] overflow-hidden">
			{children}
		</div>
	)
}
