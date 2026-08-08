import { NextResponse } from "next/server";
import { checkPassword, setAdminSession } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (checkPassword(password)) {
      await setAdminSession();
      return NextResponse.json({ success: true, message: "Logged in successfully" });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
