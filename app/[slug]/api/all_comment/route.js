import { errorResponse } from "@/lib/server-error";
import Comments from "@/models/Comment";
import connectDB from "@/mongodb.config";

connectDB();
export async function GET(request) {
  const page_name = request.nextUrl.pathname.split("/")[1];
  try {
    const comment = await Comments.find({ page_name }).sort({createdAt:-1});
    return Response.json({ data: comment });
  } catch (error) {
    return errorResponse(error);
  }
}
