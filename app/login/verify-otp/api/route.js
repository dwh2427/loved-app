import { errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import CustomerActivity from "@/models/CustomerActivity";  // Import the UserActivity model
import connectDB from "@/mongodb.config";
import jwt from "jsonwebtoken";
import { Twilio } from 'twilio';
import { v4 as uuidv4 } from 'uuid';

const twilioClient = new Twilio(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);

connectDB();

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, phone } = body;

    const verificationCheck = await twilioClient.verify.v2
      .services("VA648edb96cc292fb93ce5880c20e6de42")
      .verificationChecks.create({
        code: code,
        to: "+" + phone,
      });

    if (verificationCheck.status === 'approved') {
      // Check if user already exists
      let user = await User.findOne({ phone });
      if (!user) {
        try {
          user = new User({ 
            uid: uuidv4(), // Generate a unique ID for the user
            phone
          });
          await user.save();
          

        } catch (error) {
          console.log(error);
          if (error.code === 11000) {
            user = await User.findOne({ phone });
          } else {
            throw error;
          }
        }
      }

      if (user) {

        // Log the sign-up activity
        const signUpActivity = new CustomerActivity({
          user: user._id,
          activityType: 'signIn',
          ip: request.headers.get('x-forwarded-for') || request.socket.remoteAddress,
        });
        await signUpActivity.save();
        
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          { uid: user.uid, _id: user._id, phone: user.phone },
          jwtSecret,
          { expiresIn: "7d" }
        );

        return new Response(
          JSON.stringify({ token, user }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
      } else {
        return new Response(
          JSON.stringify({ status: false, message: "User creation failed" }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
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
    const errorMessage = error.message || 'Internal Server Error';
    return new Response(
      JSON.stringify({ status: false, message: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
