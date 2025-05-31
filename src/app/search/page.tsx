import Header from "@/components/Header";
import DirectoryItemCard from "@/components/DirectoryItemCard"; // Updated import
import { Skeleton } from "@/components/ui/skeleton";
import { getAllLocations, searchItems } from "@/lib/data-service"; // Updated import
import { DirectoryItem } from "@/interfaces"; // Added for type
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { nicheConfig } from "@/config"; // Added for ItemList schema

interface PageProps {
  searchParams: Promise<{ q?: string; location?: string } | { q?: string; location?: string }>;
}

export default async function Page({ searchParams: searchParamsInput }: PageProps) {
  const searchParams = await searchParamsInput; // Await the searchParams prop
  const { q, location } = searchParams;

  if (!q) redirect("/");

  // In a real app, a missing location param could automatically search close to the user's location
  // For now, if location is missing, we might fetch all locations and pick the first, or handle as an error/default.
  // Or, the searchItems function might handle empty location as "all locations".
  // Let's assume searchItems can handle an undefined location or we use a default.
  
  const allLocations = await getAllLocations();
  const userLocation = location || (allLocations.length > 0 ? allLocations[0] : "");


  return (
    <div>
      <Header q={q} location={userLocation} />
      <Suspense fallback={<ResultsLoadingSkeleton />} key={`${q}-${userLocation}`}>
        <Results q={q} location={userLocation} />
      </Suspense>
    </div>
  );
}

interface ResultsProps {
  q: string;
  location: string;
}

async function Results({ q, location }: ResultsProps) {
  const results: DirectoryItem[] = await searchItems(q, location); // Updated function call

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const itemListElements = results.map((item, index) => {
    const itemName = item[nicheConfig.itemDisplayNameKey] || item.name || "Unnamed Item";
    const itemSchema: any = {
      "@type": nicheConfig.schemaOrg?.type || "Thing", // Fallback to "Thing"
      "@id": `${baseUrl}/item/${item.slug}`,
      name: itemName,
      description: item.description || `Details for ${itemName}`, // Fallback description
      image: item.image || undefined, // Include image only if available
    };

    // Optionally add a few simple properties from propertyMappings
    // For example, if 'brand' or 'material' are defined and simple strings
    nicheConfig.schemaOrg?.propertyMappings?.forEach(mapping => {
      if (item[mapping.itemKey] && (mapping.schemaProperty === "brand.name" || mapping.schemaProperty === "brand" || mapping.schemaProperty === "material")) {
        if (mapping.schemaProperty === "brand.name" || mapping.schemaProperty === "brand") {
            itemSchema.brand = { "@type": "Brand", name: item[mapping.itemKey] };
        } else if (mapping.schemaProperty === "material") {
            itemSchema.material = item[mapping.itemKey];
        }
      }
    });


    return {
      "@type": "ListItem",
      position: index + 1,
      item: itemSchema,
    };
  });

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElements,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <main className="container mx-auto space-y-8 px-4 py-8">
        <p className="text-center font-semibold">
          Showing {results.length} results for {`"${q}"`}{location ? ` near ${location}` : ""}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => ( // Updated variable name and prop
            <DirectoryItemCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </>
  );
}

function ResultsLoadingSkeleton() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <Skeleton className="mx-auto h-7 w-[380px]" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[420px] w-full" />
        ))}
      </div>
    </div>
  );
}
