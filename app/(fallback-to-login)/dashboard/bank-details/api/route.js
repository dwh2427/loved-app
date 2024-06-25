import verifyIdToken from "@/lib/server-auth";
import { errorResponse } from "@/lib/server-error";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);
export const POST = async (request) => {
  const body = await request.json();
  const {
    stripe_account_id,
    account_holder_name,
    account_number,
    routing_number,
    country,
    currency,
  } = body;

  try {
    const user = await verifyIdToken(request);
    const externalBank = {
      external_account: {
        object: "bank_account",
        account_holder_type: "individual",
        account_holder_name,
        account_number: account_number,
        routing_number: routing_number,
        country: country,
        currency: currency,
        default_for_currency: true,
        // metadata: {
        //   abn,
        // },
      },
    };

    await stripe.accounts.createExternalAccount(
      stripe_account_id,
      externalBank,
    );

    const details = await stripe.accounts.retrieve(stripe_account_id);
    return Response.json(
      {
        message: "Success",
        payoutsEnabled: details.payouts_enabled,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error.raw) {
     return errorResponse(error.raw)
    }
   return  errorResponse(error);
  }
};
