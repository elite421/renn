export interface ThemeTemplate {
  name: string;
  description: string;
  preview: string;
  colors: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    heroBackground: string;
    cardBackground: string;
    sectionBackground: string;
  };
  typography: {
    fontFamily: string;
    borderRadius: string;
  };
  mode: "light" | "dark" | "auto";
}

export const THEME_TEMPLATES: Record<string, ThemeTemplate> = {
  default: {
    name: "Default",
    description: "Original RENN branding with forest green",
    preview: "🌲",
    colors: {
      primaryColor: "#0d4a36",
      accentColor: "#78ad25",
      backgroundColor: "#fbfaf4",
      textColor: "#17231c",
      heroBackground: "linear-gradient(175deg, rgba(255, 255, 255, 0.9), rgba(245, 250, 239, 0.6))",
      cardBackground: "rgba(255, 255, 255, 0.9)",
      sectionBackground: "#ffffff"
    },
    typography: {
      fontFamily: "Inter",
      borderRadius: "12px"
    },
    mode: "light"
  },
  forest: {
    name: "Forest Deep",
    description: "Rich natural greens with dark accents",
    preview: "🌿",
    colors: {
      primaryColor: "#1a5c3f",
      accentColor: "#4a9b6d",
      backgroundColor: "#f0f7f2",
      textColor: "#1a2f27",
      heroBackground: "linear-gradient(135deg, #1a5c3f 0%, #2d7a52 100%)",
      cardBackground: "#ffffff",
      sectionBackground: "#f8faf8"
    },
    typography: {
      fontFamily: "Inter",
      borderRadius: "16px"
    },
    mode: "light"
  },
  ocean: {
    name: "Ocean Blue",
    description: "Professional blue tones for corporate look",
    preview: "🌊",
    colors: {
      primaryColor: "#1e3a8a",
      accentColor: "#3b82f6",
      backgroundColor: "#f0f9ff",
      textColor: "#1e293b",
      heroBackground: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      cardBackground: "#ffffff",
      sectionBackground: "#f8fafc"
    },
    typography: {
      fontFamily: "Inter",
      borderRadius: "8px"
    },
    mode: "light"
  },
  sunset: {
    name: "Sunset Warm",
    description: "Warm orange and red tones for energetic feel",
    preview: "🌅",
    colors: {
      primaryColor: "#dc2626",
      accentColor: "#f97316",
      backgroundColor: "#fef2f2",
      textColor: "#7f1d1d",
      heroBackground: "linear-gradient(135deg, #dc2626 0%, #f97316 100%)",
      cardBackground: "#ffffff",
      sectionBackground: "#fff7f7"
    },
    typography: {
      fontFamily: "Outfit",
      borderRadius: "16px"
    },
    mode: "light"
  },
  royal: {
    name: "Royal Purple",
    description: "Elegant purple tones for premium branding",
    preview: "👑",
    colors: {
      primaryColor: "#7c3aed",
      accentColor: "#a855f7",
      backgroundColor: "#faf5ff",
      textColor: "#581c87",
      heroBackground: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      cardBackground: "#ffffff",
      sectionBackground: "#faf0ff"
    },
    typography: {
      fontFamily: "Outfit",
      borderRadius: "24px"
    },
    mode: "light"
  },
  minimal: {
    name: "Minimal Gray",
    description: "Clean monochrome for modern aesthetics",
    preview: "⚫",
    colors: {
      primaryColor: "#1f2937",
      accentColor: "#6b7280",
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      heroBackground: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
      cardBackground: "#ffffff",
      sectionBackground: "#f8f9fa"
    },
    typography: {
      fontFamily: "system-ui",
      borderRadius: "4px"
    },
    mode: "light"
  },
  midnight: {
    name: "Midnight Dark",
    description: "Dark theme with deep blue tones",
    preview: "🌙",
    colors: {
      primaryColor: "#1e3a5f",
      accentColor: "#4a90a4",
      backgroundColor: "#0f172a",
      textColor: "#e2e8f0",
      heroBackground: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      cardBackground: "#1e293b",
      sectionBackground: "#0f172a"
    },
    typography: {
      fontFamily: "Inter",
      borderRadius: "12px"
    },
    mode: "dark"
  },
  aurora: {
    name: "Aurora Gradient",
    description: "Vibrant gradient colors for modern look",
    preview: "🌈",
    colors: {
      primaryColor: "#6366f1",
      accentColor: "#ec4899",
      backgroundColor: "#faf5ff",
      textColor: "#1f2937",
      heroBackground: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
      cardBackground: "#ffffff",
      sectionBackground: "#faf0ff"
    },
    typography: {
      fontFamily: "Outfit",
      borderRadius: "20px"
    },
    mode: "light"
  }
};

export function applyThemeTemplate(templateKey: string): Partial<{
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
  heroBackground: string;
  cardBackground: string;
  sectionBackground: string;
  mode: "light" | "dark" | "auto";
  template: string;
}> {
  const template = THEME_TEMPLATES[templateKey];
  if (!template) return {};

  return {
    template: templateKey,
    primaryColor: template.colors.primaryColor,
    accentColor: template.colors.accentColor,
    backgroundColor: template.colors.backgroundColor,
    textColor: template.colors.textColor,
    borderRadius: template.typography.borderRadius,
    fontFamily: template.typography.fontFamily,
    heroBackground: template.colors.heroBackground,
    cardBackground: template.colors.cardBackground,
    sectionBackground: template.colors.sectionBackground,
    mode: template.mode
  };
}