import { getFilterOptions, getAllLocations, searchItems } from "@/lib/data-service"; // Added searchItems
import { nicheConfig } from "@/config"; // Updated import path
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const filterOptions = await getFilterOptions({ /* limitPerField: 10 */ });
  const locations = await getAllLocations();
  const allItems = await searchItems("", ""); // Fetch all items to get their slugs

  let searchLandingPages: MetadataRoute.Sitemap = [];

  if (nicheConfig.searchConfig.filterByFields.length > 0 && filterOptions.length > 0) {
    const primaryFilterFieldKey = nicheConfig.searchConfig.filterByFields[0].key;
    const primaryFilterOption = filterOptions.find(opt => opt.key === primaryFilterFieldKey);

    if (primaryFilterOption && primaryFilterOption.values.length > 0) {
      searchLandingPages = primaryFilterOption.values
        .map((filterValue) =>
          locations.map((location) => ({
            url: `${baseUrl}/${encodeURIComponent(location)}/${encodeURIComponent(filterValue)}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7, // Adjusted priority
          })),
        )
        .flat();
    } else {
      console.warn(`Sitemap: Primary filter option for key "${primaryFilterFieldKey}" not found or has no values.`);
    }
  } else {
    console.warn("Sitemap: No filter fields configured or no filter options found. Search landing pages might be limited.");
    searchLandingPages = locations.map(location => ({
        url: `${baseUrl}/${encodeURIComponent(location)}/all`, 
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
    }));
  }
  
  // Item detail pages
  const itemDetailPages: MetadataRoute.Sitemap = allItems.map(item => ({
    url: `${baseUrl}/item/${item.slug}`,
    lastModified: new Date(), // Could be item.lastModified if available
    changeFrequency: "monthly", // Or based on how often items are updated
    priority: 0.9, // High priority for actual item pages
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`, 
      lastModified: new Date(), 
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  return [
    ...staticPages,
    ...searchLandingPages,
    ...itemDetailPages, // Add item detail pages to the sitemap
  ];
}
