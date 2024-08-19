import { errorResponse } from "@/lib/server-error";
import { Twilio } from 'twilio';
const twilioClient = new Twilio(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);


export async function POST(request) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();
    // Destructure email and password from the request body
    const { phone } = body;

    const verification = await twilioClient.verify.v2
    .services("VA648edb96cc292fb93ce5880c20e6de42")
    .verifications.create({
      channel: "sms",
      to: '+'+phone, // The user's phone number
    });

    // Return a JSON response with the JWT token
    return Response.json({status: 200, message: 'OTP sent successfully' });
  } catch (error) {
    // If an error occurs, return an error response
    return Response.json({status: 400, message: 'Please try after some times!' });
  }
}
