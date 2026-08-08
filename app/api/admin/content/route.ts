import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/auth";
import { getSiteContent, saveSiteContent } from "../../../lib/contentStore";

export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const success = saveSiteContent(body);
    if (success) {
      return NextResponse.json({ success: true, message: "Site content saved successfully", content: body });
    } else {
      return NextResponse.json({ error: "Failed to save site content" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
  }
}
