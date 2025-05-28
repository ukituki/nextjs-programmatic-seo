import { NicheConfig } from "./niche.config.base";
import { Calendar, MapPin, Users, Info, DollarSign, Link as LinkIcon, Image as ImageIcon } from "lucide-react"; // Removed Ticket

export const eventsNicheConfig: NicheConfig = {
  nicheNameSingular: "Local Event",
  nicheNamePlural: "Local Events",
  itemDisplayNameKey: "eventName",
  itemDefinition: {
    fields: [
      { key: "eventName", label: "Event Name", isSearchable: true, displayInCard: true, displayInDetail: true, icon: Calendar },
      { key: "eventDate", label: "Date", displayInCard: true, displayInDetail: true, icon: Calendar }, // Consider date formatting
      { key: "venueName", label: "Venue", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true, icon: MapPin },
      { key: "address", label: "Address", isSearchable: true, displayInDetail: true, icon: MapPin },
      // 'location' field will be used for city/region for filtering. It's also in DirectoryItem by default.
      { key: "category", label: "Category", isSearchable: true, isFilterable: true, displayInCard: true, displayInDetail: true, icon: Info },
      { key: "description", label: "Description", isSearchable: true, displayInCard: false, displayInDetail: true },
      { key: "ticketPrice", label: "Price", displayInCard: true, displayInDetail: true, icon: DollarSign }, // Could be "Free" or a number
      { key: "eventWebsite", label: "Website", displayInDetail: true, icon: LinkIcon }, // Special handling for links
      { key: "organizer", label: "Organizer", isSearchable: true, displayInDetail: true, icon: Users },
      { key: "image", label: "Event Image", displayInCard: true, displayInDetail: true, icon: ImageIcon }, // Renamed from coverImage
    ],
  },
  seo: {
    titleTemplate: "Upcoming {query} {nicheNamePlural} in {location} | {year}",
    descriptionTemplate: "Find the best {query} {nicheNamePlural} in {location}. Dates, venues, and ticket information.",
    itemDetailTitleTemplate: "{itemName} - {category} Event in {location}",
    itemDetailDescriptionTemplate: "Join {itemName} on {eventDate} at {venueName}, {location}. Details: {description}",
  },
  searchConfig: {
    searchableFields: ["eventName", "venueName", "category", "description", "organizer", "address"],
    primarySearchPlaceholder: "Search events by name, venue, category...",
    locationSearchable: true, // Events are typically location-specific
    locationSearchPlaceholder: "Enter city or area",
    filterByFields: [
      { key: "category", label: "Categories" },
      { key: "venueName", label: "Venues" },
      // { key: "eventDate", label: "Dates"} // Filtering by date is complex, skip for now
    ],
  },
  schemaOrg: {
    type: "Event",
    propertyMappings: [
      { itemKey: "eventName", schemaProperty: "name" },
      { itemKey: "description", schemaProperty: "description" },
      { itemKey: "eventDate", schemaProperty: "startDate" }, // Needs ISO format ideally
      // { itemKey: "eventDateEnd", schemaProperty: "endDate" }, // If events have end dates
      { itemKey: "venueName", schemaProperty: "location.name" },
      { itemKey: "address", schemaProperty: "location.address.streetAddress" }, // If address is full
      { itemKey: "location", schemaProperty: "location.address.addressLocality" }, // City part from location
      { itemKey: "ticketPrice", schemaProperty: "offers.price" }, // Assuming price is a number, "Free" needs mapping
      { itemKey: "eventWebsite", schemaProperty: "url" },
      { itemKey: "image", schemaProperty: "image"}, // Updated from coverImage
      // { itemKey: "organizer", schemaProperty: "organizer.name" }, // If organizer is a string
    ],
  },
  assets: {
    // No specific assets defined for events yet
  },
  theme: {
    primaryColor: "#FFD700",
    secondaryColor: "#8A2BE2",
  },
};
