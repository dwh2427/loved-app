import { errorResponse } from "@/lib/server-error";
import connectDB from "@/mongodb.config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

connectDB();

export async function POST(req) {
  try {
    const {
      amount,
      currency,
      paymentType,
      connectedAccountId,
      application_amount_fee,
    } = await req.json();
    // Create a PaymentIntent with the specified amount, currency, and connected account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount * 100),
      currency,
      payment_method_types: [paymentType],
      application_fee_amount: Number(application_amount_fee).toFixed(2) * 100,
      transfer_data: {
        destination: connectedAccountId,
      },
    });

    return Response.json(paymentIntent, { status: 200 });
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error.message);
  }
}
