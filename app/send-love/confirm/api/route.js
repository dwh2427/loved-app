
import Stripe from "stripe";

import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

import { headers } from "next/headers"; // Import headers from Next.js


// Connect to MongoDB
connectDB();


const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
   // Extract IP address from headers
   const ip = (headers().get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
   // Extract user agent from headers
   const user_agent = headers().get("user-agent");
   let fetchUser = null;
   let page_id = null;
 
   try {
     // Verify user token
     const user = await verifyIdToken(req);
 
     // Parse request payload
     const payload = await req.json();


 
     // Destructure payload
     const {paymentMethodId } = payload;


     const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
     const last4 = paymentMethod.card.last4;
     const brand = paymentMethod.card.brand;

    // Find logged in user
    const authUser = await User.findOneAndUpdate(
        { _id: user?._id },
        {
            paymentMethodId: paymentMethodId, // Update the email field at the root level
            last4: last4,
            brand: brand
        },
        { new: true }
      );
      return Response.json({ last4, brand }, { status: 200 });
  } catch (error) {  error.raw && (error = error.raw);
    return errorResponse(error);
  }
}



export async function GET(req) {
    try {
      const currency = "USD";
      
      // Amount should be a valid number (in cents for USD)
      const amount = 2000; // Example amount (20 USD)
  
      // Create a PaymentIntent with valid amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        currency: currency,
        amount: amount, // Amount in smallest unit (e.g., cents for USD)
        setup_future_usage: 'off_session', // Save payment method for future payments
      });
  
      // Return the clientSecret to the frontend
      return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
    } catch (error) {
      return errorResponse(error.message);
    }
  }
  