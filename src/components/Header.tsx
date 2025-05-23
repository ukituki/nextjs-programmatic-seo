"use client";

import LocationInput from "@/components/LocationInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nicheConfig } from "@/config"; // Updated import path
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  q?: string;
  location?: string;
}

export default function Header({ q, location }: HeaderProps) {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentQ = formData.get("q") as string;
    const currentLocation = nicheConfig.searchConfig.locationSearchable ? formData.get("location") as string : "";

    // Construct the path for router.push
    // If q is present, use it, otherwise, it's a general browse/home for the location
    let path = "/";
    if (currentLocation && currentQ) {
      path = `/${encodeURIComponent(currentLocation)}/${encodeURIComponent(currentQ)}`;
    } else if (currentLocation) {
      path = `/${encodeURIComponent(currentLocation)}`; // Page for location only
    } else if (currentQ) {
      // This case might need specific handling, e.g. redirect to a global search page
      // or default to a predefined location if that makes sense for the niche.
      // For now, let's assume a search page or adapt as needed.
      // router.push(`/search?q=${encodeURIComponent(currentQ)}`);
      // Fallback to a generic search route if only q is provided
      router.push(`/search?q=${encodeURIComponent(currentQ)}${currentLocation ? '&location=' + encodeURIComponent(currentLocation) : ''}`);
      return;
    }
    // Fallback if q is empty, redirect to homepage or a specific browse page
    if (!currentQ && !currentLocation) {
        router.push('/');
        return;
    }
    if (path !== "/") {
        router.push(path);
    } else {
        // Handle cases where only q is provided, or neither q nor location.
        // This might redirect to a global search results page or the homepage.
        // For now, if path is still "/", it implies an issue or a specific unhandled case.
        // Defaulting to a search page format if only q is present.
        const newSearchParams = new URLSearchParams();
        if (currentQ) newSearchParams.set("q", currentQ);
        if (currentLocation) newSearchParams.set("location", currentLocation);
        if (newSearchParams.toString()) {
          router.push(`/search?${newSearchParams.toString()}`);
        } else {
          router.push('/'); // Fallback to home
        }
    }
  }

  return (
    <header className="bg-primary py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <span className="text-3xl font-bold text-primary-foreground">
              {nicheConfig.nicheNamePlural} Finder {/* Use nicheNamePlural */}
            </span>
          </Link>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-2xl flex-wrap gap-2 sm:flex-nowrap"
            // Use a key that forces re-render if q or location externally changes,
            // ensuring defaultValue in inputs is correctly updated.
            key={`header-form-${q}-${location}`}
          >
            <Input
              name="q"
              placeholder={nicheConfig.searchConfig.primarySearchPlaceholder} // Use placeholder from config
              defaultValue={q}
              type="search"
              // Making 'q' not strictly required to allow for location-only browsing
              // required
            />
            {nicheConfig.searchConfig.locationSearchable && ( // Conditionally display location input
              <LocationInput
                name="location"
                defaultValue={location}
                placeholder={nicheConfig.searchConfig.locationSearchPlaceholder || "Enter location..."} // Use placeholder from config
              />
            )}
            <Button type="submit" variant="secondary"> {/* Ensure button type is submit */}
              <Search className="mr-2 size-4" /> {/* Added margin for icon */}
              Search
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
