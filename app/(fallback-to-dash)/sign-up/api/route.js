import User from "@/models/user";
import connectDB from "@/mongodb.config";
import { NextResponse } from "next/server";

connectDB();
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, first_name, last_name, email, family_member_type } = body;
    const newUser = new User({
      uid,
      first_name,
      last_name,
      email,
      family_member_type,
      username: `${first_name?.toLowerCase()}${Math.round(Math.random() * 124)}`,
    });

    await newUser.save();
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    NextResponse.json(error);
  }
}
