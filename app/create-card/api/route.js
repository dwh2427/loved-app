import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for unique filenames
import path from 'path';
import fs from 'fs';
import verifyIdToken from "@/lib/server-auth";
import { uploadLocalFIleToGCS } from "@/lib/uploadLocalFIleToGCS";

export async function POST(request) {
  try {

    const useratuh = await verifyIdToken(request);
    console.log(useratuh);

    // Parse the request body (required for Next.js API routes)
    const { imageData } = await request.json(); // Parse the JSON body

    if (!imageData) {


      return Response.json({ result: false, data: {} });
    }

    // Generate a unique filename
    const uniqueFilename = `${useratuh.uid}.png`;

    // Path to save the image in the public/temp directory
    const savePath = path.join(process.cwd(), 'public', 'temp', uniqueFilename);

    // Remove the "data:image/png;base64," prefix from the image data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    // Convert HEIC to JPEG
    //   Dynamically import the module

    const jpegImageLink = await uploadLocalFIleToGCS(base64Data, uniqueFilename);; // Uploading JPEG file to GCS


    return Response.json({ result: true, data: {filename:uniqueFilename, fileUrl: jpegImageLink} });

  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}
