import User from "@/models/user";
import connectDB from "@/mongodb.config";
import { NextResponse } from "next/server";

connectDB();
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, first_name, last_name, email } = body;
    const newUser = new User({
      uid,
      first_name,
      last_name,
      email,
    });

    await newUser.save();
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(error);
  }
}
