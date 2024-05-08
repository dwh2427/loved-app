import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  keyFilename: "./loved-gcs-storage.config.json",
});

export default storage;
