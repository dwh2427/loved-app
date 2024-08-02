import { errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import jwt from "jsonwebtoken";
import { Twilio } from 'twilio';

const twilioClient = new Twilio(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);

connectDB();

export async function POST(request) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();

    // Destructure otp and phone from the request body
    const { code, phone } = body;

    // Verify OTP using Twilio
    const verificationCheck = await twilioClient.verify.v2
      .services("VA648edb96cc292fb93ce5880c20e6de42")
      .verificationChecks.create({
        code: code,
        to: "+"+phone,
      });

    if (verificationCheck.status === 'approved') {
      // Check if user already exists
      let user = await User.findOne({ phone });

      if (!user) {
        // If user doesn't exist, create a new user
        user = new User({ phone });
        await user.save();
      }

      // Generate a JWT token
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { uid: user.uid, _id: user._id, phone: user.phone },
        jwtSecret,
        { expiresIn: "7d" }
      );

      // Return a JSON response with the JWT token
      return new Response(
        JSON.stringify({ token, user }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ status: false, message: "Incorrect OTP" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
