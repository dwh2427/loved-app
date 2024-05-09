import admin from "@/firebase/firebase-admin";
import { headers } from "next/headers";
import { createError, errorResponse } from "./server-error";
const verifyIdToken = async (req) => {
  try {
    const token = headers().get("Authorization")?.split(" ")[1];
    if (!token) {
      createError("token not found", 400);
    }
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      return decodeValue;
    }
    return createError("Unauthorized", 401);
  } catch (e) {
    return errorResponse(e);
  }
};

export default verifyIdToken;
