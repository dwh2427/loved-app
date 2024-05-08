import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";

export async function GET(request) {
  const username = request.nextUrl.pathname.split("/")[1];

  try {
    const user = await Loved.findOne({ username });
    if (!user) return createError("not found", 404);
    return Response.json({ data: user, success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
