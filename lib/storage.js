import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: "./loved-gcs-storage.config.json",
});

export default storage;
