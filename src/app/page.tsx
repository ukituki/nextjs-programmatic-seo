import banner from "@/assets/restaurant-banner.jpg"; // Assuming a generic banner; ideally, this could also be niche-specific
import Header from "@/components/Header";
import Image from "next/image";
import { nicheConfig } from "@/config"; // Import nicheConfig

export default async function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto space-y-8 px-4 py-8">
        <div className="relative h-96 w-full">
          <Image
            src={banner}
            alt={`${nicheConfig.nicheNamePlural} Finder`} // Use nicheNamePlural in alt text
            fill // Changed from layout="fill"
            className="rounded-lg object-cover" // Combined objectFit
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end space-y-2 rounded-lg bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
            <h1 className="text-center text-3xl font-bold xl:text-4xl">
              Find the best {nicheConfig.nicheNamePlural.toLowerCase()} near you
            </h1>
            <p className="text-center text-lg">
              {nicheConfig.searchConfig.primarySearchPlaceholder}
            </p>
          </div>
        </div>
        {/* Placeholder for featured categories or items if desired */}
        {/* <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Categories</h2>
          {nicheConfig.searchConfig.filterByFields.slice(0, 3).map(field => (
            <div key={field.key}>{field.label}</div>
          ))}
        </section> */}
      </main>
    </div>
  );
}
