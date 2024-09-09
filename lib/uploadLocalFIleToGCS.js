import { errorResponse } from "./server-error";
import storage from "./storage";
export async function uploadLocalFIleToGCS(base64Data, filename) {
  try {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    
    // Convert base64 string to a buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Define the bucket and file path in GCS
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`images/${filename}`);

    // Upload the buffer to Google Cloud Storage
    await file.save(buffer, {
      contentType: 'image/png', // Specify content type (if needed)
      public: true, // Make the file public
    });

    // Return the public URL of the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/images/${filename}`;
    return publicUrl;
    
  } catch (error) {
    return errorResponse(error);
  }
}
