import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();
export async function POST(request) {
  try {
    const user = await verifyIdToken(request);
    // Parse the JSON body of the request
    const body = await request.json();
    // Destructure the userData and pageData from the request body
    const { pageData } = body;

    // Destructure individual fields from pageData
    const { first_name, last_name, family_member_type } = pageData;

    let pageFor = pageData.pageFor;
    if (pageFor === "family-member") {
      pageFor = "family_member";
    }
    
    let fetchUser = null;
    fetchUser = await User.findOne({ uid: user.uid });
    if (pageFor === "yourself") {
      if (fetchUser?.page) {
        return createError(
          "You can not create multiple page for yourself",
          400,
        );
      }
    }
    // Check if all fields in pageData are not empty
    const isPageData = Object.values(pageData).every(
      (i, ind, arr) => i && arr.length === 4,
    );

    // If any required params are missing, return a 400 error
    if (!isPageData) return createError("missing required params", 400);
    // Create a new Loved instance with the provided pageData

    const newPage = new Loved({
      uid: user.uid,
      pageFor,
      first_name,
      last_name,
      family_member_type,
      username: `${Date.now()}`,
      user: fetchUser?._id,
    });

    await newPage.save();

    // If family_member_type is "yourself" and newUser exists,
    // update the User document to include the newPage's ID
    if (pageFor === "yourself") {
      await User.findOneAndUpdate({ uid: user.uid }, { page: newPage._id });
    }

    // Return a JSON response with the newly created user data
    return Response.json(newPage);
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
