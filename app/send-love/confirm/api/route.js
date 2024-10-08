import { errorResponse } from "@/lib/server-error";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const currency = "USD";
    
    // Amount should be a valid number (in cents for USD)
    const amount = 2000; // Example amount (20 USD)

    // Create a PaymentIntent with valid amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: currency,
      amount: amount, // Amount in smallest unit (e.g., cents for USD)
    });

    // Return the clientSecret to the frontend
    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
  } catch (error) {
    return errorResponse(error.message);
  }
}
