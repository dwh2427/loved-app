import { Storage } from "@google-cloud/storage";
import path from "path";
const storage = new Storage({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  keyFilename: path.join(process.cwd(), "./storage.json"),
});

export default storage;
