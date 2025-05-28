import Header from "@/components/Header";
import DirectoryItemCard from "@/components/DirectoryItemCard"; // Updated import
import { Skeleton } from "@/components/ui/skeleton";
import { getAllLocations, searchItems } from "@/lib/data-service"; // Updated import
import { DirectoryItem } from "@/interfaces"; // Added for type
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  searchParams: { q?: string; location?: string }; // searchParams are not a Promise here
}

export default async function Page({ searchParams }: PageProps) {
  const { q, location } = searchParams; // Directly access searchParams

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

  return (
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
