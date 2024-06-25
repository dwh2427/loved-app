import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();
export async function POST(request) {
  // check user email exits or not
  const body = await request.json();
  const { email, userId } = body;
  const user = await User.findOne({ email });

  if (user) {
    return Response.json({ result: true, user });
  }
  return Response.json({ result: false, message: "not found" });
}
