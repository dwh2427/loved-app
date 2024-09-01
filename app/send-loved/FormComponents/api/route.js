import { errorResponse } from "@/lib/server-error";
import Stripe from "stripe";
import verifyIdToken from "@/lib/server-auth";
import Comments from "@/models/Comment";
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb


const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  const user = await verifyIdToken(req);

  try {
    const body = await req.json();
    const tipAmount = body.tipAmount;
    const currency = body.currency;
    const applicationFeeAmount = body.applicationFeeAmount;

    if (!tipAmount || tipAmount <= 0) {
      throw new Error("Invalid amount provided.");
    }

    const todayStart = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setUTCHours(23, 59, 59, 999));
    
    // Ensure user._id is an ObjectId
    const totalTipToday = await Comments.aggregate([
      {
        $match: {
          comment_by: new ObjectId(user._id), // Convert user._id to ObjectId
          createdAt: {
            $gte: todayStart,
            $lte: todayEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$tipAmount" },
        },
      },
    ]);
    
    console.log(totalTipToday);  // Log the result to see what's returned

    const currentTotal = totalTipToday[0]?.total || 0;
    const newTotal = currentTotal + tipAmount;

    if (newTotal > 5000) {
      return new Response(JSON.stringify({ message: "You have exceeded your daily donation limit of 5,000", clientSecret: false }), { status: 200 });
    }

    const totalAmount = Math.round((tipAmount + applicationFeeAmount) * 100); // Convert to the smallest currency unit

    const paymentIntent = await stripe.paymentIntents.create({
      currency: currency,
      amount: totalAmount,
     // payment_method_types: ['card', 'link', 'apple_pay'],
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
