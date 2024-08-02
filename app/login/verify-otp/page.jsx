'use client'
import { Suspense } from "react";
import { default as VerifyOtp } from "./VerifyOtp";

export default function SendLoved() {
	return <Suspense>
			<VerifyOtp />
	    </Suspense>
}