// src/app/__tests__/metadata.test.ts

import { nicheConfig, sampleItems as activeSampleItems, locations as activeLocations } from '@/config'; 
import { DirectoryItem } from '@/interfaces';
import { generateMetadata as generateItemMetadata } from '../item/[slug]/page'; 
import { generateMetadata as generateSearchMetadata } from '../[location]/[q]/page'; // Import search page metadata

import { getItemBySlug, searchItems, getAllLocations, getFilterOptions } from '@/lib/data-service';

// Mock the data-service module
// Note: activeLocations is available here due to hoisting of imports
jest.mock('@/lib/data-service', () => ({
  __esModule: true,
  getItemBySlug: jest.fn(),
  searchItems: jest.fn(),
  getAllLocations: jest.fn().mockResolvedValue(activeLocations), 
  getFilterOptions: jest.fn().mockResolvedValue([]),
}));

const currentSampleItems = activeSampleItems as DirectoryItem[]; // Restaurants by default
const currentLocations = activeLocations; // Restaurant locations by default

describe('Metadata Generation', () => {
  
  beforeEach(() => {
    // Reset mocks before each test
    (getItemBySlug as jest.Mock).mockReset();
    (searchItems as jest.Mock).mockReset();
    // Reset other mocks if they are modified within tests
    (getAllLocations as jest.Mock).mockResolvedValue(currentLocations);
    (getFilterOptions as jest.Mock).mockResolvedValue([]);
  });

  describe('Item Detail Page (/item/[slug]/page.tsx)', () => {
    it('should generate correct metadata for a standard item', async () => {
      if (currentSampleItems.length === 0) {
        console.warn("Skipping item detail metadata test: No sample items for current niche.");
        return;
      }
      const item = currentSampleItems[0]; 
      (getItemBySlug as jest.Mock).mockResolvedValue(item);

      const params = { slug: item.slug };
      const metadata = await generateItemMetadata({ params });

      const itemName = item[nicheConfig.itemDisplayNameKey] || item.name;
      const category = item.category || "details";
      const location = item.location || "area";
      const address = item.address || "visit us";

      const expectedTitle = (nicheConfig.seo.itemDetailTitleTemplate || "{itemName} - {category} {nicheNameSingular} in {location}")
        .replace("{itemName}", itemName)
        .replace("{category}", String(category))
        .replace("{nicheNameSingular}", nicheConfig.nicheNameSingular)
        .replace("{location}", String(location))
        .replace("{address}", String(address));
      
      const expectedDescription = (nicheConfig.seo.itemDetailDescriptionTemplate || "Details for {itemName}, a {nicheNameSingular} offering {category} in {location}.")
        .replace("{itemName}", itemName)
        .replace("{category}", String(category))
        .replace("{nicheNameSingular}", nicheConfig.nicheNameSingular)
        .replace("{location}", String(location))
        .replace("{address}", String(address));

      expect(metadata.title).toBe(expectedTitle);
      expect(metadata.description).toBe(expectedDescription);
      expect(metadata.openGraph?.title).toBe(expectedTitle);
      expect(metadata.openGraph?.description).toBe(expectedDescription);
      if (item.image) {
        expect(metadata.openGraph?.images).toEqual([{ url: item.image }]);
      } else {
        // Check if openGraph.images is undefined or an empty array as per your implementation
        expect(metadata.openGraph?.images === undefined || metadata.openGraph?.images?.length === 0).toBe(true);
      }
    });

    it('should generate "not found" metadata if item is not found', async () => {
      (getItemBySlug as jest.Mock).mockResolvedValue(undefined);
      const params = { slug: 'non-existent-slug' };
      const metadata = await generateItemMetadata({ params });

      expect(metadata.title).toBe(`Item Not Found - ${nicheConfig.nicheNameSingular}`);
      expect(metadata.description).toBe(`The requested ${nicheConfig.nicheNameSingular.toLowerCase()} could not be found.`);
    });
  });

  describe('Search Results Page (/[location]/[q]/page.tsx)', () => {
    it('should generate correct metadata for a standard search query', async () => {
      const testLocation = currentLocations.length > 0 ? currentLocations[0] : "Testville, ST";
      const testQuery = "Sushi"; // A typical query
      const mockResults = currentSampleItems.filter(item => item.name.toLowerCase().includes(testQuery.toLowerCase())).slice(0,3);
      
      (searchItems as jest.Mock).mockResolvedValue(mockResults);

      // Params should be URL-encoded as Next.js would provide them
      const params = { 
        location: encodeURIComponent(testLocation), 
        q: encodeURIComponent(testQuery) 
      };
      const metadata = await generateSearchMetadata({ params });
      
      const year = new Date().getFullYear();
      const expectedTitle = nicheConfig.seo.titleTemplate
        .replace("{count}", mockResults.length.toString())
        .replace("{query}", testQuery) // Use decoded query for template
        .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
        .replace("{location}", testLocation) // Use decoded location for template
        .replace("{year}", year.toString());
      
      const expectedDescription = nicheConfig.seo.descriptionTemplate
        .replace("{query}", testQuery) // Use decoded query
        .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
        .replace("{location}", testLocation); // Use decoded location

      expect(metadata.title).toBe(expectedTitle);
      expect(metadata.description).toBe(expectedDescription);
    });

    it('should generate correct metadata for an "all-items" query', async () => {
      const testLocation = currentLocations.length > 0 ? currentLocations[0] : "Testville, ST";
      const mockResults = currentSampleItems.slice(0,5); // Simulate some items being returned
      
      (searchItems as jest.Mock).mockResolvedValue(mockResults);

      // Params for "all-items"
      const params = { 
        location: encodeURIComponent(testLocation), 
        q: "all-items" // q is already URL-safe
      };
      const metadata = await generateSearchMetadata({ params });

      const year = new Date().getFullYear();
      const expectedTitle = `All ${nicheConfig.nicheNamePlural} in ${testLocation} - Updated ${year}`;
      const expectedDescription = `Browse all available ${nicheConfig.nicheNamePlural.toLowerCase()} in ${testLocation}. Find locations, details, and more.`;

      expect(metadata.title).toBe(expectedTitle);
      expect(metadata.description).toBe(expectedDescription);
    });

    it('should handle cases where searchItems returns empty results for a standard query', async () => {
        const testLocation = currentLocations.length > 0 ? currentLocations[0] : "Testville, ST";
        const testQuery = "NonExistentThing";
        (searchItems as jest.Mock).mockResolvedValue([]); // No items found

        const params = {
            location: encodeURIComponent(testLocation),
            q: encodeURIComponent(testQuery)
        };
        const metadata = await generateSearchMetadata({ params });
        const year = new Date().getFullYear();

        const expectedTitle = nicheConfig.seo.titleTemplate
            .replace("{count}", "0")
            .replace("{query}", testQuery)
            .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
            .replace("{location}", testLocation)
            .replace("{year}", year.toString());
        
        const expectedDescription = nicheConfig.seo.descriptionTemplate
            .replace("{query}", testQuery)
            .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
            .replace("{location}", testLocation);

        expect(metadata.title).toBe(expectedTitle);
        expect(metadata.description).toBe(expectedDescription);
    });
  });
});
