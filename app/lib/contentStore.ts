import fs from "fs";
import path from "path";
import { SiteContent, DEFAULT_SITE_CONTENT } from "./contentTypes";

export * from "./contentTypes";

const CONTENT_FILE_PATH = path.join(process.cwd(), "data", "site-content.json");

export function getSiteContent(): SiteContent {
  try {
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const rawData = fs.readFileSync(CONTENT_FILE_PATH, "utf-8");
      const parsed = JSON.parse(rawData);
      return {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        header: { ...DEFAULT_SITE_CONTENT.header, ...(parsed.header || {}) },
        footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
        contactInfo: { ...DEFAULT_SITE_CONTENT.contactInfo, ...(parsed.contactInfo || {}) },
        theme: { 
          ...DEFAULT_SITE_CONTENT.theme, 
          ...(parsed.theme || {}),
          // Ensure new fields are present
          template: parsed.theme?.template || DEFAULT_SITE_CONTENT.theme.template,
          heroBackground: parsed.theme?.heroBackground || DEFAULT_SITE_CONTENT.theme.heroBackground,
          cardBackground: parsed.theme?.cardBackground || DEFAULT_SITE_CONTENT.theme.cardBackground,
          sectionBackground: parsed.theme?.sectionBackground || DEFAULT_SITE_CONTENT.theme.sectionBackground
        },
        home: { ...DEFAULT_SITE_CONTENT.home, ...(parsed.home || {}) },
        about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
        productsPage: { ...DEFAULT_SITE_CONTENT.productsPage, ...(parsed.productsPage || {}) },
        processPage: { ...DEFAULT_SITE_CONTENT.processPage, ...(parsed.processPage || {}) },
        contactPage: { ...DEFAULT_SITE_CONTENT.contactPage, ...(parsed.contactPage || {}) },
        products: parsed.products || DEFAULT_SITE_CONTENT.products,
        processSteps: parsed.processSteps || DEFAULT_SITE_CONTENT.processSteps
      };
    }
  } catch (error) {
    console.error("Error reading site-content.json:", error);
  }

  saveSiteContent(DEFAULT_SITE_CONTENT);
  return DEFAULT_SITE_CONTENT;
}

export function saveSiteContent(content: SiteContent): boolean {
  try {
    const dirPath = path.dirname(CONTENT_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving site-content.json:", error);
    return false;
  }
}

export function resetSiteContent(): SiteContent {
  saveSiteContent(DEFAULT_SITE_CONTENT);
  return DEFAULT_SITE_CONTENT;
}
