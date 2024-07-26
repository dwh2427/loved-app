import verifyIdToken from "@/lib/server-auth";
import { errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

export async function POST(request) {
  await connectDB();
  // check user email exits or not
  try {
    const verifyuser = await verifyIdToken(request);
  
    const user = await User.findOne({ email: verifyuser?.email });

    if (user) {
      return Response.json({ result: true, data: user });
    }
    
    return Response.json({ result: false });
  } catch (error) {
 
    return errorResponse(error);
  }
}
