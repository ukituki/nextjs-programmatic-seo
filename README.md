# Next.js Programmatic SEO Directory Template

This template provides a robust foundation for building highly scalable, SEO-friendly directory websites using Next.js 15. It's designed to be easily configurable for any niche, allowing you to focus on your data and content strategy.

The core idea is to generate dynamic pages programmatically based on your data, targeting long-tail keywords and providing rich, structured information to search engines.

## Features

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS & Shadcn UI
*   **Programmatic SEO:** Dynamically generate pages for various search queries, locations, and item details.
*   **Dynamic Pages:** Statically cached page templates for optimal performance and SEO.
*   **Configurable Niche:** Easily adapt the template to any directory niche (restaurants, books, events, etc.) using `src/niche.config.ts`.
*   **Dynamic Data Integration:**
    *   Define your data structure via `src/interfaces/index.ts` (`DirectoryItem`).
    *   Populate your directory with data using `src/data/sample-data.ts`.
*   **Structured Data (JSON-LD):**
    *   Automatic generation of Schema.org structured data for item detail pages.
    *   Basic structured data (BreadcrumbList, ItemList) for search result pages.
    *   Configurable via `niche.config.ts`.
*   **Dynamic Sitemap:** `sitemap.xml` is generated automatically based on your locations, categories/filters, and individual items.
*   **Responsive Design:** Built with responsive UI components.
*   **SEO Optimized:** Metadata generation, semantic HTML, and structured data.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Core Configuration

The primary way to adapt this template to your specific directory niche is by modifying the configuration files: `src/niche.config.ts` and `src/data/sample-data.ts`.

### 1. `src/niche.config.ts`

This is the heart of your directory's customization. It defines the niche, data structure, SEO settings, search behavior, and structured data mapping.

Here's a breakdown of its properties:

*   **`nicheNameSingular: string`**: The singular name of your niche (e.g., "Restaurant", "Book"). Used for text generation.
*   **`nicheNamePlural: string`**: The plural name of your niche (e.g., "Restaurants", "Books"). Used for text generation.
*   **`itemDisplayNameKey: string`**: The key from your `DirectoryItem` data that should be used as the primary display name or title for an item (e.g., "name", "title").

*   **`itemDefinition.fields: Array<{...}>`**: Defines the structure and behavior of each data field for your directory items.
    *   `key: string`: The actual key in your data objects (e.g., "cuisine", "author", "eventDate").
    *   `label: string`: User-friendly label for display (e.g., "Cuisine Type", "Author Name", "Event Date").
    *   `isSearchable?: boolean`: If `true`, this field's content will be included in general text searches.
    *   `isFilterable?: boolean`: If `true`, unique values from this field can be used as filters (requires setup in `searchConfig.filterByFields`).
    *   `displayInCard?: boolean`: If `true`, this field will be displayed in the summary card view (e.g., on search result pages).
    *   `displayInDetail?: boolean`: If `true`, this field will be displayed in the detailed item view page.
    *   `icon?: React.ComponentType<{ className?: string }>`: (Optional) A React component (e.g., from `lucide-react`) to display as an icon next to the field.

    **Example `itemDefinition.fields` entry:**
    ```typescript
    {
      key: "cuisine",
      label: "Cuisine",
      isSearchable: true,
      isFilterable: true,
      displayInCard: true,
      displayInDetail: true,
      icon: ChefHat // Assuming ChefHat is imported from lucide-react
    }
    ```

*   **`seo: {...}`**: Configures templates for SEO metadata.
    *   `titleTemplate: string`: Template for search result pages (e.g., "Top {count} {query} {nicheNamePlural} in {location} - Updated {year}").
    *   `descriptionTemplate: string`: Template for search result page descriptions.
    *   `itemDetailTitleTemplate?: string`: Template for item detail page titles (e.g., "{itemName} - {category} {nicheNameSingular} in {location}").
    *   `itemDetailDescriptionTemplate?: string`: Template for item detail page descriptions.
    *   **Available placeholders:** `{count}`, `{query}`, `{location}`, `{year}`, `{itemName}`, `{category}`, `{nicheNameSingular}`, `{nicheNamePlural}`, `{address}` and any key from your item data.

*   **`searchConfig: {...}`**: Defines search functionality.
    *   `searchableFields: string[]`: An array of item keys (from `itemDefinition.fields`) that should be searched against when a user types a query.
    *   `primarySearchPlaceholder: string`: Placeholder text for the main search input.
    *   `locationSearchable: boolean`: If `true`, a location search input is enabled.
    *   `locationSearchPlaceholder?: string`: Placeholder text for the location search input.
    *   `filterByFields: Array<{ key: string; label: string; }>`: Defines which fields can be used for faceted filtering. The `key` must correspond to a key in your item data that you want to use for filtering (e.g., "cuisine", "category", "brand"). The `label` is for display purposes.

*   **`schemaOrg?: {...}`**: Configures JSON-LD structured data for item detail pages.
    *   `type: string`: The primary Schema.org type for your items (e.g., "Restaurant", "Book", "Event").
    *   `propertyMappings?: Array<{...}>`: Maps keys from your `DirectoryItem` data to Schema.org properties.
        *   `itemKey: string`: The key in your `DirectoryItem` data.
        *   `schemaProperty: string`: The Schema.org property (e.g., "name", "description", "address.streetAddress", "aggregateRating.ratingValue"). Use dot notation for nested properties.
        *   `isOffer?: boolean`: Set to `true` if this property belongs to an "Offer" type.
        *   `isReview?: boolean`: Set to `true` if this property belongs to a "Review" type (for individual reviews, not currently implemented in detail).
        *   `isAggregateRating?: boolean`: Set to `true` if this property belongs to an "AggregateRating" type (e.g., "ratingValue", "reviewCount").
        *   `isGeoCoordinates?: boolean`: (Future use) For latitude/longitude.

### 2. `src/data/sample-data.ts`

This file is where you provide the actual data for your directory.

*   **`sampleItems: DirectoryItem[]`**: An array of your directory items. Each item must conform to the `DirectoryItem` interface and include fields you've defined or intend to use in `niche.config.ts`.
    *   **Required base fields (from `DirectoryItem` interface in `src/interfaces/index.ts`):**
        *   `id: string | number`: Unique identifier.
        *   `name: string`: Primary display name (or use the field specified in `itemDisplayNameKey`).
        *   `slug: string`: URL-friendly slug for the item's detail page.
    *   **Recommended fields (often used by the template):**
        *   `image?: string`: URL for the item's image.
        *   `location?: string`: General location (e.g., "City, State").
        *   `address?: string`: Specific street address.
        *   `description?: string`: Detailed description.
        *   `category?: string`: Primary category for the item.
        *   `tags?: string[]`: Relevant tags.
        *   `rating?: number`: Numerical rating.
        *   `reviews?: number`: Number of reviews.
    *   **Custom Fields:** Add any other fields relevant to your niche as defined in `niche.config.ts` (e.g., `cuisine`, `author`, `eventDate`, `price`).

*   **`locations: string[]`**: An array of predefined locations used for generating static search pages and potentially for location filters.

### 3. `src/interfaces/index.ts`

*   **`DirectoryItem`**: This TypeScript interface defines the basic structure of an item in your directory. You can extend it with more specific fields if needed, but ensure your `sampleItems` and `niche.config.ts` are consistent with it. The `[key: string]: any;` allows for arbitrary custom properties.

### 4. Handling Non-Location-Specific Niches

The template's default URL structure for search and category pages is `/[location]/[q]`, which is optimized for location-based directories. If your niche is not location-specific (e.g., "Online Courses", "Digital Products", "Book Summaries"), you can adapt the template with the following workaround:

*   **Disable Location Search in UI:**
    *   In `src/niche.config.ts`, set `searchConfig.locationSearchable = false;`. This will hide the location input field in the header, focusing the user experience on the query input.

*   **Define a Generic "Location":**
    *   In `src/data/sample-data.ts`, modify the `locations` array to contain a single, generic value. For example:
        ```typescript
        export const locations: string[] = ["global"]; 
        // Or: export const locations: string[] = ["online"];
        // Or: export const locations: string[] = ["all"]; 
        ```
    *   If your `DirectoryItem` interface includes a `location` field, ensure all your `sampleItems` use this same generic value (e.g., `location: "global"`). If your items don't inherently have a location, you might still need to add this field with the generic value to satisfy the parts of the code that expect it (like `getAllLocations()` in `data-service.ts` which is used by `sitemap.ts` and `generateStaticParams`).

*   **URL Structure:**
    *   With these changes, your URLs for search/category pages will look like `/global/your-query` (or `/online/your-query`, etc.). While the generic location term remains in the URL, the user experience will be centered around the query.
    *   This approach maintains compatibility with the existing static site generation (SSG) and routing logic, which relies on the `/[location]/[q]` structure.

*   **Metadata and Content:**
    *   You'll need to adjust the SEO templates in `niche.config.ts` (e.g., `titleTemplate`, `descriptionTemplate`) and any on-page text to make sense without a specific, varying location. For example, instead of "Top Restaurants in {location}", your template might become "Best {query} Courses" if `location` is always "online".
    *   The `all-items` pages (e.g., `/global/all-items`) will list all items associated with that generic "location".

*   **Future Enhancement (Major Change):**
    *   For a purely non-location-based URL structure (e.g., `/search/[q]` or `/category/[q]`), more significant modifications to the routing logic in `src/app/[location]/[q]/page.tsx` (renaming the folder structure, updating `generateStaticParams`, `generateMetadata`, and link generation throughout the site) would be necessary. This workaround provides a simpler way to adapt the current structure.

## Customizing the UI

*   **Components:** Reusable React components are located in `src/components`.
*   **UI Primitives:** Basic UI elements (Button, Card, Input, etc.) are from Shadcn UI, located in `src/components/ui`. You can add more components from Shadcn UI using its CLI.
*   **Styling:** Primarily done using Tailwind CSS utility classes directly in your components. Global styles are in `src/app/globals.css`.
*   **Site Branding:** Modify `src/components/Header.tsx` to update the site title/logo and overall header appearance. The site title in the header also uses `nicheConfig.nicheNamePlural`.

## Deployment

Deploy your Next.js application to any platform that supports Node.js. Vercel (from the creators of Next.js) is highly recommended for its seamless integration and performance.

**Important Environment Variable:**

*   **`NEXT_PUBLIC_BASE_URL`**: For production deployments, set this environment variable to your website's full canonical URL (e.g., `https://www.yourdomain.com`). This is crucial for:
    *   Correct sitemap URL generation.
    *   Canonical URLs in metadata.
    *   JSON-LD `@id` fields.

## Example Niche Snippets (Conceptual)

Here are a couple of examples to illustrate how you might configure `niche.config.ts` and `sample-data.ts` for different niches.

### Example 1: Book Directory

**`src/niche.config.ts` (partial):**
```typescript
export const nicheConfig: NicheConfig = {
  nicheNameSingular: "Book",
  nicheNamePlural: "Books",
  itemDisplayNameKey: "title", // Assuming 'title' is the key for book titles in your data
  itemDefinition: {
    fields: [
      { key: "title", label: "Title", isSearchable: true, displayInCard: true, displayInDetail: true },
      { key: "author", label: "Author", isSearchable: true, displayInCard: true, displayInDetail: true },
      { key: "genre", label: "Genre", isFilterable: true, displayInCard: true, displayInDetail: true },
      { key: "publicationYear", label: "Year", displayInDetail: true },
      { key: "isbn", label: "ISBN", displayInDetail: true },
      { key: "coverImage", label: "Cover", displayInCard: true, displayInDetail: true }, // map to 'image' in schema
      { key: "summary", label: "Summary", displayInDetail: true }, // map to 'description' in schema
    ],
  },
  // For a non-location specific book directory:
  searchConfig: {
    // ... other search configs
    locationSearchable: false, // Disable location input
  },
  seo: { // Adjust templates to remove or generalize location
    titleTemplate: "Top {count} {query} {nicheNamePlural} - Updated {year}",
    descriptionTemplate: "Find the best {query} {nicheNamePlural} and explore various options.",
    itemDetailTitleTemplate: "{itemName} - {category} {nicheNameSingular}",
    itemDetailDescriptionTemplate: "Details for {itemName}, a {nicheNameSingular} of type {category}.",
  },
  schemaOrg: {
    type: "Book",
    propertyMappings: [
      { itemKey: "title", schemaProperty: "name" },
      { itemKey: "author", schemaProperty: "author.name" }, // Assuming author is just a name string
      { itemKey: "isbn", schemaProperty: "isbn" },
      { itemKey: "coverImage", schemaProperty: "image" },
      { itemKey: "summary", schemaProperty: "description" },
      { itemKey: "publicationYear", schemaProperty: "datePublished" },
      // ... other mappings
    ],
  },
};
```

**`src/data/sample-data.ts` (example entry for non-location specific book directory):**
```typescript
// For a non-location specific niche like books:
export const locations: string[] = ["all-books"]; // Single generic "location"

export const sampleItems: DirectoryItem[] = [
  {
    id: "978-0321765723",
    slug: "effective-java-3rd-edition",
    title: "Effective Java", // Matches itemDisplayNameKey
    author: "Joshua Bloch",
    genre: "Programming",
    publicationYear: 2018,
    isbn: "978-0321765723",
    coverImage: "https://example.com/effective-java.jpg",
    summary: "A comprehensive guide to the Java programming language...",
    name: "Effective Java", 
    image: "https://example.com/effective-java.jpg",
    location: "all-books", // Use the generic location
  },
  // ... more books
];
```

### Example 2: Local Events Directory (Location-Specific)

**`src/niche.config.ts` (partial):**
```typescript
export const nicheConfig: NicheConfig = {
  nicheNameSingular: "Event",
  nicheNamePlural: "Events",
  itemDisplayNameKey: "eventName",
  itemDefinition: {
    fields: [
      { key: "eventName", label: "Event Name", isSearchable: true, displayInCard: true, displayInDetail: true },
      { key: "eventDate", label: "Date", displayInCard: true, displayInDetail: true },
      { key: "venueName", label: "Venue", isSearchable: true, displayInCard: true, displayInDetail: true },
      { key: "eventType", label: "Type", isFilterable: true, displayInCard: true, displayInDetail: true },
      { key: "ticketPrice", label: "Price", displayInDetail: true },
      { key: "eventImage", label: "Image", displayInCard: true, displayInDetail: true },
      { key: "eventDescription", label: "Description", displayInDetail: true },
      { key: "location", label: "City", displayInCard: true, displayInDetail: true }, // Location for the event
      { key: "venueAddress", label: "Venue Address", displayInDetail: true },
    ],
  },
  searchConfig: {
    // ... other search configs
    locationSearchable: true, // Enable location input for events
  },
  seo: { // Location specific templates
    titleTemplate: "Top {count} {query} {nicheNamePlural} in {location} - Updated {year}",
    descriptionTemplate: "Find the best {query} {nicheNamePlural} in {location} and explore various options.",
    itemDetailTitleTemplate: "{itemName} - {category} {nicheNameSingular} in {location}",
    itemDetailDescriptionTemplate: "Details for {itemName}, a {nicheNameSingular} of type {category} in {location}.",
  },
  schemaOrg: {
    type: "Event",
    propertyMappings: [
      { itemKey: "eventName", schemaProperty: "name" },
      { itemKey: "eventDescription", schemaProperty: "description" },
      { itemKey: "eventImage", schemaProperty: "image" },
      { itemKey: "eventDate", schemaProperty: "startDate" }, // Needs formatting to ISO 8601
      // For location of Event:
      { itemKey: "venueName", schemaProperty: "location.name" },
      { itemKey: "venueAddress", schemaProperty: "location.address.streetAddress" },
      // ... other mappings
    ],
  },
};
```

**`src/data/sample-data.ts` (example entry for local events):**
```typescript
// For a location-specific niche like events:
export const locations: string[] = ["Anytown, USA", "Otherville, USA"]; // Specific locations

export const sampleItems: DirectoryItem[] = [
  {
    id: "evt123",
    slug: "summer-music-festival-2024",
    eventName: "Summer Music Festival 2024", // Matches itemDisplayNameKey
    eventDate: "2024-07-20T18:00:00Z", // ISO 8601 format
    venueName: "City Park Amphitheater",
    venueAddress: "123 Park Ave, Anytown, USA",
    eventType: "Music Festival",
    ticketPrice: "$50 - $150",
    eventImage: "https://example.com/festival.jpg",
    eventDescription: "Join us for a day of amazing music...",
    name: "Summer Music Festival 2024", 
    image: "https://example.com/festival.jpg",
    location: "Anytown, USA", // Specific location for this event
    address: "123 Park Ave, Anytown, USA",
  },
  // ... more events
];
```

## Acknowledgements

This template was originally based on concepts from a YouTube tutorial by [Insert Creator/Channel Name Here if applicable, or remove this section]. It has since been significantly refactored and expanded to serve as a general-purpose directory template.
*(If not based on a tutorial, this section can be removed or repurposed for other acknowledgements.)*
