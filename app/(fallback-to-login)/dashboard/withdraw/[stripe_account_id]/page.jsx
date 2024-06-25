"use client"

import Link from "next/link"

export default function WithDraw() {
	return (
		<div className="mx-auto mt-6 flex flex-col justify-center items-center gap-[32px] md:mt-[99px] h-fit w-full max-w-[821px] px-[20px] md:w-[821px] md:px-0 mb-[104px]">
			<div className="flex flex-col justify-center items-center">
				<h2 className='text-3xl font-semibold'>How much would you like to withdraw?</h2>
			</div>
			<div className='flex flex-col gap-3 justify-center items-center'>
				<input type="number" className="w-[330px] border border-gray-300 rounded-md p-3" placeholder="Enter amount" />
				<p>Available balance $0.00</p>
			</div>

			<Link href="/dashboard/bank-details" className="w-[330px] text-center bg-[#FF007A] text-white p-3 rounded-full">Confirm</Link>
		</div>
	)
}
