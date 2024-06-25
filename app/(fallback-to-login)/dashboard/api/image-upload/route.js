import { createError, errorResponse } from "@/lib/server-error";
import { uploadFileToGCS } from "@/lib/uploadFIleToGCS";
import { uploadImage } from "@/lib/uploadImage";
import Loved from "@/models/loved";
export const POST = async (request) => {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const _id = form.get("pageId");

    if (!file || !_id)
      return createError("Required parameters are missing", 400);
    // console.log(file.type);
    if (file.type === "application/octet-stream") {
      // Convert HEIC to JPEG
      // Dynamically import the module
      // const heicConvert = await import("heic-convert");
      // const fs = await import("fs");
      // const arrayBuffer = await file.arrayBuffer();
      // const jpegBuffer = await heicConvert({
      //   buffer: arrayBuffer,
      //   format: "JPEG",
      //   quality: 1, // Quality 1 (highest) will maintain original quality
      // });

      // // Save the JPEG file locally
      // const localFilePath = path.join("uploads", `${file.name}.jpeg`);
      // await writeFile(localFilePath, jpegBuffer);

      // // Proceed with cloud upload and database update
      // // const imageLink = await uploadFileToGCS(file); // Uploading HEIC file to GCS
      // const jpegFile = new File([jpegBuffer], `${file.name}.jpeg`, {
      //   type: "image/jpeg",
      // });
      // console.log(jpegFile);

      // const jpegImageLink = await uploadFileToGCS(file); // Uploading JPEG file to GCS
      // const update = await Loved.findOneAndUpdate(
      //   { username, uid },
      //   { $push: { images: jpegImageLink } },
      //   { new: true }, // To return the updated document
      // );

      return createError("Sorry! Currently this file type is not supported");
    } else {
      // If file type is not HEIC, directly upload to cloud and update database
      // const imageLink = await uploadFileToGCS(file);
      const imageLink = await uploadImage(file);

      const update = await Loved.findOneAndUpdate(
        { _id },
        { $push: { images: imageLink } },
        { new: true }, // To return the updated document
      );

      return Response.json({ data: update, message: "Uploaded successfully" });
    }
  } catch (error) {
    return errorResponse(error);
  }
};
