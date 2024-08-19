import { errorResponse } from "@/lib/server-error";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the JSON body
    const tipAmount = body.tipAmount; // Convert dollars to cents
    const currency = body.currency;
    const applicationFeeAmount = body.applicationFeeAmount;

    if (!tipAmount || tipAmount <= 0) {
      throw new Error("Invalid amount provided.");
    }
    const totalAmount = Math.round((tipAmount + applicationFeeAmount) * 100); // Convert to the smallest currency unit

    const paymentIntent = await stripe.paymentIntents.create({
      currency: currency, // currency can be changed as needed
      amount: totalAmount,
      payment_method_types: ['card', 'link'],
      metadata: {
        tipAmount: tipAmount,
        applicationFeeAmount: applicationFeeAmount,
      }
    });
    
    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
  } catch (error) {
    return errorResponse(error.message);
  }
}
