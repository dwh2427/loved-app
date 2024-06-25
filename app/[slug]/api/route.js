import { errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import connectDB from "@/mongodb.config";

connectDB();
export async function GET(request) {
  const username = request.nextUrl.pathname.split("/")[1];

  try {
    const user = await Loved.findOne({
      username,
      stripe_acc_id: { $ne: null },
    });

    return Response.json({ data: user, success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
