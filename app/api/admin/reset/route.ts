import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/auth";
import { resetSiteContent } from "../../../lib/contentStore";

export async function POST() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const defaultContent = resetSiteContent();
  return NextResponse.json({ success: true, message: "Reset to default content", content: defaultContent });
}
