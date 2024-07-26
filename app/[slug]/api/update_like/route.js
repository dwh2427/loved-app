import verifyIdToken from "@/lib/server-auth";
import { createError, errorResponse } from "@/lib/server-error";
import Comments from "@/models/Comment";
import User from "@/models/user";
import connectDB from "@/mongodb.config";

connectDB();

export async function PUT(request) {
  const user = await verifyIdToken(request);
  const { commentId, action } = await request.json(); // Extract the action identifier

  try {
    // await Comments.updateMany({}, { $unset: { likes: "" } });
    let update;
    if (action === "add") {
      // Add like
      update = { $addToSet: { likes: { userId: user._id } } }; // Use $addToSet to prevent duplicate likes
    } else if (action === "remove") {
      // Remove like
      update = { $pull: { likes: { userId: user._id } } }; // Use $pull to remove the like
    } else {
      return createError("Invalid action", 400);
    }

    let comment = await Comments.findByIdAndUpdate(commentId, update, {
      new: true,
    });

    if (comment) {
      comment = await comment.populate({
        model: User,
        path: "likes.userId",
        select: "email first_name last_name ", // Select specific fields for replied_by and exclude _id
      });

      return Response.json({ data: comment });
    } else {
      return createError("Comment not found", 404);
    }
  } catch (error) {
    return errorResponse(error);
  }
}
