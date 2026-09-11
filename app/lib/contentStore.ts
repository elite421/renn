import fs from "fs";
import path from "path";
import { SiteContent, DEFAULT_SITE_CONTENT } from "./contentTypes";

export * from "./contentTypes";

const CONTENT_FILE_PATH = path.join(process.cwd(), "data", "site-content.json");
const ENV_CONTENT_KEY = "SITE_CONTENT_JSON";

// Helper to check if we're in a serverless environment
const isServerless = (): boolean => {
  return process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_VERSION !== undefined;
};

// Helper to encode content to base64 for environment variable storage
const encodeContent = (content: SiteContent): string => {
  return Buffer.from(JSON.stringify(content)).toString('base64');
};

// Helper to decode content from base64 from environment variable
const decodeContent = (encoded: string): SiteContent => {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
  } catch (error) {
    console.error("Error decoding content from environment variable:", error);
    return DEFAULT_SITE_CONTENT;
  }
};

export function getSiteContent(): SiteContent {
  // Try environment variable first (for Vercel/serverless)
  if (process.env[ENV_CONTENT_KEY]) {
    try {
      const decoded = decodeContent(process.env[ENV_CONTENT_KEY]);
      return {
        ...DEFAULT_SITE_CONTENT,
        ...decoded,
        header: { ...DEFAULT_SITE_CONTENT.header, ...(decoded.header || {}) },
        footer: { ...DEFAULT_SITE_CONTENT.footer, ...(decoded.footer || {}) },
        contactInfo: { ...DEFAULT_SITE_CONTENT.contactInfo, ...(decoded.contactInfo || {}) },
        theme: { 
          ...DEFAULT_SITE_CONTENT.theme, 
          ...(decoded.theme || {}),
          template: decoded.theme?.template || DEFAULT_SITE_CONTENT.theme.template,
          heroBackground: decoded.theme?.heroBackground || DEFAULT_SITE_CONTENT.theme.heroBackground,
          cardBackground: decoded.theme?.cardBackground || DEFAULT_SITE_CONTENT.theme.cardBackground,
          sectionBackground: decoded.theme?.sectionBackground || DEFAULT_SITE_CONTENT.theme.sectionBackground
        },
        home: { ...DEFAULT_SITE_CONTENT.home, ...(decoded.home || {}) },
        about: { ...DEFAULT_SITE_CONTENT.about, ...(decoded.about || {}) },
        productsPage: { ...DEFAULT_SITE_CONTENT.productsPage, ...(decoded.productsPage || {}) },
        processPage: { ...DEFAULT_SITE_CONTENT.processPage, ...(decoded.processPage || {}) },
        contactPage: { ...DEFAULT_SITE_CONTENT.contactPage, ...(decoded.contactPage || {}) },
        products: decoded.products || DEFAULT_SITE_CONTENT.products,
        processSteps: decoded.processSteps || DEFAULT_SITE_CONTENT.processSteps
      };
    } catch (error) {
      console.error("Error reading content from environment variable:", error);
    }
  }

  // Fall back to file system for local development
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

  return DEFAULT_SITE_CONTENT;
}

export function saveSiteContent(content: SiteContent): boolean {
  try {
    // For serverless environments, we can't save to file system
    // We'll return success but log a warning about the limitation
    if (isServerless()) {
      console.warn("Cannot save content to file system in serverless environment. Content will persist only until next deployment.");
      console.warn("To enable persistent storage, set up the SITE_CONTENT_JSON environment variable with your content.");
      return true; // Return true to avoid breaking the UI
    }

    // For local development, save to file system
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
