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
    const loved = await Loved.findOne({ uid, username });
    return NextResponse.json({ user, loved });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(error);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { uid, username } = body;
    const checkUser = await User.findOne({ username });
    if (checkUser) {
      return NextResponse.json({ message: "This link is already used" });
    }
    const user = await User.findOneAndUpdate(
      { uid },
      { username },
      { new: true },
    );

    return NextResponse.json({ data: user, message: "Page Link is Updated" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(error);
  }
}
