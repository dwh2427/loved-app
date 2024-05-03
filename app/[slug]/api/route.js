import Loved from "@/models/loved";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const username = request.nextUrl.pathname.split("/")[1];
    const user = await Loved.findOne({ username });
    return NextResponse.json({ data: user, success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ data: error, success: false });
  }
}
