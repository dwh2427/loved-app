import { errorResponse } from "@/lib/server-error";
import Comment from "@/models/Comment";
import connectDB from "@/mongodb.config";
import verifyIdToken from "@/lib/server-auth";
import Loved from "@/models/loved";
import stripe from 'stripe'; // Import Stripe

const base_URL = process.env.NEXT_PUBLIC_BASE_URL;
const stripeClient = stripe(process.env.NEXT_STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

connectDB();

export async function POST(req) {
  try {

    const user = await verifyIdToken(req);
    console.log(user);
    const body = await req.json();
    console.log('Received Payload:', body);

      // Destructure payload
    const {  uniqueId } = body;

    let chargeId = null;

    const page = await Loved.findOne({ user: user._id, stripe_acc_id: { $ne: null } });
    if (!page) {
        return new Response(JSON.stringify({ status: 200, message: 'Please finish account onboarding to receive money!', url: `${base_URL}getting-started` }), { status: 200 });
    }

    if (!uniqueId) {
      return new Response(JSON.stringify({ status: 400, message: 'unique_id is required' }), { status: 400 });
    }

    // Find the comment based on the uniqueId
    const comment = await Comment.findOne({ uniqueId, is_paid: 0 });
    console.log(page);

    if (!comment) {
      return new Response(JSON.stringify({ status: 404, message: 'Gift not found or already paid!' }), { status: 404 });
    }

    if (comment) {
        chargeId = comment.charge_id;
    }

    // Transfer the amount to the connected Stripe account
    if (chargeId && page.stripe_acc_id) {
      const charge = await stripeClient.charges.retrieve(chargeId);

      const transfer = await stripeClient.transfers.create({
        amount: charge.amount, // Transfer the full amount of the charge
        currency: charge.currency, // Use the currency from the charge
        destination: page.stripe_acc_id, // Destination is the connected account ID
        source_transaction: chargeId, // The charge ID is used as the source
      });

      // Update the page name and mark the comment as paid
      comment.page_name = page.username;
      comment.is_paid = 1;
      await comment.save();

      return new Response(JSON.stringify({ status: 200, message: 'Gift received successfully!', url: `${base_URL}dashboard` }), { status: 200 });
    } 

    // If something goes wrong, return a generic response
    return new Response(JSON.stringify({ status: 201, message: "Something went wrong!" }), { status: 201 });

  } catch (error) {
    // Log the error and return an error response
    console.error('Error:', error);
    return new Response(JSON.stringify({ status: 500, message: error.message }), { status: 500 });
  }
}
