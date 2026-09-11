"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, enabled } = useTheme();

  if (!enabled) {
    return null;
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("auto");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return "☀️";
      case "dark":
        return "🌙";
      case "auto":
        return "🔄";
      default:
        return "☀️";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to change.`}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        border: "1px solid var(--line)",
        background: "var(--white)",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--mint-soft)";
        e.currentTarget.style.borderColor = "var(--leaf)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--white)";
        e.currentTarget.style.borderColor = "var(--line)";
      }}
    >
      {getThemeIcon()}
    </button>
  );
}