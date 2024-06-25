import { createError, errorResponse } from "@/lib/server-error";
import Comments from "@/models/Comment";
import connectDB from "@/mongodb.config";

connectDB();

export async function GET(request) {
  // // get by page_name based data
  // const url = new URL(req.url);
  // const searchParams = url.searchParams;
  // const page_name = searchParams.get("page");
  const { searchParams } = new URL(request.url);
  try {
    const pageId = searchParams.get("pageName");
    // const page = await Loved.findById(pageId);
    const data = await Comments.find({ page_name: pageId });
    return Response.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    // Parse the JSON body of the request
    const commentData = await request.json();

    // Destructure individual fields from commentData
    const { text, username, pageName, userId, photo } = commentData;

    // // Create a new Comment instance with the provided commentData
    const newComments = new Comments({
      text,
      username,
      user: userId,
      photo,
      page_name: pageName,
    });

    await newComments.save();

    return Response.json({ newComments });
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
