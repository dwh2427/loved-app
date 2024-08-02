import { errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();

    // Destructure email and password from the request body
    const { email, password } = body;

    // Find user by email
    const user = await User.findOne({ email });
    // If user doesn't exist, return a 404 error
    if (!user) {
      return Response.json(
        { status: false, message: "User not found" },
        {
          status: 200,
        },
      );
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return Response.json(
        { status: false, message: "Incorrect password" },
        {
          status: 200,
        },
      );
    }

    // Generate a JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { uid: user.uid, _id: user._id, email: user.email },
      jwtSecret,
      {
        expiresIn: "7d",
      },
    );

    // Return a JSON response with the JWT token
    return Response.json({ token,user });
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
