import LZString from 'lz-string';
import { ResumeData } from '../store/useResumeStore';

export const generateShareLink = (data: ResumeData): string => {
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const url = new URL(window.location.href);
  url.hash = compressed;
  return url.toString();
};

export const parseShareLink = (): ResumeData | null => {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  try {
    // Try decompressing first (new format)
    let json = LZString.decompressFromEncodedURIComponent(hash);
    
    // Fallback for raw base64 (if user manually used btoa)
    if (!json) {
      try {
        json = atob(hash);
      } catch (e) {
        // Ignore
      }
    }

    if (!json) return null;
    return JSON.parse(json) as ResumeData;
  } catch (error) {
    console.error("Failed to parse share link:", error);
    return null;
  }
};
