import createStripeAccount from "@/lib/createStripeAccount";
import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import Comments from "@/models/Comment";  // Import Comments model
import connectDB from "@/mongodb.config";
import countrys from "@/public/countrys.json";
import { headers } from "next/headers"; // Import headers from Next.js
import stripe from 'stripe'; // Import Stripe
const stripeClient = stripe(process.env.NEXT_STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

// Connect to MongoDB
connectDB();

// Define POST request handler
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
    const { pageId, emailAddress, uniqueId } = payload;
    page_id = pageId;

    // Array to store missing parameters
    const missing_params = [];

    // Filter out 'uniqueId' from the list of required parameters
    const requiredParams = Object.keys(payload).filter(param => param !== 'uniqueId');

    // Check if all required parameters are present
    const isPayloads = requiredParams.every((param) => {
      if (!payload[param]) {
        missing_params.push(param);
        return false; // Indicate that at least one required parameter is missing
      }
      return true;
    }) && requiredParams;

    // If any required parameter is missing, throw an error
    !isPayloads && createError(`Missing required params: ${missing_params.join(", ")}`, 400);


    // Find logged in user
    const authUser = await User.findOneAndUpdate(
      { _id: user?._id },
      {
        email: emailAddress, // Update the email field at the root level
        additional_info: payload,
      },
      { new: true }
    );

    fetchUser = authUser;

    // Find the Loved page
    const page = await Loved.findOne({ user: user._id, _id: pageId });

    // If page is not found, throw an error
    if (!page) createError("Page not found", 404);


    // Create account with Stripe
    const account = await createStripeAccount({
      page,
      user: authUser,
      ip,
      user_agent,
    });

    // Check if uniqueId is present in the payload
    let chargeId = null;
    if (uniqueId) {
      // Find the matching comment by uniqueId
      const comment = await Comments.findOne({ uniqueId, is_paid: 0 });

      if (comment) {
        chargeId = comment.charge_id;
      } 
        
    // I want to transfer here please write necessary code. The charge id has id like this "ch_3PnCXMGPOp25gbgG1UUQEVdQ"
      if(chargeId && account){
        const charge = await stripeClient.charges.retrieve(chargeId);
        const tipAmount = Math.round((comment.tipAmount ) * 100);

        const transfer = await stripeClient.transfers.create({
          amount: tipAmount, // Transfer the full amount of the charge
          currency: charge.currency, // Use the currency from the charge
          destination: account.id, // Destination is the connected account ID
          source_transaction: chargeId, // The charge ID is used as the source
        // transfer_group: `ORDER_${uniqueId}`, // Optional transfer group identifier
        });

          // Update the page name
          comment.page_name = page.username;
          comment.is_paid = 1;
          await comment.save();
          
      }
   }

    // Insert Stripe account ID to Loved page model
    const updatePage = await Loved.findByIdAndUpdate(
      pageId,
      {
        stripe_acc_id: account.id,
      },
      { new: true }
    );


    return Response.json(updatePage, { status: 201 });
  } catch (error) {
    // Handle specific Stripe errors
    if (error.raw) {
      error = error.raw;
      if (error.param === "currency") {
        try {
          const country = countrys.find(
            (i) => i.country_code === fetchUser.additional_info.country
          );
          const page = await Loved.findOneAndUpdate(
            {
              user: fetchUser._id,
              _id: page_id,
            },
            { currency: country?.currency },
            { new: true }
          );

          const account = await createStripeAccount({
            page: page,
            user: fetchUser,
            ip,
            user_agent,
          });

          // Insert Stripe account ID to Loved page model
          const updatePage = await Loved.findByIdAndUpdate(
            page_id,
            {
              stripe_acc_id: account.id,
            },
            { new: true }
          );

          return Response.json(page);
        } catch (error) {
          error.raw && (error = error.raw);
          return errorResponse(error);
        }
      }
    }
    return errorResponse(error);
  }
}
