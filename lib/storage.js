import { Storage } from "@google-cloud/storage";
import path from "path";

// Construct the absolute file path
const keyFilePath = path.join(process.cwd(), "loved-gcs-storage.config.json");

const storage = new Storage({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  keyFilename: keyFilePath,
});

export default storage;
