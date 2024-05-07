import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import { NextResponse } from "next/server";

connectDB();
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get("uid");
    const username = searchParams.get("username");
    const user = await User.findOne({ uid });
    const loved = await Loved.findOne({ username });

    return NextResponse.json({ user, loved });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(error);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { newUsername, username } = body;

    const checkUser = await Loved.findOne({ username: newUsername });
    if (checkUser) {
      return createError("This link is already used", 400);
    }

    const user = await Loved.findOneAndUpdate(
      { username },
      { username: newUsername },
      { new: true },
    );

    return NextResponse.json(
      { data: user, message: "Page Link is Updated" },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
