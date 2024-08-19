import createStripeAccount from "@/lib/createStripeAccount";
import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import countrys from "@/public/countrys.json";
import { headers } from "next/headers"; // Import headers from Next.js
connectDB();

export async function POST(request) {
  // Extract IP address from headers
  const ip = (headers().get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  // Extract user agent from headers
  const user_agent = headers().get("user-agent");
  let fetchUser = null;
  let page = null;
  let pageFor = null;
  let authUser = null;
  try {
    const user = await verifyIdToken(request);

    authUser = user;
    // Parse the JSON body of the request
    const body = await request.json();
    // Destructure the userData and pageData from the request body
    const { pageData } = body;

    // Destructure individual fields from pageData
    const {
      first_name,
      last_name,
      username,
      page_name,
      family_member_type,
      currency,
    } = pageData;
    // console.log(currency);

    pageFor = pageData.pageFor;
    if (pageFor === "family-member") {
      pageFor = "family_member";
    }

    fetchUser = await User.findOne({ _id: user._id });
    if (pageFor === "yourself") {
      if (fetchUser?.page) {
        return createError(
          "You can not create multiple page for yourself",
          400,
        );
      }
    }
    // Check if all fields in pageData are not empty
    const isPageData = Object.values(pageData).every((i, ind, arr) => i);

    // If any required params are missing, return a 400 error
    if (!isPageData) return createError("missing required params", 400);
    // Create a new Loved instance with the provided pageData

    const newPage = new Loved({
      uid: user.uid,
      pageFor,
      first_name,
      last_name,
      family_member_type,
      username,
      page_name,
      user: fetchUser?._id,
      currency: currency,
    });

    page = newPage;

    await newPage.save();

    console.log(newPage);
    // If family_member_type is "yourself" and newUser exists,
    // update the User document to include the newPage's ID
    if (pageFor === "yourself") {
      await User.findOneAndUpdate({ _id: user._id }, { page: newPage._id });
    }

    // Return a JSON response with the newly created user data
    return Response.json(newPage);
  } catch (error) {
    
    return errorResponse(error);
  }
}
