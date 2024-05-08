import { errorResponse } from "./server-error";
import storage from "./storage";
export async function uploadFileToGCS(fileData) {
  try {
    // Get the file name, content, and content type from the file data
    const { name } = fileData;
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    // Decode the base64-encoded content

    const buffer = await fileData.arrayBuffer();
    // Upload the file to Google Cloud Storage
    await storage
      .bucket(bucketName)
      .file(`images/${name}`)
      .save(Buffer.from(buffer));

    // Return the public URL of the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/images/${name}`;
    return publicUrl;
  } catch (error) {
    return errorResponse(error);
  }
}
