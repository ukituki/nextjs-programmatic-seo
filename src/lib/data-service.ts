// src/lib/data-service.ts
import { DirectoryItem } from "../interfaces";
import { sampleItems } from "../data/sample-data";
import { nicheConfig } from "../niche.config";

// Re-export locations from sample-data. This might be integrated into nicheConfig or a dedicated locations service later.
export { locations as allLocations } from "../data/sample-data";

/**
 * Represents a filter option available to the user, typically for faceted search.
 */
export interface FilterOption {
  /** User-friendly label for the filter group (e.g., "Cuisines", "Categories"). */
  label: string;
  /** The key from DirectoryItem data that this filter corresponds to (e.g., "cuisine", "category"). */
  key: string;
  /** Array of unique string values available for this filter option. */
  values: string[];
}

/**
 * Searches directory items based on a query string, location filter, and potentially other active filters.
 * The search logic leverages `nicheConfig` to determine which fields are searchable.
 * If query is "all-items" (case-insensitive) or empty, all items for the given location are returned.
 * @param query - The user's search query string.
 * @param locationFilter - The user's location filter string.
 * @returns A promise that resolves to an array of matching DirectoryItem objects.
 */
export async function searchItems(
  query: string,
  locationFilter: string,
): Promise<DirectoryItem[]> {
  // Simulate API delay for fetching data.
  await new Promise((resolve) => setTimeout(resolve, 300));

  const lowerCaseQuery = query?.toLowerCase();
  // Check if the query indicates to show all items (either "all-items" or an empty query string).
  const isShowAllQuery = lowerCaseQuery === "all-items" || lowerCaseQuery === "";
  
  // If not showing all, prepare search words. Otherwise, searchWords array remains empty.
  const searchWords = isShowAllQuery ? [] : lowerCaseQuery?.split(" ").filter(Boolean) || [];

  return sampleItems
    .filter((item) => {
      // Query matching:
      let matchesQuery = true; 
      if (!isShowAllQuery && searchWords.length > 0) {
        // If not "all-items" and searchWords exist, perform the regular search.
        // Checks if every search word is found in at least one of the fields specified in `nicheConfig.searchConfig.searchableFields`.
        matchesQuery = searchWords.every((word) =>
          nicheConfig.searchConfig.searchableFields.some((fieldKey) => {
            const fieldValue = item[fieldKey];
            if (Array.isArray(fieldValue)) {
              // If the field is an array (e.g., tags), check if any value in the array includes the search word.
              return fieldValue.some((val) =>
                String(val).toLowerCase().includes(word)
              );
            }
            // Otherwise, treat the field as a string and check for inclusion.
            return String(fieldValue).toLowerCase().includes(word);
          })
        );
      }
      // If isShowAllQuery is true, matchesQuery remains true (initial value),
      // effectively meaning all items pass the "query" part of the filter for that specific case.

      // Location matching:
      // Checks if the item's location or address (as configured) matches the locationFilter.
      // This is only applied if location search is enabled in `nicheConfig` and a filter is provided.
      let matchesLocation = true; // Default to true if location search is disabled or no filter is provided.
      if (nicheConfig.searchConfig.locationSearchable && locationFilter) {
        const locFilterLower = locationFilter.toLowerCase();
        // Use `item.location` first, then `item.address` as a fallback for matching.
        const itemLocation = item.location || item.address || "";
        matchesLocation = itemLocation.toLowerCase().includes(locFilterLower);
      }
      
      // TODO: Implement filtering based on `activeFilters` if expanding functionality.
      // This would involve iterating through `activeFilters` and checking if the item matches
      // the criteria for each active filter, using `nicheConfig.searchConfig.filterByFields`
      // to know which item keys correspond to which filters.

      return matchesQuery && matchesLocation;
    })
    // Sort results by rating in descending order. Items without a rating are treated as having a rating of 0.
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

/**
 * Retrieves available filter options based on the current dataset and `nicheConfig`.
 * This is used to populate filter UI elements (e.g., sidebars with filterable categories).
 * @param limitPerField - Optional. The maximum number of unique values to return for each filter field.
 * @returns A promise that resolves to an array of FilterOption objects.
 */
export async function getFilterOptions({
  limitPerField,
}: {
  limitPerField?: number;
} = {}): Promise<FilterOption[]> {
  // Simulate API delay.
  await new Promise((resolve) => setTimeout(resolve, 200));

  const filterOptions: FilterOption[] = [];

  // Iterate over each field defined as filterable in `nicheConfig.searchConfig.filterByFields`.
  for (const filterField of nicheConfig.searchConfig.filterByFields) {
    const values = new Set<string>(); // Use a Set to automatically handle unique values.
    
    // Collect all unique values for the current filter field from all sample items.
    sampleItems.forEach((item) => {
      const fieldValue = item[filterField.key];
      if (Array.isArray(fieldValue)) {
        // If the field value is an array (e.g., tags), add each value to the set.
        fieldValue.forEach((v) => values.add(String(v)));
      } else if (fieldValue !== null && fieldValue !== undefined) {
        // If it's a single value, add it to the set.
        values.add(String(fieldValue));
      }
    });

    let uniqueValues = Array.from(values).sort(); // Convert Set to sorted array.
    if (limitPerField) {
      uniqueValues = uniqueValues.slice(0, limitPerField); // Apply limit if specified.
    }
    
    // Add the filter option to the results array.
    filterOptions.push({
      label: filterField.label, // User-friendly label from nicheConfig.
      key: filterField.key,     // The item data key this filter applies to.
      values: uniqueValues,     // The unique, sorted (and optionally limited) values for this filter.
    });
  }

  return filterOptions;
}

/**
 * Retrieves a single directory item by its slug.
 * @param slug - The URL slug of the item.
 * @returns A promise that resolves to the DirectoryItem if found, or undefined.
 */
export async function getItemBySlug(
  slug: string
): Promise<DirectoryItem | undefined> {
  // Simulate API delay.
  await new Promise((resolve) => setTimeout(resolve, 100));
  return sampleItems.find((item) => item.slug === slug);
}

/**
 * Retrieves a list of all unique locations from the sample data.
 * The specific item key for location is determined by `nicheConfig.itemDefinition.fields` 
 * (looking for a field with key 'location' or label 'Location').
 * @returns A promise that resolves to an array of unique location strings, sorted alphabetically.
 */
export async function getAllLocations(): Promise<string[]> {
  // Simulate API delay.
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Determine the item key to use for extracting location data, based on nicheConfig.
  // Prefers a field with key 'location', then label 'Location', defaults to 'location'.
  const locationKey = nicheConfig.itemDefinition.fields.find(
    f => f.key === "location" || f.label.toLowerCase() === "location"
  )?.key || "location";
  
  const uniqueLocations = new Set<string>(
    sampleItems.map(item => item[locationKey]) // Get the value of the determined location key.
               .filter(Boolean) as string[]    // Filter out any null or undefined values.
  );
  return Array.from(uniqueLocations).sort(); // Convert Set to a sorted array.
}
