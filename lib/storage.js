import { Storage } from "@google-cloud/storage";
import file from "/storage.json";
const storage = new Storage({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  keyFilename: file,
});

export default storage;
