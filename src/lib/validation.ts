// src/lib/validation.ts
// Input validation and sanitization utilities

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and script content
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Escape HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Validate and sanitize a URL
 * Returns null if URL is invalid or potentially malicious
 */
export function validateUrl(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  // Basic URL validation
  try {
    const parsed = new URL(trimmedUrl);
    
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    // Block data: URLs and javascript: URLs (already covered by protocol check, but extra safety)
    if (trimmedUrl.toLowerCase().startsWith("data:") || 
        trimmedUrl.toLowerCase().startsWith("javascript:")) {
      return null;
    }

    return trimmedUrl;
  } catch {
    return null;
  }
}

/**
 * Validate YouTube URL
 */
export function isValidYoutubeUrl(url: string): boolean {
  if (!url) return false;
  const validatedUrl = validateUrl(url);
  if (!validatedUrl) return false;

  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[\w-]+/,
    /^(https?:\/\/)?youtu\.be\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/live\/[\w-]+/,
  ];

  return youtubePatterns.some(pattern => pattern.test(validatedUrl));
}

/**
 * Validate Telegram URL
 */
export function isValidTelegramUrl(url: string): boolean {
  if (!url) return false;
  const validatedUrl = validateUrl(url);
  if (!validatedUrl) return false;

  const telegramPatterns = [
    /^(https?:\/\/)?(www\.)?t\.me\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?telegram\.me\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?telegram\.org\/[\w-]+/,
  ];

  return telegramPatterns.some(pattern => pattern.test(validatedUrl));
}

/**
 * Validate Google Drive URL
 */
export function isValidGdriveUrl(url: string): boolean {
  if (!url) return false;
  const validatedUrl = validateUrl(url);
  if (!validatedUrl) return false;

  const gdrivePatterns = [
    /^(https?:\/\/)?(www\.)?drive\.google\.com\//,
    /^(https?:\/\/)?(www\.)?docs\.google\.com\//,
  ];

  return gdrivePatterns.some(pattern => pattern.test(validatedUrl));
}

/**
 * Validate OneDrive URL
 */
export function isValidOnedriveUrl(url: string): boolean {
  if (!url) return false;
  const validatedUrl = validateUrl(url);
  if (!validatedUrl) return false;

  const onedrivePatterns = [
    /^(https?:\/\/)?(www\.)?(1drv\.ms|onedrive\.live\.com|onedrive\.com)\//,
    /^(https?:\/\/)?[\w-]+\.sharepoint\.com\//,
  ];

  return onedrivePatterns.some(pattern => pattern.test(validatedUrl));
}

/**
 * Validate an array of URLs and return only valid ones
 */
export function validateUrlArray(
  urls: unknown,
  validator?: (url: string) => boolean
): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls
    .filter((url): url is string => typeof url === "string")
    .map(url => url.trim())
    .filter(url => {
      const validatedUrl = validateUrl(url);
      if (!validatedUrl) return false;
      if (validator && !validator(validatedUrl)) return false;
      return true;
    });
}

/**
 * Validate index number format
 * Example valid formats: EG/2020/4321, 2020IS123, etc.
 */
export function validateIndexNo(indexNo: string): string | null {
  if (!indexNo || typeof indexNo !== "string") {
    return null;
  }

  const trimmed = indexNo.trim().toUpperCase();
  
  // Basic format validation - alphanumeric with optional slashes
  // Allow formats like: EG/2020/4321, 2020IS123, AB123456, etc.
  if (!/^[A-Z0-9\/\-]{4,20}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Validate title length and content
 */
export function validateTitle(title: string): { valid: boolean; sanitized: string; error?: string } {
  if (!title || typeof title !== "string") {
    return { valid: false, sanitized: "", error: "Title is required" };
  }

  const sanitized = sanitizeText(title);
  
  if (sanitized.length < 3) {
    return { valid: false, sanitized, error: "Title must be at least 3 characters" };
  }

  if (sanitized.length > 200) {
    return { valid: false, sanitized, error: "Title must be less than 200 characters" };
  }

  return { valid: true, sanitized };
}

/**
 * Validate description length and content
 */
export function validateDescription(description: string): { valid: boolean; sanitized: string; error?: string } {
  if (!description || typeof description !== "string") {
    return { valid: false, sanitized: "", error: "Description is required" };
  }

  const sanitized = sanitizeText(description);
  
  if (sanitized.length < 10) {
    return { valid: false, sanitized, error: "Description must be at least 10 characters" };
  }

  if (sanitized.length > 2000) {
    return { valid: false, sanitized, error: "Description must be less than 2000 characters" };
  }

  return { valid: true, sanitized };
}

/**
 * Validate language code
 */
export function validateLanguageCode(code: string): boolean {
  const validCodes = ["en", "si", "ta", "mix"];
  return validCodes.includes(code);
}
