// src/interfaces/index.ts
export interface DirectoryItem {
  id: string | number; // Allow both string and number IDs
  name: string;
  slug: string; // For SEO-friendly URLs
  description?: string;
  image?: string;
  // Common location-related fields (optional, can be made more generic later)
  address?: string;
  location?: string; // e.g., "City, State" or a more generic zone
  // Allow for arbitrary other properties specific to the niche
  [key: string]: unknown; // For custom properties - more type-safe
}
