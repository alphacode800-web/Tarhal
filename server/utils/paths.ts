import path from "path";
import { fileURLToPath } from "url";

/** Safe dirname for ESM locally and Netlify serverless bundles */
export function resolveDir(metaUrl: string | undefined, fallbackSegments: string[]): string {
  if (metaUrl) {
    try {
      return path.dirname(fileURLToPath(metaUrl));
    } catch {
      // fall through
    }
  }
  return path.join(process.cwd(), ...fallbackSegments);
}

export function serverRoot(): string {
  return path.join(process.cwd(), "server");
}

export function serverDataDir(fromRoutes = false): string {
  if (fromRoutes) {
    return path.join(serverRoot(), "data");
  }
  return path.join(serverRoot(), "data");
}

export function uploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}
