// src/lib/__tests__/data-service.test.ts
import { DirectoryItem } from '@/interfaces';

// jest.setup.js sets NEXT_PUBLIC_ACTIVE_NICHE to 'restaurants' by default.
// This means initial imports of nicheConfig, sampleItems, and locations will be for the "Restaurants" niche.

describe('Data Service (Restaurants Niche - Default)', () => {
  // Dynamically import here to ensure the default niche is loaded for this suite
  let searchItems: any, getAllLocations: any, getItemBySlug: any, getFilterOptions: any;
  let nicheConfig: any, activeSampleItems: any, activeLocations: any;

  beforeAll(async () => {
    // Ensure the environment variable is set for this suite (restaurants is default via jest.setup.js)
    // process.env.NEXT_PUBLIC_ACTIVE_NICHE = 'restaurants'; // Or ensure jest.setup.js does this
    // jest.resetModules(); // Reset modules to pick up the correct env var
    
    const dataService = await import('../data-service');
    searchItems = dataService.searchItems;
    getAllLocations = dataService.getAllLocations;
    getItemBySlug = dataService.getItemBySlug;
    getFilterOptions = dataService.getFilterOptions;

    const config = await import('@/config');
    nicheConfig = config.nicheConfig;
    activeSampleItems = config.sampleItems;
    activeLocations = config.locations;
  });
  
  const getTestLocation = () => {
    return nicheConfig.searchConfig.locationSearchable && activeLocations.length > 0 
           ? activeLocations[0] 
           : "";
  };

  describe('searchItems (Restaurants)', () => {
    it('should return all items for the test location if query is empty', async () => {
      const locationFilter = getTestLocation();
      const results = await searchItems('', locationFilter);
      const expectedCount = (activeSampleItems as DirectoryItem[]).filter(item => {
        if (!nicheConfig.searchConfig.locationSearchable || !locationFilter) return true;
        const itemLocation = item.location || item.address || "";
        return String(itemLocation).toLowerCase().includes(locationFilter.toLowerCase());
      }).length;
      expect(results.length).toBe(expectedCount);
      if (expectedCount > 0) expect(results[0]).toHaveProperty('slug');
    });

    it('should filter by query string in "cuisine" field (restaurants)', async () => {
      const locationFilter = getTestLocation();
      const cuisineToTest = "japanese"; 
      const results = await searchItems(cuisineToTest, locationFilter);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((item: DirectoryItem) => {
        const cuisineMatch = String(item.cuisine).toLowerCase().includes(cuisineToTest);
        const categoryMatch = String(item.category).toLowerCase().includes(cuisineToTest);
        expect(cuisineMatch || categoryMatch || item.tags?.some(tag => String(tag).toLowerCase().includes(cuisineToTest))).toBe(true);
      });
    });
  });

  describe('getAllLocations (Restaurants)', () => {
    it('should return all unique locations from restaurant data', async () => {
      const resultLocations = await getAllLocations();
      const expectedUniqueLocations = Array.from(new Set(activeLocations as string[])).sort();
      expect(resultLocations.sort()).toEqual(expectedUniqueLocations);
    });
  });

  describe('getItemBySlug (Restaurants)', () => {
    it('should return the correct item if a valid slug is provided', async () => {
      if ((activeSampleItems as DirectoryItem[]).length === 0) return;
      const testSlug = (activeSampleItems as DirectoryItem[])[0].slug;
      const item = await getItemBySlug(testSlug);
      expect(item).toBeDefined();
      expect(item?.slug).toBe(testSlug);
    });
  });

  describe('getFilterOptions (Restaurants)', () => {
    it('should return filter options based on restaurantsNicheConfig', async () => {
      const filterOptions = await getFilterOptions({});
      expect(filterOptions.length).toBe(nicheConfig.searchConfig.filterByFields.length);
      filterOptions.forEach((option: any) => {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('key');
        const configuredField = nicheConfig.searchConfig.filterByFields.find((f:any) => f.key === option.key);
        expect(configuredField).toBeDefined();
        expect(option.label).toBe(configuredField?.label);
      });
    });
  });
});


describe('Data Service (Books Niche)', () => {
  let searchItems: any, getAllLocations: any, getItemBySlug: any, getFilterOptions: any;
  let booksNicheConfig: any, booksSampleItems: any, booksLocations: any;

  beforeAll(async () => {
    process.env.NEXT_PUBLIC_ACTIVE_NICHE = 'books';
    jest.resetModules(); // Crucial for reloading modules with the new env var

    const dataService = await import('../data-service');
    searchItems = dataService.searchItems;
    getAllLocations = dataService.getAllLocations;
    getItemBySlug = dataService.getItemBySlug;
    getFilterOptions = dataService.getFilterOptions;

    const configModule = await import('@/config');
    booksNicheConfig = configModule.nicheConfig;
    booksSampleItems = configModule.sampleItems;
    booksLocations = configModule.locations;
  });

  describe('searchItems (Books)', () => {
    it('should return all book items if query is empty (location is "all")', async () => {
      const results = await searchItems('', 'all'); // For books, location is usually 'all'
      expect(results.length).toBe(booksSampleItems.length);
    });

    it('should filter books by title', async () => {
      // Assuming at least one book exists
      if (booksSampleItems.length === 0) return;
      const query = "Gatsby"; // Changed query
      const results = await searchItems(query, 'all');
      
      expect(results.length).toBeGreaterThan(0); // Check that at least one item is returned
      
      // Check that "The Great Gatsby" is present
      const foundGatsby = results.some((item: DirectoryItem) => item.title === "The Great Gatsby");
      expect(foundGatsby).toBe(true);
      
      // Check that "The Hobbit" is NOT present (assuming "Gatsby" is specific enough)
      const foundHobbit = results.some((item: DirectoryItem) => item.title === "The Hobbit");
      expect(foundHobbit).toBe(false);
    });

    it('should filter books by author', async () => {
      if (booksSampleItems.length === 0 || !booksSampleItems[0].author) return;
      const query = String(booksSampleItems[0].author).substring(0, 5);
      const results = await searchItems(query, 'all');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((item: DirectoryItem) => {
         const match = booksNicheConfig.searchConfig.searchableFields.some((fieldKey: string) =>
            String(item[fieldKey]).toLowerCase().includes(query.toLowerCase())
        );
        expect(match).toBe(true);
      });
    });
  });

  describe('getItemBySlug (Books)', () => {
    it('should return the correct book item by slug', async () => {
      if (booksSampleItems.length === 0) return;
      const testSlug = booksSampleItems[0].slug;
      const item = await getItemBySlug(testSlug);
      expect(item).toBeDefined();
      expect(item?.slug).toBe(testSlug);
      expect(item?.name).toBe(booksSampleItems[0].name);
    });
  });
  
  describe('getFilterOptions (Books)', () => {
    it('should return filter options based on booksNicheConfig', async () => {
      const filterOptions = await getFilterOptions({});
      expect(filterOptions.length).toBe(booksNicheConfig.searchConfig.filterByFields.length);
      filterOptions.forEach((option: any) => {
        expect(option).toHaveProperty('key');
        const configuredField = booksNicheConfig.searchConfig.filterByFields.find((f:any) => f.key === option.key);
        expect(configuredField).toBeDefined();
        expect(option.label).toBe(configuredField?.label);
        // Check a known value for 'genre' if possible
        if (option.key === 'genre' && booksSampleItems.length > 0) {
            expect(option.values).toContain(String(booksSampleItems[0].genre));
        }
      });
    });
  });

  describe('getAllLocations (Books)', () => {
    it('should return locations for books (e.g., ["all"])', async () => {
      const resultLocations = await getAllLocations();
      // booksLocations is imported from '@/config' which dynamically loads based on niche
      const expectedUniqueLocations = Array.from(new Set(booksLocations as string[])).sort();
      expect(resultLocations.sort()).toEqual(expectedUniqueLocations);
       expect(resultLocations).toContain("all"); // Specific check for books
    });
  });
});


describe('Data Service (Events Niche)', () => {
  let searchItems: any, getAllLocations: any, getItemBySlug: any, getFilterOptions: any;
  let eventsNicheConfig: any, eventsSampleItems: any, eventsLocations: any;

  beforeAll(async () => {
    process.env.NEXT_PUBLIC_ACTIVE_NICHE = 'events';
    jest.resetModules();

    const dataService = await import('../data-service');
    searchItems = dataService.searchItems;
    getAllLocations = dataService.getAllLocations;
    getItemBySlug = dataService.getItemBySlug;
    getFilterOptions = dataService.getFilterOptions;
    
    const configModule = await import('@/config');
    eventsNicheConfig = configModule.nicheConfig;
    eventsSampleItems = configModule.sampleItems;
    eventsLocations = configModule.locations;
  });

  const getTestEventLocation = () => {
    return eventsNicheConfig.searchConfig.locationSearchable && eventsLocations.length > 0 
           ? eventsLocations[0] 
           : "";
  };

  describe('searchItems (Events)', () => {
    it('should return all event items for a specific location if query is empty', async () => {
      const locationFilter = getTestEventLocation();
      if (!locationFilter && eventsNicheConfig.searchConfig.locationSearchable) {
        console.warn("Skipping event search test: No locations available for events niche.");
        return;
      }
      const results = await searchItems('', locationFilter);
      const expectedCount = eventsSampleItems.filter((item: DirectoryItem) => {
        if (!eventsNicheConfig.searchConfig.locationSearchable || !locationFilter) return true;
        return String(item.location).toLowerCase().includes(locationFilter.toLowerCase());
      }).length;
      expect(results.length).toBe(expectedCount);
    });

    it('should filter events by eventName', async () => {
      const locationFilter = getTestEventLocation();
      if (eventsSampleItems.length === 0) return;
      const query = String(eventsSampleItems[0].eventName).substring(0, 5);
      const results = await searchItems(query, locationFilter);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((item: DirectoryItem) => {
        expect(String(item.eventName).toLowerCase()).toContain(query.toLowerCase());
      });
    });
    
    it('should filter events by a specific location', async () => {
        if (!eventsNicheConfig.searchConfig.locationSearchable || eventsLocations.length === 0) return;
        const specificLocation = eventsLocations[0]; // Use first available location
        const results = await searchItems('', specificLocation); // Empty query, specific location
        expect(results.length).toBeGreaterThan(0);
        results.forEach((item: DirectoryItem) => {
            expect(String(item.location).toLowerCase()).toContain(specificLocation.toLowerCase());
        });
    });
  });

  describe('getItemBySlug (Events)', () => {
    it('should return the correct event item by slug', async () => {
      if (eventsSampleItems.length === 0) return;
      const testSlug = eventsSampleItems[0].slug;
      const item = await getItemBySlug(testSlug);
      expect(item).toBeDefined();
      expect(item?.slug).toBe(testSlug);
      expect(item?.name).toBe(eventsSampleItems[0].name);
    });
  });

  describe('getFilterOptions (Events)', () => {
    it('should return filter options based on eventsNicheConfig', async () => {
      const filterOptions = await getFilterOptions({});
      expect(filterOptions.length).toBe(eventsNicheConfig.searchConfig.filterByFields.length);
      filterOptions.forEach((option: any) => {
        expect(option).toHaveProperty('key');
        const configuredField = eventsNicheConfig.searchConfig.filterByFields.find((f:any) => f.key === option.key);
        expect(configuredField).toBeDefined();
        expect(option.label).toBe(configuredField?.label);
      });
    });
  });

  describe('getAllLocations (Events)', () => {
    it('should return all unique locations from event data', async () => {
      const resultLocations = await getAllLocations();
      const expectedUniqueLocations = Array.from(new Set(eventsLocations as string[])).sort();
      expect(resultLocations.sort()).toEqual(expectedUniqueLocations);
    });
  });
});

// Restore original env var if necessary, or handle in jest.config.js globalTeardown
// afterAll(() => {
//   process.env.NEXT_PUBLIC_ACTIVE_NICHE = 'restaurants'; // Or delete
// });
