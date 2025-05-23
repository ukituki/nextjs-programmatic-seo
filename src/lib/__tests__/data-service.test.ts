// src/lib/__tests__/data-service.test.ts
import { searchItems, getAllLocations, getItemBySlug, getFilterOptions } from '../data-service'; 
import { nicheConfig, sampleItems as activeSampleItems, locations as activeLocations } from '@/config'; 
import { DirectoryItem } from '@/interfaces';

// jest.setup.js sets NEXT_PUBLIC_ACTIVE_NICHE to 'restaurants' by default.
// This means nicheConfig, sampleItems, and locations will be for the "Restaurants" niche.

describe('Data Service (Restaurants Niche - Default)', () => {
  
  const currentNicheConfig = nicheConfig; // Should be restaurantsNicheConfig
  const currentSampleItems = activeSampleItems as DirectoryItem[];
  const currentLocations = activeLocations; // Should be restaurantLocations

  // Helper to get a specific location for testing, or an empty string if not applicable
  const getTestLocation = () => {
    return currentNicheConfig.searchConfig.locationSearchable && currentLocations.length > 0 
           ? currentLocations[0] 
           : "";
  };

  describe('searchItems', () => {
    it('should return all items for the test location if query is empty', async () => {
      const locationFilter = getTestLocation();
      const results = await searchItems('', locationFilter);
      
      const expectedCount = currentSampleItems.filter(item => {
        if (!currentNicheConfig.searchConfig.locationSearchable || !locationFilter) return true;
        const itemLocation = item.location || item.address || "";
        return itemLocation.toLowerCase().includes(locationFilter.toLowerCase());
      }).length;
      
      expect(results.length).toBe(expectedCount);
      if (expectedCount > 0) {
        expect(results[0]).toHaveProperty('slug'); // Basic check for DirectoryItem structure
      }
    });

    it('should return all items for the test location if query is "all-items"', async () => {
      const locationFilter = getTestLocation();
      const results = await searchItems('all-items', locationFilter);
      
      const expectedCount = currentSampleItems.filter(item => {
        if (!currentNicheConfig.searchConfig.locationSearchable || !locationFilter) return true;
        const itemLocation = item.location || item.address || "";
        return itemLocation.toLowerCase().includes(locationFilter.toLowerCase());
      }).length;
      
      expect(results.length).toBe(expectedCount);
    });

    it('should filter by a simple query string in item name (case-insensitive)', async () => {
      const locationFilter = getTestLocation();
      // Assuming at least one item exists and has a name.
      if (currentSampleItems.length === 0 || !currentSampleItems[0].name) return;
      
      const query = currentSampleItems[0].name.substring(0, 3).toLowerCase();
      const results = await searchItems(query, locationFilter);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        // For this test, we are primarily checking the name field or other searchable fields
        const generalMatch = currentNicheConfig.searchConfig.searchableFields.some(fieldKey => 
            String(item[fieldKey]).toLowerCase().includes(query)
        );
        expect(generalMatch).toBe(true);
      });
    });

    it('should filter by query string in "cuisine" field (restaurants)', async () => {
      const locationFilter = getTestLocation();
      const cuisineToTest = "japanese"; // Assuming 'japanese' is a cuisine in sample data
      const results = await searchItems(cuisineToTest, locationFilter);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(item => {
        const cuisineMatch = String(item.cuisine).toLowerCase().includes(cuisineToTest);
         const categoryMatch = String(item.category).toLowerCase().includes(cuisineToTest);
        expect(cuisineMatch || categoryMatch || item.tags?.some(tag => tag.toLowerCase().includes(cuisineToTest))).toBe(true);
      });
    });
    
    it('should filter by query string in "tags" field (restaurants)', async () => {
      const locationFilter = getTestLocation();
      const tagToTest = "sushi bars"; // Assuming 'Sushi Bars' is a tag
      const results = await searchItems(tagToTest, locationFilter);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(item => {
        expect(item.tags?.some(tag => tag.toLowerCase().includes(tagToTest))).toBe(true);
      });
    });

    it('should filter by a multi-word query string', async () => {
      const locationFilter = getTestLocation();
      // Example: "sushi master" should find "Sushi Master SF"
      const query = "sushi master"; 
      const results = await searchItems(query, locationFilter);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach(item => {
        const name = item.name.toLowerCase();
        expect(name.includes("sushi") && name.includes("master")).toBe(true);
      });
    });

    it('should return an empty array if no items match the query', async () => {
      const locationFilter = getTestLocation();
      const query = "nonexistentqueryterm12345";
      const results = await searchItems(query, locationFilter);
      expect(results).toEqual([]);
    });

    // Test for locationSearchable=false would ideally involve mocking nicheConfig
    // For now, this suite assumes restaurantsNicheConfig where locationSearchable is true.
  });

  describe('getAllLocations', () => {
    it('should return all unique locations from the active niche data', async () => {
      const resultLocations = await getAllLocations();
      // `activeLocations` is imported from @/config, representing the current niche's locations.
      const expectedUniqueLocations = Array.from(new Set(currentLocations)).sort();
      expect(resultLocations.sort()).toEqual(expectedUniqueLocations);
    });
  });

  describe('getItemBySlug', () => {
    it('should return the correct item if a valid slug is provided', async () => {
      if (currentSampleItems.length === 0) {
        console.warn("Skipping getItemBySlug test: No sample items available.");
        return;
      }
      const testSlug = currentSampleItems[0].slug;
      const item = await getItemBySlug(testSlug);
      expect(item).toBeDefined();
      expect(item?.slug).toBe(testSlug);
      expect(item?.name).toEqual(currentSampleItems[0].name);
    });

    it('should return undefined if a non-existent slug is provided', async () => {
      const item = await getItemBySlug('non-existent-slug-12345');
      expect(item).toBeUndefined();
    });
  });

  describe('getFilterOptions', () => {
    it('should return filter options with correct structure and based on nicheConfig', async () => {
      const filterOptions = await getFilterOptions({});
      
      expect(filterOptions.length).toBe(currentNicheConfig.searchConfig.filterByFields.length);
      
      filterOptions.forEach(option => {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('key');
        expect(option).toHaveProperty('values');
        expect(Array.isArray(option.values)).toBe(true);
        
        const configuredField = currentNicheConfig.searchConfig.filterByFields.find(f => f.key === option.key);
        expect(configuredField).toBeDefined();
        expect(option.label).toBe(configuredField?.label);
      });
    });

    it('should extract unique, sorted values for filterable fields', async () => {
      const filterOptions = await getFilterOptions({});
      
      for (const configuredField of currentNicheConfig.searchConfig.filterByFields) {
        const option = filterOptions.find(opt => opt.key === configuredField.key);
        expect(option).toBeDefined();

        const expectedValues = new Set<string>();
        currentSampleItems.forEach(item => {
          const val = item[configuredField.key];
          if (Array.isArray(val)) {
            val.forEach(v => expectedValues.add(String(v)));
          } else if (val !== null && val !== undefined) {
            expectedValues.add(String(val));
          }
        });
        
        expect(option?.values).toEqual(Array.from(expectedValues).sort());
      }
    });

    it('should return unique values even if data has duplicates for a filter field', async () => {
      // This test relies on the currentSampleItems. If 'tags' or 'cuisine' have duplicates, it will be tested.
      // For a more robust test, mock sampleItems with explicit duplicates.
      const cuisineOptions = (await getFilterOptions({})).find(opt => opt.key === 'cuisine');
      if (cuisineOptions) {
        const uniqueValues = Array.from(new Set(cuisineOptions.values));
        expect(cuisineOptions.values.length).toEqual(uniqueValues.length);
      }

      const tagOptions = (await getFilterOptions({})).find(opt => opt.key === 'tags');
      if (tagOptions) {
        const uniqueValues = Array.from(new Set(tagOptions.values));
        expect(tagOptions.values.length).toEqual(uniqueValues.length);
      }
    });
    
    it('should limit the number of values if limitPerField is passed', async () => {
      if (currentNicheConfig.searchConfig.filterByFields.length === 0) return;
      const limit = 1;
      const filterOptions = await getFilterOptions({ limitPerField: limit });
      filterOptions.forEach(option => {
        // It's possible a field has 0 unique values, or only 1.
        if (option.values.length > 0) { // Only check if values exist
             expect(option.values.length).toBeLessThanOrEqual(limit);
        }
      });
    });
  });
});
