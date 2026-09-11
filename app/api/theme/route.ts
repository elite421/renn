import { NextResponse } from "next/server";
import { getSiteContent } from "../../lib/contentStore";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json({
      enabled: content.theme?.enabled || false,
      mode: content.theme?.mode || "light",
      template: content.theme?.template || "default",
      primaryColor: content.theme?.primaryColor || "#0d4a36",
      accentColor: content.theme?.accentColor || "#78ad25",
      backgroundColor: content.theme?.backgroundColor || "#fbfaf4",
      textColor: content.theme?.textColor || "#17231c",
      borderRadius: content.theme?.borderRadius || "12px",
      fontFamily: content.theme?.fontFamily || "Inter",
      heroBackground: content.theme?.heroBackground || "linear-gradient(175deg, rgba(255, 255, 255, 0.9), rgba(245, 250, 239, 0.6))",
      cardBackground: content.theme?.cardBackground || "rgba(255, 255, 255, 0.9)",
      sectionBackground: content.theme?.sectionBackground || "#ffffff"
    });
  } catch (error) {
    console.error("Error fetching theme settings:", error);
    return NextResponse.json({
      enabled: false,
      mode: "light",
      template: "default",
      primaryColor: "#0d4a36",
      accentColor: "#78ad25",
      backgroundColor: "#fbfaf4",
      textColor: "#17231c",
      borderRadius: "12px",
      fontFamily: "Inter",
      heroBackground: "linear-gradient(175deg, rgba(255, 255, 255, 0.9), rgba(245, 250, 239, 0.6))",
      cardBackground: "rgba(255, 255, 255, 0.9)",
      sectionBackground: "#ffffff"
    });
  }
}