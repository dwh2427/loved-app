import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import connectDB from "@/mongodb.config";
connectDB();
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    // Parse the JSON body of the request

    const pageId = searchParams.get("pageId");
    if (!pageId) createError("missing required params", 400);
    const page = await Loved.findById(pageId);
    return Response.json(page);
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
