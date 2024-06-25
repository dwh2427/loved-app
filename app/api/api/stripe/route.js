import createStripeAccount from "@/lib/createStripeAccount";
import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import countrys from "@/public/countrys.json";
import { headers } from "next/headers"; // Import headers from Next.js
import Stripe from "stripe";
// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

// Connect to MongoDB
connectDB();

// Define GET request handler
export async function POST(req) {
  // Extract IP address from headers
  const ip = (headers().get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  // Extract user agent from headers
  const user_agent = headers().get("user-agent");

  try {
    // Verify user token
    const user = await verifyIdToken(req);

    // Parse request payload
    const payload = await req.json();

    // Destructure payload
    const {
      pageId,
      date_of_birth,
      city,
      street_address,
      state,
      postal_code,
      phone,
    } = payload;

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
    let authUser = await User.findOne({ uid: user.uid });

    // check if addition information is exist
    if (authUser && !authUser?.additional_info) {
      authUser = {
        ...authUser,
        additional_info: payload,
      };
      await authUser.save();
    }

    // Find the Loved page
    const page = await Loved.findOne({ uid: user.uid, _id: pageId });
    // If page is not found, throw an error
    !page && createError("Page not found", 404);
    // Create account details object for Stripe


    const country = countrys.find(
      (i) => i.country_code === page?.additional_info?.country,
    );
    if (!country) return Response.json({ message: "country not supported" });

    // const accountDetails = {
    //   type: "custom",
    //   country: country?.country_code,
    //   business_type: "individual",
    //   email: user.email,
    //   default_currency: country?.currency,
    //   business_profile: {
    //     mcc: "5734",
    //     name: `${page.first_name} ${page.last_name}`,
    //     url: process.env.NEXT_BUSENESS_URL,
    //   },
    //   individual: {
    //     email: user.email,
    //     phone: `+${phone}`,
    //     first_name: page.first_name,
    //     last_name: page.last_name,

    //     dob: {
    //       day: day,
    //       month: month,
    //       year: year,
    //     },
    //     registered_address: {
    //       city: city,
    //       state: state,
    //       country: country?.country_code,
    //       line1: street_address,
    //       postal_code: postal_code,
    //     },
    //     address: {
    //       city,
    //       state,
    //       country: country?.country_code,
    //       line1: street_address,
    //       postal_code,
    //     },
    //   },
    //   capabilities: {
    //     card_payments: { requested: true },
    //     transfers: { requested: true },
    //   },
    //   tos_acceptance: {
    //     date: Math.floor(Date.now() / 1000),
    //     ip: ip,
    //     user_agent: user_agent,
    //   },
    // };

    // Create account with Stripe
    const account = await createStripeAccount({
      page,
      country,
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
    }
    return errorResponse(error);
  }
}
