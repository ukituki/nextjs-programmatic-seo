import { NicheConfig } from "./niche.config.base";

export const windowsAndDoorsConfig: NicheConfig = {
  nicheNameSingular: "Window and Door",
  nicheNamePlural: "Windows and Doors",
  itemDisplayNameKey: "productName",
  itemDefinition: {
    fields: [
      { name: "productName", type: "string", searchable: true, displayInCard: true, displayInDetail: true },
      { name: "image", type: "string", displayInCard: true, displayInDetail: true },
      { name: "description", type: "string", searchable: true, displayInCard: true, displayInDetail: true },
      { name: "material", type: "string", searchable: true, filterable: true, displayInCard: true, displayInDetail: true, examples: ["Wood", "Vinyl", "Aluminum", "Fiberglass"] },
      { name: "style", type: "string", searchable: true, filterable: true, displayInCard: true, displayInDetail: true, examples: ["Sliding Door", "French Door", "Casement Window", "Double-Hung Window"] },
      { name: "size", type: "string", displayInDetail: true, examples: ["36x80", "30x60"] },
      { name: "energyRating", type: "string", filterable: true, displayInDetail: true, examples: ["Energy Star Certified", "Low-E Glass"] },
      { name: "brand", type: "string", searchable: true, filterable: true, displayInDetail: true },
      { name: "priceRange", type: "string", filterable: true, displayInDetail: true, examples: ["$", "$$", "$$$"] },
      { name: "location", type: "string", searchable: true, displayInCard: true, displayInDetail: true },
      { name: "address", type: "string", searchable: true, displayInDetail: true },
      { name: "phone", type: "string", displayInDetail: true },
      { name: "website", type: "string", displayInDetail: true },
      { name: "tags", type: "array", subType: "string", searchable: true, filterable: true, displayInCard: true, displayInDetail: true },
    ],
  },
  seo: {
    titleTemplate: "Explore {count} {query} {nicheNamePlural} in {location} - {year}",
    descriptionTemplate: "Find top-rated {query} {nicheNamePlural} in {location}. Browse styles, materials, and brands.",
    itemDetailTitleTemplate: "{itemName} - {style} {nicheNameSingular} in {location}",
    itemDetailDescriptionTemplate: "Details for {itemName}, a {material} {style} {nicheNameSingular}. Available in {location}.",
  },
  searchConfig: {
    searchableFields: ["productName", "material", "style", "brand", "description", "location", "address", "tags"],
    primarySearchPlaceholder: "Search windows, doors, brands",
    locationSearchable: true,
    locationSearchPlaceholder: "Enter city or zip code",
    filterByFields: [
      { key: "material", label: "Materials" },
      { key: "style", label: "Styles" },
      { key: "brand", label: "Brands" },
      { key: "energyRating", label: "Energy Ratings" },
      { key: "priceRange", label: "Price Ranges" },
      { key: "tags", label: "Tags" },
    ],
  },
  schemaOrg: {
    type: "Product",
    propertyMappings: [
      { itemKey: "productName", schemaProperty: "name" },
      { itemKey: "description", schemaProperty: "description" },
      { itemKey: "image", schemaProperty: "image" },
      { itemKey: "brand", schemaProperty: "brand.name" },
      { itemKey: "material", schemaProperty: "material" },
      // TODO: Add more specific schema properties for style, size, energyRating if available
      // Offer-related properties
      { itemKey: "priceRange", schemaProperty: "offers.priceRange", isOffer: true },
      { itemKey: "address", schemaProperty: "offers.availableAtOrFrom.address.streetAddress", isOffer: true },
      { itemKey: "location", schemaProperty: "offers.availableAtOrFrom.address.addressLocality", isOffer: true },
      { itemKey: "phone", schemaProperty: "offers.availableAtOrFrom.telephone", isOffer: true },
      // General properties
      { itemKey: "website", schemaProperty: "url" }, // General URL for the product/service page
      // Note: Price mapping for offers can be complex.
      // Example for a simple price string (e.g. "$100-$200"):
      // { itemKey: "priceRange", schemaProperty: "offers.priceSpecification.price", isOffer: true },
      // Example for currency:
      // { itemKey: "priceRange", schemaProperty: "offers.priceCurrency", isOffer: true, defaultValue: "USD" },
    ],
  },
  assets: {
    homeBannerImage: "/images/placeholder-banner.jpg", // Changed to .jpg to avoid SVG error
  },
  theme: {
    primaryColor: "#004A7F", // A suitable blue
    secondaryColor: "#D4E3ED", // A light blue/grey
  },
};
