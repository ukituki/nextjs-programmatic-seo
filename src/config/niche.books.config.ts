import { NicheConfig } from "./niche.config.base"; // Updated import path
import { Users, BookOpen, Tag, Calendar, Landmark } from "lucide-react"; // Example icons

export const booksNicheConfig: NicheConfig = {
  nicheNameSingular: "Book",
  nicheNamePlural: "Books",
  itemDisplayNameKey: "title", // Assuming 'title' is a key in your book data
  itemDefinition: {
    fields: [
      { key: "title", label: "Title", isSearchable: true, displayInCard: true, displayInDetail: true, icon: BookOpen },
      { key: "author", label: "Author", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true, icon: Users },
      { key: "image", label: "Cover Image", displayInCard: true, displayInDetail: true }, // Will be handled as an image
      { key: "genre", label: "Genre", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true, icon: Tag },
      { key: "publicationYear", label: "Year", isFilterable: true, displayInDetail: true, icon: Calendar },
      { key: "isbn", label: "ISBN", displayInDetail: true, isSearchable: true },
      { key: "publisher", label: "Publisher", displayInDetail: true, icon: Landmark },
      { key: "summary", label: "Summary", isSearchable: true, displayInCard: false, displayInDetail: true }, // Too long for card
      { key: "pageCount", label: "Pages", displayInDetail: true },
      { key: "description", label: "Full Description", isSearchable: true, displayInCard: false, displayInDetail: true }, // Example, if summary is shorter
    ],
  },
  seo: {
    titleTemplate: "Find {query} {nicheNamePlural} - {location} | Updated {year}", // Note: {location} might be 'all' or generic
    descriptionTemplate: "Browse our collection of {query} {nicheNamePlural}.",
    itemDetailTitleTemplate: "{itemName} by {author} - {nicheNameSingular} Details", // Assuming 'author' is available
    itemDetailDescriptionTemplate: "Learn more about {itemName} by {author}. Genre: {genre}, Year: {publicationYear}.", // Assuming genre, pubYear
  },
  searchConfig: {
    searchableFields: ["title", "author", "genre", "summary", "isbn"],
    primarySearchPlaceholder: "Search by title, author, genre, ISBN...",
    locationSearchable: false, // Books are not typically location-specific in this context
    locationSearchPlaceholder: "", // Not used
    filterByFields: [
      { key: "genre", label: "Genres" },
      { key: "author", label: "Authors" },
      { key: "publicationYear", label: "Publication Years" },
    ],
  },
  schemaOrg: {
    type: "Book",
    propertyMappings: [
      { itemKey: "title", schemaProperty: "name" },
      { itemKey: "author", schemaProperty: "author.name" }, // Assuming author is a string, nest under Person object if structured
      { itemKey: "image", schemaProperty: "image" },
      { itemKey: "isbn", schemaProperty: "isbn" },
      { itemKey: "publicationYear", schemaProperty: "datePublished" },
      { itemKey: "publisher", schemaProperty: "publisher.name" },
      { itemKey: "summary", schemaProperty: "description" }, // Or use 'description' field
      { itemKey: "pageCount", schemaProperty: "numberOfPages" },
      { itemKey: "genre", schemaProperty: "genre" },
    ],
  },
  assets: {
    // No specific assets defined for books yet
  },
  theme: {
    primaryColor: "#0047AB",
    secondaryColor: "#E0E0E0",
  },
};
