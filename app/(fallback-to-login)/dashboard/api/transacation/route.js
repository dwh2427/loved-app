import { errorResponse } from "@/lib/server-error";
import connectDB from "@/mongodb.config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY , {
 apiVersion: '2024-04-10;'
});

connectDB();

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const connectId = searchParams.get("connectId");
  try {
    // Verifies the Firebase ID token from the request to authenticate the user.

    const financialAccounts = await stripe.accountSessions.create({
      account: connectId,
      components: {
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
          }
        },
      }
    });

    // Returns a JSON response containing data for the authenticated user and the user specified by the username.
    return Response.json({client_secret: financialAccounts.client_secret});
  } catch (error) {
    // If an error occurs during the process, returns an error response.
    return errorResponse(error);
  }
}
