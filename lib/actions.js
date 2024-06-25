"use server";

import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

export const UploadFile = async (form) => {
  try {
    const file = form.get("image");
    if (!file) throw new Error("No file provide");

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const buffer = await file.arrayBuffer();
    const storage = new Storage();
    await storage
      .bucket(bucketName)
      .file(`images/${file.name}`)
      .save(Buffer.from(buffer));
    const publicUrl = `https://storage.googleapis.com/${bucketName}/images/${name}`;

    return NextResponse({ publicUrl });
  } catch (error) {}
};