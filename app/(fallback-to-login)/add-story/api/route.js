import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import connectDB from "@/mongodb.config";

connectDB();

export async function PUT(request) {
  try {
    const authUser = await verifyIdToken(request);
    const body = await request.json();
    const { pageId, story } = body;
    if (!pageId && !story) {
      createError("missing required params", 400);
    }
    const loved = await Loved.findOneAndUpdate(
      { uid: authUser.uid, _id: pageId },
      { story },
      { new: true },
    );

    return Response.json({ data: loved, message: "Story is Added" });
  } catch (error) {
    errorResponse(error);
  }
}
