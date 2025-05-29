// src/config/niche.config.base.ts
import { FormDefinition } from "../interfaces/forms";

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

  /** Optional configuration for assets like images and logos. */
  assets?: {
    homeBannerImage?: string;
    logo?: string;
    defaultSocialImage?: string;
  };

  /** Optional configuration for theme customization. */
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };

  /** Optional configuration for lead generation forms associated with the niche. */
  leadGenForm?: FormDefinition;
}
