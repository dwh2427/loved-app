import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();
export async function POST(request) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();

    // Destructure the userData and pageData from the request body
    const { userData, pageData } = body;

    // Destructure individual fields from userData
    const { uid, first_name: fn, last_name: ln, email } = userData;

    // Destructure individual fields from pageData
    const { pageFor, first_name, last_name, family_member_type, username } =
      pageData;

    // Check if all fields in userData are not empty
    const isUserData = Object.values(userData).every(
      (i, ind, arr) => i && arr.length === 4,
    );

    // Check if all fields in pageData are not empty
    const isPageData = Object.values(pageData).every(
      (i, ind, arr) => i && arr.length === 5,
    );

    // If any required params are missing, return a 400 error
    if (!isPageData && !isUserData)
      return createError("missing required params", 400);

    // Create a new User instance with the provided userData
    const newUser = new User({
      uid,
      first_name: fn,
      last_name: ln,
      email,
    });

    // Create a new Loved instance with the provided pageData
    const newPage = new Loved({
      uid,
      pageFor,
      first_name,
      last_name,
      family_member_type,
      username,
    });

    // Save the new User and Loved instances to the database
    await newUser.save();
    await newPage.save();

    // If family_member_type is "yourself" and newUser exists,
    // update the User document to include the newPage's ID
    if (pageFor === "yourself" && newUser) {
      await User.findOneAndUpdate({ uid }, { page: newPage._id });
    }

    // Return a JSON response with the newly created user data
    return Response.json({ newUser, newPage });
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
