import verifyIdToken from "@/lib/server-auth";
import { errorResponse } from "@/lib/server-error";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();
export async function GET(request) {
  try {
    const useratuh = await verifyIdToken(request);
    const user = await User.findOne({ uid: useratuh.uid });
    return Response.json(user);
  } catch (error) {
    return errorResponse(error);
  }
}
