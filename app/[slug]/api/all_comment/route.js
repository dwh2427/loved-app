import { errorResponse } from "@/lib/server-error";
import Comments from "@/models/Comment";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();
export async function GET(request) {
  const page_name = request.nextUrl.pathname.split("/")[1];
  try {
    // await Comments.updateMany({}, { $unset: { likes: "" } });
    const comments = await Comments.find({ page_name })
      .populate({
        model: User,
        path: "replies.replied_by",
        select: "email first_name last_name", // Select specific fields for replied_by
      })
      .populate({
        model: User,
        path: "likes.userId",
        select: "email first_name last_name", // Select specific fields for replied_by
      })
      .populate({
        path: "comment_by",
        select: "additional_info first_name last_name createdAt",
      });

    return Response.json({ data: comments });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    return errorResponse(error);
  }
}

export async function PUT(request) {
  // comment like
  const { commentId, user } = await request.json();
  try {
    const comment = await Comments.findOneAndUpdate(
      { _id: commentId },
      { $push: { likes: user } },
      { new: true },
    );
    return Response.json({ data: comment });
  } catch (error) {
    return errorResponse(error);
  }
}
