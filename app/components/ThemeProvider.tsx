"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ThemeContextType {
  theme: "light" | "dark" | "auto";
  setTheme: (theme: "light" | "dark" | "auto") => void;
  template: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
  heroBackground: string;
  cardBackground: string;
  sectionBackground: string;
  enabled: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to adjust color brightness (moved outside component)
const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark" | "auto">("light");
  const [template, setTemplate] = useState("default");
  const [primaryColor, setPrimaryColor] = useState("#0d4a36");
  const [accentColor, setAccentColor] = useState("#78ad25");
  const [backgroundColor, setBackgroundColor] = useState("#fbfaf4");
  const [textColor, setTextColor] = useState("#17231c");
  const [borderRadius, setBorderRadius] = useState("12px");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [heroBackground, setHeroBackground] = useState("linear-gradient(175deg, rgba(255, 255, 255, 0.9), rgba(245, 250, 239, 0.6))");
  const [cardBackground, setCardBackground] = useState("rgba(255, 255, 255, 0.9)");
  const [sectionBackground, setSectionBackground] = useState("#ffffff");
  const [enabled, setEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load theme settings from API
    const loadThemeSettings = async () => {
      try {
        const response = await fetch("/api/theme");
        if (response.ok) {
          const settings = await response.json();
          if (settings.enabled) {
            setEnabled(true);
            setThemeState(settings.mode);
            setTemplate(settings.template || "default");
            setPrimaryColor(settings.primaryColor);
            setAccentColor(settings.accentColor);
            setBackgroundColor(settings.backgroundColor);
            setTextColor(settings.textColor);
            setBorderRadius(settings.borderRadius);
            setFontFamily(settings.fontFamily);
            setHeroBackground(settings.heroBackground);
            setCardBackground(settings.cardBackground);
            setSectionBackground(settings.sectionBackground);
          }
        }
      } catch (error) {
        console.error("Failed to load theme settings:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemeSettings();
  }, []);

  useEffect(() => {
    if (!isLoaded || !enabled) return;

    const root = document.documentElement;
    
    // Apply theme colors - override the default CSS variables
    root.style.setProperty('--forest', primaryColor);
    root.style.setProperty('--leaf', accentColor);
    root.style.setProperty('--forest-2', adjustColor(primaryColor, 20));
    root.style.setProperty('--forest-deep', adjustColor(primaryColor, -30));
    root.style.setProperty('--mint', adjustColor(primaryColor, 180));
    root.style.setProperty('--mint-soft', adjustColor(primaryColor, 200));
    root.style.setProperty('--leaf-glow', adjustColor(accentColor, 30));
    
    // Apply background and text colors
    root.style.setProperty('--paper', backgroundColor);
    root.style.setProperty('--ink', textColor);
    
    // Apply custom backgrounds
    root.style.setProperty('--hero-background', heroBackground);
    root.style.setProperty('--card-background', cardBackground);
    root.style.setProperty('--section-background', sectionBackground);
    
    // Apply border radius
    root.style.setProperty('--radius', borderRadius);
    root.style.setProperty('--radius-lg', parseInt(borderRadius) * 2 + "px");
    root.style.setProperty('--radius-xl', parseInt(borderRadius) * 3 + "px");
    
    // Apply font family
    root.style.setProperty('--font-body', fontFamily === 'system-ui' ? 'system-ui, -apple-system, sans-serif' : fontFamily);
    
    // Apply theme mode
    const effectiveTheme = theme === "auto" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, template, primaryColor, accentColor, backgroundColor, textColor, borderRadius, fontFamily, heroBackground, cardBackground, sectionBackground, isLoaded, enabled]);

  const setTheme = useCallback((newTheme: "light" | "dark" | "auto") => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      template,
      primaryColor, 
      accentColor, 
      backgroundColor, 
      textColor, 
      borderRadius, 
      fontFamily,
      heroBackground,
      cardBackground,
      sectionBackground,
      enabled 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}