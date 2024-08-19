import verifyIdToken from "@/lib/server-auth";
import { errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

export async function POST(request) {
  await connectDB();
  // check user email exits or not
  try {
        // Assuming decodeValue contains the phone number
      const verifyuser = await verifyIdToken(request);

      console.log(verifyuser);
      console.log(verifyuser?.phone);
      // Find the user by phone number
      const user = await User.findOne({ phone: verifyuser?.phone });


    if (user) {
      return Response.json({ result: true, data: user });
    }
    
    return Response.json({ result: false });
  } catch (error) {
 
    return errorResponse(error);
  }
}
