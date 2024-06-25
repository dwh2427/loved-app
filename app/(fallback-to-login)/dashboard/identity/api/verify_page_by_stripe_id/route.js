import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stripe_account_id = searchParams.get("stripe_account_id");
  try {
    const page = await Loved.findOne({ stripe_acc_id: stripe_account_id });
    const account = await stripe.accounts.retrieve(stripe_account_id);
    if (page && account) {
      return Response.json({ page, account }, { status: 200 });
    } else return createError("page not found", 404);
  } catch (error) {
    if (error.raw) {
      error = error.raw;
    }
    return errorResponse(error);
  }
}
