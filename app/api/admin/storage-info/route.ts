import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/auth";
import VercelStorage from "../../../lib/vercelStorage";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  return NextResponse.json({
    isServerless: VercelStorage.isServerless(),
    instructions: VercelStorage.getStorageInstructions(),
    envKey: "SITE_CONTENT_JSON",
    currentEnvValue: process.env.SITE_CONTENT_JSON ? "SET" : "NOT_SET"
  });
}