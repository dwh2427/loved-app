import { errorResponse } from "@/lib/server-error";
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    // Parse the request body
    const { imageData } = await req.json();

    if (!imageData) {
      return new Response(JSON.stringify({ success: false, message: 'No image data provided' }), { status: 400 });
    }

    // Generate a unique image name using the current timestamp
    const cardImage = `image_${Date.now()}.png`;

    // Decode the base64 image
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    // Define the path where you want to save the image
    const filePath = path.join(process.cwd(), 'public', 'tmp', cardImage);

    // Save the image to the file system
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Return the unique image name in the response
    return new Response(JSON.stringify({
      success: true,
      message: 'Image saved successfully',
      imageName: cardImage
    }), { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return errorResponse(error);
  }
}
