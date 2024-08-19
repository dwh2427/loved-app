import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { createError } from "./server-error";

const verifyIdToken = async (req) => {
  try {
    const authHeader = headers().get("Authorization");
    console.log(authHeader);
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
      // Ensure that the phone number is returned
      return decodeValue; // This should include phone if it's in the token
    } else {
      createError("Unauthorized", 401);
    }
  } catch (e) {
    if (e.message === "jwt expired") {
      return createError("Unauthorized", 401);
    } else throw e;
  }
};

export default verifyIdToken;
