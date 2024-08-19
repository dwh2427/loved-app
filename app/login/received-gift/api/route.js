import { errorResponse } from "@/lib/server-error";
import Comment from "@/models/Comment";
import connectDB from "@/mongodb.config";

connectDB();

export async function GET(request) {
  try {
    // Extract the search parameters from the URL
    const { searchParams } = new URL(request.url);
    const uniqueId = searchParams.get('unique_id');

    if (!uniqueId) {
      return Response.json({ status: 400, message: 'unique_id is required' }, { status: 400 });
    }

    // Find the comment based on the uniqueId
    const comment = await Comment.findOne({ uniqueId });

    if (!comment) {
      return Response.json({ status: 404, message: 'Comment not found' }, { status: 404 });
    }

    // Return the found comment
    return Response.json({ status: 200, comment: comment }, { status: 200 });
  } catch (error) {
    // Return an error response if something goes wrong
    return Response.json({ status: 500, message: 'Please try after some time!' }, { status: 500 });
  }
}
