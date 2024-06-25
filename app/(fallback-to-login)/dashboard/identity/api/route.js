import verifyIdToken from "@/lib/server-auth";
import { errorResponse } from "@/lib/server-error";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);
export async function POST(request) {
  try {
    let front_obj, back_obj;

    const user = await verifyIdToken(request);
    const form = await request.formData();

    // const file = form.get("file");
    const front_image = form.get("front_side_image");
    const back_image = form.get("back_side_image");
    // const _id = form.get("pageId");
    const stripeConnectAccountId = form.get("stripe_account_id");

    // return ''
    if (front_image) {
      const frontFileBuffer = await front_image.arrayBuffer();
      front_obj = await stripe.files.create({
        purpose: "identity_document",
        file: {
          data: Buffer.from(frontFileBuffer),
          name: front_image.name,
          type: front_image.type,
        },
      });
    }

    if (back_image) {
      const backFileBuffer = await back_image.arrayBuffer();
      back_obj = await stripe.files.create({
        purpose: "identity_document",
        file: {
          data: Buffer.from(backFileBuffer),
          name: back_image.name,
          type: back_image.type,
        },
      });
    }

    if (front_obj || back_obj) {
      await stripe.accounts.update(stripeConnectAccountId, {
        individual: {
          verification: {
            document: {
              front: front_obj ? front_obj.id : null,
              back: back_obj ? back_obj.id : null,
            },
          },
        },
      });
    }

    const details = await stripe.accounts.retrieve(stripeConnectAccountId);

    return Response.json(
      {
        message: "Success",
        payoutsEnabled: details.payouts_enabled,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error.raw) {
      error = error.raw;
    }
    return errorResponse(error);
  }
}
