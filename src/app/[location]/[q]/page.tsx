import Header from "@/components/Header";
import DirectoryItemCard from "@/components/DirectoryItemCard";
import { getFilterOptions, getAllLocations, searchItems, FilterOption } from "@/lib/data-service";
import { DirectoryItem } from "@/interfaces";
import { Metadata } from "next";
import { cache } from "react";
import { nicheConfig } from "@/config"; // Updated import path
import Link from "next/link"; 
import { ChevronRight } from "lucide-react"; 

interface PageProps {
  params: { 
    location: string; 
    q: string;
  };
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const filterOptions = await getFilterOptions({ /* limitPerField: 5 */ }); 
  const locations = await getAllLocations(); 
  const paths: Array<{location: string, q: string}> = [];

  // Generate paths for filterable fields
  if (nicheConfig.searchConfig.filterByFields.length > 0 && filterOptions.length > 0) {
    const primaryFilterFieldKey = nicheConfig.searchConfig.filterByFields[0].key;
    const primaryFilterOption = filterOptions.find(opt => opt.key === primaryFilterFieldKey);

    if (primaryFilterOption && primaryFilterOption.values.length > 0) {
      primaryFilterOption.values.forEach((filterValue) => {
        locations.forEach((loc) => {
          paths.push({
            location: encodeURIComponent(loc),
            q: encodeURIComponent(filterValue),
          });
        });
      });
    } else {
      console.warn(`Primary filter option for key "${primaryFilterFieldKey}" not found or has no values for generateStaticParams.`);
    }
  } else {
    console.warn("No filter fields configured or no filter options found for generateStaticParams.");
  }
  
  // Add "all-items" path for each location
  locations.forEach((loc) => {
    paths.push({
      location: encodeURIComponent(loc),
      q: "all-items", // Use "all-items" as the query parameter
    });
  });

  return paths;
}

const getItems = cache(searchItems);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { q, location } = params;
  const qDecoded = decodeURIComponent(q); 
  const locationDecoded = decodeURIComponent(location); 
  const year = new Date().getFullYear(); 

  const isAllItemsQuery = qDecoded.toLowerCase() === "all-items";
  const results = await getItems(qDecoded, locationDecoded); // searchItems handles "all-items"

  let title: string;
  let description: string;

  if (isAllItemsQuery) {
    title = `All ${nicheConfig.nicheNamePlural} in ${locationDecoded} - Updated ${year}`;
    description = `Browse all available ${nicheConfig.nicheNamePlural.toLowerCase()} in ${locationDecoded}. Find locations, details, and more.`;
  } else {
    title = nicheConfig.seo.titleTemplate
      .replace("{count}", results.length.toString())
      .replace("{query}", qDecoded)
      .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
      .replace("{location}", locationDecoded)
      .replace("{year}", year.toString());
    description = nicheConfig.seo.descriptionTemplate
      .replace("{query}", qDecoded)
      .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
      .replace("{location}", locationDecoded);
  }

  return {
    title,
    description,
  };
}

export default async function Page({ params }: PageProps) {
  const { q, location } = params;
  const qDecoded = decodeURIComponent(q);
  const locationDecoded = decodeURIComponent(location);
  const locationEncoded = encodeURIComponent(locationDecoded); 
  const isAllItemsQuery = qDecoded.toLowerCase() === "all-items";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; 

  const results: DirectoryItem[] = await getItems(qDecoded, locationDecoded);

  let pageTitle: string;
  let breadcrumbQueryDisplay: string;

  if (isAllItemsQuery) {
    pageTitle = `All ${nicheConfig.nicheNamePlural} in ${locationDecoded}`;
    breadcrumbQueryDisplay = `All ${nicheConfig.nicheNamePlural}`; // More descriptive for breadcrumb when "all-items"
  } else {
    pageTitle = `${nicheConfig.seo.titleTemplate
      .replace("{count}", results.length.toString())
      .replace("{query}", qDecoded)
      .replace("{nicheNamePlural}", nicheConfig.nicheNamePlural)
      .replace("{location}", locationDecoded)
      .replace("- Updated {year}", "") 
    }`;
    breadcrumbQueryDisplay = qDecoded;
  }

  // Construct BreadcrumbList JSON-LD 
  const breadcrumbItemList = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": `${baseUrl}/` },
    {
      "@type": "ListItem",
      "position": 2,
      "name": locationDecoded,
      "item": `${baseUrl}/${locationEncoded}/all-items` // Link to the "all-items" page for the location
    }
  ];

  if (!isAllItemsQuery) {
    breadcrumbItemList.push({
      "@type": "ListItem",
      "position": 3,
      "name": qDecoded, 
      "item": `${baseUrl}/${locationEncoded}/${params.q}` 
    });
  } else {
    // For "all-items" page, the location breadcrumb (position 2) is the current page.
    // No need for a third item if qDecoded is "all-items".
    // The existing item at position 2 already points to the "all-items" URL.
    // We can optionally change its name to be more specific if desired.
    breadcrumbItemList[1].name = `All ${nicheConfig.nicheNamePlural} in ${locationDecoded}`;
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItemList
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isAllItemsQuery ? `All ${nicheConfig.nicheNamePlural} in ${locationDecoded}` : `Search results for ${qDecoded} in ${locationDecoded}`,
    "description": isAllItemsQuery ? `Browse all ${nicheConfig.nicheNamePlural.toLowerCase()} in ${locationDecoded}.` : `List of ${nicheConfig.nicheNamePlural.toLowerCase()} matching the query '${qDecoded}' in ${locationDecoded}.`,
    "itemListElement": results.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1, 
      "item": { 
        "@type": nicheConfig.schemaOrg?.type || "Thing", 
        "name": item[nicheConfig.itemDisplayNameKey] || item.name, 
        "url": `${baseUrl}/item/${item.slug}`, 
        ...(item.image && {image: item.image}), 
        ...(item.description && {description: item.description.substring(0,150) + "..."}), 
      }
    }))
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Header q={qDecoded} location={locationDecoded} />
      <main className="container mx-auto space-y-4 px-4 py-8">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center space-x-1.5">
            <li>
              <Link href="/" className="hover:text-primary hover:underline">Home</Link>
            </li>
            <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
            {isAllItemsQuery ? (
              <li aria-current="page" className="font-medium text-foreground">
                All {nicheConfig.nicheNamePlural} in {locationDecoded}
              </li>
            ) : (
              <>
                <li>
                  <Link href={`/${locationEncoded}/all-items`} className="hover:text-primary hover:underline">
                    {locationDecoded}
                  </Link>
                </li>
                <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
                <li aria-current="page" className="font-medium text-foreground">
                  {breadcrumbQueryDisplay}
                </li>
              </>
            )}
          </ol>
        </nav>

        <h1 className="text-center text-3xl font-bold">
          {pageTitle}
        </h1>
        {results.length === 0 && (
          <p className="text-center text-muted-foreground">
            No {nicheConfig.nicheNamePlural.toLowerCase()} found matching your criteria. Try a different search or location.
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <DirectoryItemCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </>
  );
}
