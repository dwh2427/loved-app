import createStripeAccount from "@/lib/createStripeAccount";
import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import countrys from "@/public/countrys.json";
import { headers } from "next/headers"; // Import headers from Next.js
// Connect to MongoDB
connectDB();

// Define GET request handler
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
    const { pageId } = payload;
    page_id = pageId;

    // Array to store missing parameters
    const missing_params = [];
    // Check if all required parameters are present
    const isPayloads =
      Object.keys(payload).every((param) => {
        if (!payload[param]) {
          missing_params.push(param);
          return false; // Indicate that at least one required parameter is missing
        }
        return true;
      }) && Object.keys(payload);

    // If any required parameter is missing, throw an error
    !isPayloads &&
      createError(`Missing required params: ${missing_params.join(", ")}`, 400);

    //Find Logged in user
    const authUser = await User.findOneAndUpdate(
      { _id: user?._id },
      { additional_info: payload },
      { new: true },
    );

    fetchUser = authUser;

    // Find the Loved page
    const page = await Loved.findOne({ user: user._id, _id: pageId });

    const updateLovedAddressInfo = await Loved.findOneAndUpdate(
      { user: user._id },
      { additional_info: payload },
      { new: true },
    );

    // If page is not found, throw an error
    !page && createError("Page not found", 404);
    // Create account details object for Stripe
    // Create account with Stripe
    const account = await createStripeAccount({
      page,
      user: authUser,
      ip,
      user_agent,
    });

    // Insert Stripe account ID to Loved page model
    const updatePage = await Loved.findByIdAndUpdate(
      pageId,
      {
        stripe_acc_id: account.id,
      },
      { new: true },
    );

    return Response.json(updatePage, { status: 201 });
  } catch (error) {
    // Return error response
    if (error.raw) {
      error = error.raw;
      if (error.param === "currency") {
        try {
          const contry = countrys.find(
            (i) => i.country_code === fetchUser.additional_info.country,
          );
          const page = await Loved.findOneAndUpdate(
            {
              user: fetchUser._id,
              _id: page_id,
            },
            { currency: contry?.currency },
            { new: true },
          );

          const account = await createStripeAccount({
            page: page,
            user: fetchUser,
            ip,
            user_agent,
          });

          // Insert Stripe account ID to Loved page model
          const updatePage = await Loved.findByIdAndUpdate(
            [page_id],
            {
              stripe_acc_id: account.id,
            },
            { new: true },
          );
          // Return a JSON response with the newly created user data
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
