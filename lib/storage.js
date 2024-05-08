import { Storage } from "@google-cloud/storage";
import path from "path";

const keyFilePath = path.join("loved-gcs-storage.config.json");

const storage = new Storage({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  keyFilename: keyFilePath,
});

export default storage;
