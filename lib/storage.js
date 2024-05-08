import { Storage } from "@google-cloud/storage";
const storage = new Storage({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  keyFilename: process.env.NEXT_PUBLIC_GCS_STORAGE_PATH,
});

export default storage;
