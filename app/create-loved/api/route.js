import { createError, errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import connectDB from "@/mongodb.config";
import { NextResponse } from "next/server";

connectDB();
export async function POST(request) {
  try {
    const body = await request.json();
    const { first_name, last_name, family_member_type, username, uid } = body;
    const isPagesLinkExist = await Loved.findOne({ username });
    if (isPagesLinkExist) {
      return createError("Sorry! This link is already taken", 400);
    }
    const newLove = new Loved({
      first_name,
      last_name,
      family_member_type,
      username,
      uid,
    });

    await newLove.save();
    return NextResponse.json({ data: newLove }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const uid = searchParams.get("uid");
    const username = searchParams.get("username");
    const user = await Loved.findOne({ uid, username });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(error);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { uid, username } = body;
    const checkUser = await Loved.findOne({ username });
    if (checkUser) {
      return NextResponse.json({ message: "This link is already used" });
    }
    const user = await Loved.findOneAndUpdate(
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
