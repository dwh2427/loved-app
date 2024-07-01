import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);
connectDB();
// This function handles GET requests, typically used to retrieve resources.
export async function GET(request) {
  try {
    // Verifies the Firebase ID token from the request to authenticate the user.
    const authUser = await verifyIdToken(request);
    // Retrieves the authenticated user's data from the database based on the UID.
    const user = await User.findOne({ uid: authUser.uid });

    // Retrieves data for the user specified by the username.
    let loved = await Loved.find({ uid: authUser.uid }).sort({
      createdAt: -1,
    });

    // Filter out the loved items that do not have a stripe_acc_id.
    loved = loved.filter((i) => i?.stripe_acc_id);

    // Iterate over each loved item and retrieve the balance.
    const newLovePages = await Promise.all(
      loved.map(async (i) => {
        const balance = await stripe.balance.retrieve({
          stripeAccount: i.stripe_acc_id,
        });
        return { ...i._doc, balance };
      }),
    );

    // Returns a JSON response containing data for the authenticated user and the user specified by the username.
    return Response.json({ user, loved: newLovePages });
  } catch (error) {
    // If an error occurs during the process, returns an error response.
    return errorResponse(error);
  }
}

// This function handles PUT requests, typically used to update resources.
export async function PUT(request) {
  try {
    // Verifies the Firebase ID token from the request to authenticate the user.
    const authUser = await verifyIdToken(request);

    // Parses the request body to extract required data.
    const body = await request.json();
    const { newUsername, _id } = body;

    // Constructs a query to find if a user with the new username already exists.
    const findQuery = {
      uid: authUser.uid, // User ID from the authenticated user
      _id, // New username to check
    };

    // Checks if a user with the new username already exists.
    const checkUser = await Loved.findOne({ username: newUsername });

    // If a user with the new username exists, returns an error response.
    if (checkUser) {
      return createError("This link is already used", 400);
    }

    // Updates the username of the authenticated user in the database.

    const page = await Loved.findOneAndUpdate(
      findQuery, // Find query to identify the user
      { username: newUsername }, // New username to update
      { new: true }, // Returns the updated document
    );
    console.log(newUsername, page);
    // Returns a success response with the updated user data.
    return Response.json(
      { data: page, message: "Page Link is Updated" },
      { status: 200 }, // HTTP status code indicating success
    );
  } catch (error) {
    // If an error occurs during the process, returns an error response.
    return errorResponse(error);
  }
}
