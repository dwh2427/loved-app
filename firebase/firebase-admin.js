import admin from "firebase-admin";
import { adminConfig } from "./loved-c863b-firebase-admin.js";

try {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
  console.log("Initialized.");
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default admin;
