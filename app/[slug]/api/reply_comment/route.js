import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Comments from "@/models/Comment";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();

export async function PUT(request) {
  const user = await verifyIdToken(request);
  const { commentId, replyText } = await request.json();

  try {
    let comment = await Comments.findById(commentId)


    if (comment) {
      comment.replies.push({ replyText, replied_by: user._id });
      comment = await comment.save();
      comment = await comment.populate({
        model:User,
        path: "replies.replied_by",
        select: "email first_name last_name", // Select specific fields for replied_by
      });

      return Response.json({ data: comment });
    } else {
      return createError("not found", 400);
    }
  } catch (error) {
    console.error("Error saving comment:", error);
    return errorResponse(error);
  }
}
