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
    const body = await req.json();

    // Destructure payload
    const { uniqueId } = body;

    let chargeId = null;

    const page = await Loved.findOne({ user: user._id, stripe_acc_id: { $ne: null } });
    if (!page) {
      console.log('No page found or onboarding incomplete');
      return new Response(JSON.stringify({ status: 200, message: 'Please finish account onboarding to receive money!', url: `${base_URL}getting-started` }), { status: 200 });
    }

    if (!uniqueId) {
      console.log('Unique ID is missing');
      return new Response(JSON.stringify({ status: 400, message: 'unique_id is required' }), { status: 400 });
    }

    // Find the comment based on the uniqueId
    const comment = await Comment.findOne({ uniqueId, is_paid: 0 });
    console.log('Comment:', comment);

    if (!comment) {
      console.log('Comment not found or already paid');
      return new Response(JSON.stringify({ status: 404, message: 'Gift not found or already paid!' }), { status: 404 });
    }

    if (comment) {
      chargeId = comment.charge_id;
    }

    console.log('Page:', page);

    // Transfer the amount to the connected Stripe account
    if (chargeId && page.stripe_acc_id) {
      try {
        console.log('Retrieving charge with ID:', chargeId);
        const charge = await stripeClient.charges.retrieve(chargeId);
        const tipAmount = Math.round((comment.tipAmount) * 100);

        console.log('Creating transfer to:', page.stripe_acc_id, 'with amount:', tipAmount);
        const transfer = await stripeClient.transfers.create({
          amount: tipAmount, // Transfer the full amount of the charge
          currency: charge.currency, // Use the currency from the charge
          destination: page.stripe_acc_id, // Destination is the connected account ID
          source_transaction: chargeId, // The charge ID is used as the source
        });

        // Update the page name and mark the comment as paid
        comment.page_name = page.username;
        comment.is_paid = 1;
        await comment.save();

        console.log('Gift received successfully');
        return new Response(JSON.stringify({ status: 200, message: 'Gift received successfully!', url: `${base_URL}dashboard` }), { status: 200 });
      } catch (error) {
        console.error('Transfer error:', error);
        // If something goes wrong, return a generic response
        return new Response(JSON.stringify({ status: 500, message: error.message || "Unexpected error occurred" }), { status: 500 });
      }
    }else{
      return new Response(JSON.stringify({ status: 200, message: 'Gift received successfully!', url: `${base_URL}dashboard` }), { status: 200 });
    }

  } catch (error) {
    // Log the error and return an error response
    console.error('General error:', error);
    return new Response(JSON.stringify({ status: 500, message: error.message }), { status: 500 });
  }
}
