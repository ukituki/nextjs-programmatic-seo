import banner from "@/assets/restaurant-banner.jpg"; // Assuming a generic banner
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { nicheConfig } from "@/config";
import { getFilterOptions, searchItems, getAllLocations } from "@/lib/data-service";
import { DirectoryItem } from "@/interfaces"; // For typing featuredItems
import DirectoryItemCard from "@/components/DirectoryItemCard";

export default async function Home() {
  // Fetch data for new sections
  const filterOptions = await getFilterOptions({});
  const featuredItems: DirectoryItem[] = (await searchItems("", "")).slice(0, 4);
  
  let locations: string[] = [];
  if (nicheConfig.searchConfig.locationSearchable) {
    locations = (await getAllLocations()).slice(0, 5);
  }

  const primaryFilterField = nicheConfig.searchConfig.filterByFields.length > 0 
    ? nicheConfig.searchConfig.filterByFields[0] 
    : null;
  
  let primaryFilterOptionValues: string[] = [];
  if (primaryFilterField && filterOptions.length > 0) {
    const foundOption = filterOptions.find(opt => opt.key === primaryFilterField.key);
    if (foundOption && foundOption.values.length > 0) {
      primaryFilterOptionValues = foundOption.values.slice(0, 5);
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto space-y-12 px-4 py-8">
        {/* Existing Banner Section */}
        <div className="relative h-96 w-full">
          <Image
            src={banner}
            alt={`${nicheConfig.nicheNamePlural} Finder`}
            fill
            className="rounded-lg object-cover"
            priority // Added priority for LCP
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end space-y-2 rounded-lg bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 text-white">
            <h1 className="text-center text-3xl font-bold md:text-4xl xl:text-5xl">
              Find the best {nicheConfig.nicheNamePlural.toLowerCase()} near you
            </h1>
            <p className="text-center text-lg md:text-xl">
              {nicheConfig.searchConfig.primarySearchPlaceholder}
            </p>
          </div>
        </div>

        {/* Featured Categories Section */}
        {primaryFilterField && primaryFilterOptionValues.length > 0 && (
          <section>
            <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">
              Explore by {primaryFilterField.label}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {primaryFilterOptionValues.map((value) => (
                <Link
                  key={value}
                  href={`/search?q=${encodeURIComponent(value)}`}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 md:px-6 md:text-base"
                >
                  {value}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Items Section */}
        {featuredItems.length > 0 && (
          <section>
            <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">
              Featured {nicheConfig.nicheNamePlural}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredItems.map((item) => (
                <DirectoryItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
        
        {/* Empty state for featured items if none are found but section is expected */}
        {/* {featuredItems.length === 0 && (
          <section className="text-center text-muted-foreground">
             No featured {nicheConfig.nicheNamePlural.toLowerCase()} to display right now.
          </section>
        )} */}


        {/* Browse Locations Section */}
        {nicheConfig.searchConfig.locationSearchable && locations.length > 0 && (
          <section>
            <h2 className="mb-6 text-center text-2xl font-semibold md:text-3xl">
              Browse by Location
            </h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {locations.map((location) => (
                <Link
                  key={location}
                  href={`/${encodeURIComponent(location)}/all-items`}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 md:px-6 md:text-base"
                >
                  {location}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
