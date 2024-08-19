'use client'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Suspense } from "react";
import { default as SendLove } from "./SendLove";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
import { useEffect, useState } from "react";
import useAuthState from "@/hooks/useAuthState";
import { useRouter } from "next/navigation";

export default function SendLoved() {
	const router = useRouter();
	const { user, loading } = useAuthState();
	
	useEffect(() => {
		if (!loading && !user){
			if (!user?.uid){
				localStorage.setItem('sendLoveUrl', `/send-loved`);
				router.push("/login");
			}
		}
	}, [user, loading]);

	return <Suspense>
		<Elements stripe={stripePromise}>
			<SendLove />
		</Elements>
	</Suspense>
}