// src/config/niche.restaurants.config.ts
import { NicheConfig } from "./niche.config.base"; // Import from the new base config file

/**
 * Configuration object for the "Restaurant" directory niche.
 */
export const restaurantsNicheConfig: NicheConfig = {
  nicheNameSingular: "Restaurant",
  nicheNamePlural: "Restaurants",
  itemDisplayNameKey: "name", // Uses the 'name' field from DirectoryItem as the main title for items.
  itemDefinition: {
    fields: [
      // Standard fields expected by the components and schema mappings.
      { key: "name", label: "Name", isSearchable: true, displayInCard: true, displayInDetail: true },
      { key: "image", label: "Image", displayInCard: true, displayInDetail: true }, // Used for item images.
      { key: "description", label: "Description", isSearchable: true, displayInCard: true, displayInDetail: true }, // General description.
      
      // Niche-specific fields for a "Restaurant" directory.
      { key: "rating", label: "Rating", displayInCard: true, displayInDetail: true }, // Customer rating.
      { key: "price", label: "Price", displayInCard: true, displayInDetail: true }, // Price range (e.g., "$", "$$", "$$$").
      { key: "category", label: "Category", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true }, // Broad category (e.g., "Japanese", "Italian").
      { key: "cuisine", label: "Cuisine", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true }, // Specific cuisine type.
      
      // Location and contact information.
      { key: "location", label: "Location", isSearchable: true, displayInCard: true, displayInDetail: true }, // General location (e.g., "City, State").
      { key: "address", label: "Address", isSearchable: true, displayInCard: false, displayInDetail: true }, // Specific street address.
      { key: "phone", label: "Phone", displayInCard: false, displayInDetail: true }, // Contact phone number.
      { key: "website", label: "Website", displayInDetail: true }, // Official website URL.
      
      // Operational details.
      { key: "hours", label: "Hours", displayInCard: false, displayInDetail: true }, // Opening hours.
      
      // User engagement fields.
      { key: "reviews", label: "Reviews", displayInCard: true, displayInDetail: true }, // Number of reviews.
      { key: "tags", label: "Tags", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true }, // Descriptive tags.
    ],
  },
  seo: {
    // Example: "Top 10 Italian Restaurants in San Francisco - Updated 2024"
    titleTemplate: "Top {count} {query} {nicheNamePlural} in {location} - Updated {year}",
    // Example: "Find the best Italian Restaurants in San Francisco and explore various options."
    descriptionTemplate: "Find the best {query} {nicheNamePlural} in {location} and explore various options.",
    // Example: "Sushi Master - Japanese Restaurant in San Francisco"
    itemDetailTitleTemplate: "{itemName} - {category} {nicheNameSingular} in {location}",
    // Example: "Discover Sushi Master, a prime Japanese Restaurant located at 123 Main St in San Francisco. View details, reviews, and more."
    itemDetailDescriptionTemplate: "Discover {itemName}, a prime {category} {nicheNameSingular} located at {address} in {location}. View details, reviews, and more.",
  },
  searchConfig: {
    // Fields from 'itemDefinition' that the main search bar will query against.
    searchableFields: ["name", "cuisine", "tags", "category", "description"],
    primarySearchPlaceholder: "Search for cuisine, restaurant, or dish",
    locationSearchable: true, // Enable the location search input.
    locationSearchPlaceholder: "Enter your city or neighborhood",
    // Defines which item fields can be used to generate filter options for search results.
    filterByFields: [
      { key: "tags", label: "Tags" },
      { key: "cuisine", label: "Cuisines" },
      { key: "category", label: "Categories" },
    ],
  },
  schemaOrg: {
    type: "Restaurant", // Sets the base type for Schema.org structured data.
    // Maps DirectoryItem keys to specific Schema.org properties.
    // This allows for rich snippet generation in search results.
    propertyMappings: [
      { itemKey: "name", schemaProperty: "name" },
      { itemKey: "description", schemaProperty: "description" },
      { itemKey: "image", schemaProperty: "image" }, // Assumes item.image is a URL.
      
      // Address is a nested PostalAddress type in Schema.org.
      { itemKey: "address", schemaProperty: "address.streetAddress" },
      { itemKey: "location", schemaProperty: "address.addressLocality" }, // 'location' often holds city.
      // { itemKey: "locationRegion", schemaProperty: "address.addressRegion" }, // If you had a separate state/region field.
      // { itemKey: "postalCode", schemaProperty: "address.postalCode" }, // If you had a postal code field.
      
      { itemKey: "phone", schemaProperty: "telephone" },
      { itemKey: "price", schemaProperty: "priceRange" }, // e.g., "$$", "$$$".
      { itemKey: "cuisine", schemaProperty: "servesCuisine" }, // Can be a string or an array of strings.
      
      // AggregateRating is a nested type.
      { itemKey: "rating", schemaProperty: "ratingValue", isAggregateRating: true }, // The average rating value.
      { itemKey: "reviews", schemaProperty: "reviewCount", isAggregateRating: true }, // Total number of reviews.
      
      { itemKey: "hours", schemaProperty: "openingHours" }, // Requires specific format (e.g., "Mo-Fr 10:00-23:00").
      { itemKey: "website", schemaProperty: "url" }, // URL of the item's own website.
      
      // Examples for more complex mappings (currently not fully implemented in data structure):
      // Offers:
      // { itemKey: "price", schemaProperty: "price", isOffer: true },
      // { itemKey: "priceCurrency", schemaProperty: "priceCurrency", isOffer: true, defaultValue: "USD" } 
      // Individual Reviews:
      // { itemKey: "reviewText", schemaProperty: "reviewBody", isReview: true },
      // { itemKey: "reviewerName", schemaProperty: "author.name", isReview: true },
      // GeoCoordinates:
      // { itemKey: "latitude", schemaProperty: "geo.latitude", isGeoCoordinates: true },
      // { itemKey: "longitude", schemaProperty: "geo.longitude", isGeoCoordinates: true },
    ],
  },
};
