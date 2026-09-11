// Vercel-compatible storage solution
// This provides alternative storage methods for serverless environments

import { SiteContent, DEFAULT_SITE_CONTENT } from "./contentTypes";

const ENV_CONTENT_KEY = "SITE_CONTENT_JSON";

export class VercelStorage {
  /**
   * Check if running in Vercel serverless environment
   */
  static isServerless(): boolean {
    return process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_VERSION !== undefined;
  }

  /**
   * Get content from environment variable (for Vercel)
   */
  static getFromEnv(): SiteContent | null {
    if (!process.env[ENV_CONTENT_KEY]) {
      return null;
    }

    try {
      const decoded = JSON.parse(
        Buffer.from(process.env[ENV_CONTENT_KEY], 'base64').toString('utf-8')
      );
      return decoded;
    } catch (error) {
      console.error("Error decoding content from environment variable:", error);
      return null;
    }
  }

  /**
   * Encode content for environment variable storage
   */
  static encodeForEnv(content: SiteContent): string {
    return Buffer.from(JSON.stringify(content)).toString('base64');
  }

  /**
   * Generate environment variable value for current content
   */
  static generateEnvVar(): string {
    const content = require('./contentStore').getSiteContent();
    return this.encodeForEnv(content);
  }

  /**
   * Display instructions for setting up persistent storage
   */
  static getStorageInstructions(): string {
    if (this.isServerless()) {
      return `
=== VERCEL STORAGE SETUP ===

The admin panel is running in a serverless environment (Vercel).
File system writes are not supported, so content changes won't persist
between deployments.

TO ENABLE PERSISTENT STORAGE:

Option 1: Environment Variable (Recommended for simple setups)
1. Run this command to generate your environment variable:
   node -e "console.log(require('./app/lib/vercelStorage').VercelStorage.generateEnvVar())"

2. Add the output as an environment variable in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add variable name: SITE_CONTENT_JSON
   - Paste the generated value
   - Redeploy your application

Option 2: Database Integration (Recommended for production)
1. Set up a database (Vercel Postgres, Supabase, or similar)
2. Update the content store to use database operations
3. This will allow real-time content updates

Current Limitation: Content changes will be lost on next deployment.
`;
    }
    return "Running in local development mode with file system storage.";
  }
}

export default VercelStorage;