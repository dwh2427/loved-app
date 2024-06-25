'use client'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Suspense } from "react";
import { default as SendLove } from "./Form";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function SendLoved() {
	return <Suspense>
		<Elements stripe={stripePromise}>
			<SendLove />
		</Elements>
	</Suspense>
}