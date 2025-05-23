// src/niche.config.ts

/**
 * Defines the overall configuration for the directory niche.
 * This interface guides how data is structured, displayed, searched, and presented for SEO.
 */
export interface NicheConfig {
  /** Singular name of the niche item (e.g., "Restaurant", "Book"). Used in UI text. */
  nicheNameSingular: string;
  /** Plural name of the niche item (e.g., "Restaurants", "Books"). Used in UI text. */
  nicheNamePlural: string;
  /** Key from DirectoryItem data to be used as the primary display name or title for an item. */
  itemDisplayNameKey: string;

  /** Configuration for how individual item data fields are defined and behave. */
  itemDefinition: {
    /** Array defining each field of a directory item. */
    fields: Array<{
      /** The actual key in the DirectoryItem data object (e.g., 'cuisine', 'author'). */
      key: string;
      /** User-friendly label for display purposes (e.g., 'Cuisine Type', 'Author Name'). */
      label: string;
      /** If true, this field's content will be included in general text searches. */
      isSearchable?: boolean;
      /** If true, unique values from this field can be used as filters (requires setup in `searchConfig.filterByFields`). */
      isFilterable?: boolean;
      /** If true, this field will be displayed in the summary card view (e.g., on search result pages). */
      displayInCard?: boolean;
      /** If true, this field will be displayed in the detailed item view page. */
      displayInDetail?: boolean;
      /** Optional React component (e.g., from lucide-react) to display as an icon next to the field. */
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  };

  /** SEO-related configurations, primarily for generating page titles and descriptions. */
  seo: {
    /** Template for search result page titles. Placeholders: {count}, {query}, {location}, {year}, {nicheNamePlural}. */
    titleTemplate: string;
    /** Template for search result page descriptions. Placeholders: {query}, {location}, {nicheNamePlural}. */
    descriptionTemplate: string;
    /** Template for item detail page titles. Placeholders: {itemName}, {category}, {nicheNameSingular}, {location}, {address}, and any item data key. */
    itemDetailTitleTemplate?: string;
    /** Template for item detail page descriptions. Placeholders: {itemName}, {category}, {nicheNameSingular}, {location}, {address}, and any item data key. */
    itemDetailDescriptionTemplate?: string;
  };

  /** Configuration for search functionality. */
  searchConfig: {
    /** An array of item keys (from `itemDefinition.fields`) that should be searched against when a user types a query. */
    searchableFields: string[];
    /** Placeholder text for the main search input field. */
    primarySearchPlaceholder: string;
    /** If true, a location-specific search input is enabled. */
    locationSearchable: boolean;
    /** Placeholder text for the location search input field (if enabled). */
    locationSearchPlaceholder?: string;
    /** Defines which fields can be used for faceted filtering. */
    filterByFields: Array<{
      /** The key in DirectoryItem data to use for filtering (e.g., 'tags', 'cuisine'). */
      key: string;
      /** User-friendly label for the filter group (e.g., 'Tags', 'Cuisine Types'). */
      label: string;
    }>;
  };

  /** Optional configuration for generating JSON-LD Schema.org structured data for item detail pages. */
  schemaOrg?: {
    /** The primary Schema.org type for your items (e.g., "Restaurant", "Book", "Event"). */
    type: string;
    /** Maps keys from DirectoryItem data to Schema.org properties. */
    propertyMappings?: Array<{
      /** The key in your DirectoryItem data. */
      itemKey: string;
      /** The Schema.org property (e.g., "name", "description", "address.streetAddress"). Use dot notation for nested properties. */
      schemaProperty: string;
      /** Set to true if this property belongs to an "Offer" type. */
      isOffer?: boolean;
      /** Set to true if this property belongs to a "Review" type (for individual reviews). */
      isReview?: boolean;
      /** Set to true if this property belongs to an "AggregateRating" type (e.g., "ratingValue", "reviewCount"). */
      isAggregateRating?: boolean;
      /** Set to true if this property represents GeoCoordinates (e.g., for latitude/longitude). */
      isGeoCoordinates?: boolean;
    }>;
  };
}

/**
 * The main configuration object for the directory.
 * Modify this object to tailor the template to your specific niche.
 */
export const nicheConfig: NicheConfig = {
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
