import { createError, errorResponse } from "@/lib/server-error";
import { uploadFileToGCS } from "@/lib/uploadFIleToGCS";
import Loved from "@/models/loved";
export const POST = async (request) => {
  try {
    // Parse incoming form data to get the uploaded file
    // const body = await request.json();
    const form = await request.formData();
    const file = form.get("file");
    const username = form.get("username");
    const uid = form.get("uid");
    if (!file && !username && !uid)
      return createError("required params is missing", 400);

    const imageLink = await uploadFileToGCS(file);
    const update = await Loved.findOneAndUpdate(
      { username, uid },
      { $push: { images: imageLink } },
      { new: true }, // To return the updated document
    );
    return Response.json({ data: update, message: "Uploaded successfully" });
  } catch (error) {
    return errorResponse(error);
  }
};
