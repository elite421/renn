"use client";

import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export function ThemeToggleClient({ enabled }: { enabled: boolean }) {
  // If the prop says it's disabled, don't render
  if (!enabled) {
    return null;
  }

  // Otherwise, render the ThemeToggle
  return <ThemeToggle />;
}