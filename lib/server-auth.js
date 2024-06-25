import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { createError } from "./server-error";

const verifyIdToken = async (req) => {
  try {
    const authHeader = headers().get("Authorization");
    if (!authHeader) {
      createError("Authorization header not found", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      createError("Token not found", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    const decodeValue = jwt.verify(token, jwtSecret);

    if (decodeValue) {
      return decodeValue;
    } else {
      createError("Unauthorized", 401);
    }
  } catch (e) {
    throw e;
  }
};

export default verifyIdToken;
