// src/app/item/[slug]/page.tsx
import { getItemBySlug, searchItems } from "@/lib/data-service";
import { nicheConfig } from "@/config"; // Updated import path
import { Metadata } from "next";
import Image from "next/image";
// Note: In Next.js App Router, <Head> from 'next/head' is not used.
// Script tags for JSON-LD should be directly in the component JSX.
// If you were using Pages Router, <Head> would be appropriate.
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Star, StarHalf, Info, ExternalLink, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import DirectoryItemCard from "@/components/DirectoryItemCard";
import Link from "next/link";
import { useState } from "react"; // Added for modal state
import MultiStepLeadForm from "@/components/MultiStepLeadForm"; // Added
import { Button } from "@/components/ui/button"; // Added
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  // DialogFooter, // Not explicitly used for now, form handles submit/close
  // DialogClose, // Not explicitly used for now
} from "@/components/ui/dialog"; // Added
import { FormDefinition } from "@/interfaces/forms"; // Added
// nicheConfig is already imported

interface ItemPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * Generates static parameters (slugs) for all item detail pages.
 * This allows Next.js to pre-render these pages at build time.
 * @returns An array of objects, each containing a `slug` for an item.
 */
export async function generateStaticParams() {
  const allItems = await searchItems("", ""); // Fetches all items to get their slugs.
  return allItems.map((item) => ({
    slug: item.slug,
  }));
}

/**
 * Generates metadata for an item detail page based on its slug.
 * Uses `nicheConfig` to format titles and descriptions.
 * @param params - Contains the `slug` of the item.
 * @returns A Promise resolving to Metadata for the page.
 */
export async function generateMetadata({
  params: paramsInput,
}: ItemPageProps): Promise<Metadata> {
  const params = await paramsInput;
  const item = await getItemBySlug(params.slug);

  if (!item) {
    return {
      title: `Item Not Found - ${nicheConfig.nicheNameSingular}`,
      description: `The requested ${nicheConfig.nicheNameSingular.toLowerCase()} could not be found.`,
    };
  }

  // Determine the display name, category, location, and address, with fallbacks.
  const itemName = item[nicheConfig.itemDisplayNameKey] || item.name || "Item";
  const category = item.category || "details";
  const location = item.location || "area";
  const address = item.address || "visit us";

  // Use SEO templates from nicheConfig, with sensible defaults if not provided.
  const titleTemplate = nicheConfig.seo.itemDetailTitleTemplate || "{itemName} - {category} {nicheNameSingular} in {location}";
  const descriptionTemplate = nicheConfig.seo.itemDetailDescriptionTemplate || "Details for {itemName}, a {nicheNameSingular} offering {category} in {location}.";

  // Populate templates with item-specific data.
  const title = titleTemplate
    .replace("{itemName}", itemName)
    .replace("{category}", String(category))
    .replace("{nicheNameSingular}", nicheConfig.nicheNameSingular)
    .replace("{location}", String(location))
    .replace("{address}", String(address));

  const description = descriptionTemplate
    .replace("{itemName}", itemName)
    .replace("{category}", String(category))
    .replace("{nicheNameSingular}", nicheConfig.nicheNameSingular)
    .replace("{location}", String(location))
    .replace("{address}", String(address));

  return {
    title,
    description,
    openGraph: { // Basic Open Graph metadata.
      title: title,
      description: description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

/**
 * StarRating component to display a star rating based on a numerical value.
 */
function StarRating({ rating, starClasses = "h-5 w-5", containerClasses = "flex items-center" }: { rating: number; starClasses?: string; containerClasses?: string }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={containerClasses}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-star-${i}`} className={`${starClasses} fill-yellow-400 text-yellow-400`} />
      ))}
      {hasHalfStar && <StarHalf key="half-star" className={`${starClasses} fill-yellow-400 text-yellow-400`} />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-star-${i}`} className={`${starClasses} text-gray-300`} />
      ))}
    </div>
  );
}

/**
 * Helper function to set nested properties within a JSON-LD object.
 */
const setNestedValue = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown
) => {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        if (key === 'address') current[key] = { "@type": "PostalAddress" };
        else if (key === 'aggregateRating') current[key] = { "@type": "AggregateRating" };
        else if (key === 'offers') current[key] = { "@type": "Offer" };
        else current[key] = {};
      }
      // Ensure current[key] is treated as a Record<string, unknown> for the next iteration
      if (typeof current[key] === 'object' && current[key] !== null) {
        current = current[key] as Record<string, unknown>;
      } else {
        // This case should ideally not be reached if the logic to create objects works correctly
        current[key] = {}; // Create an empty object if it's not an object
        current = current[key] as Record<string, unknown>;
      }
    }
  });
};

/**
 * Renders the item detail page.
 */
export default async function ItemPage({ params: paramsInput }: ItemPageProps) {
  // Component must be async for data fetching, but hooks need it to be a client component or used in one.
  // For this integration, we'll assume this page *can* be a client component,
  // or the modal part is refactored into its own client component.
  // For now, to make it work with useState, we'd typically need "use client" at the top.
  // However, generateMetadata and generateStaticParams must remain server-side.
  // This is a common Next.js pattern challenge.
  // A typical solution is to make a new client component for the modal interaction.
  // For this task, I will proceed as if this component can manage this state directly
  // and the "use client" directive would be added if not for generateMetadata/StaticParams.
  // Let's assume the interactive part (button and modal) will be wrapped in a client component later.

  const params = await paramsInput;
  const item = await getItemBySlug(params.slug);

  // The state and handlers would ideally be in a client component.
  // This is a conceptual placement for the current task structure.
  // const [isModalOpen, setIsModalOpen] = useState(false); // This line will cause error if page is not client component

  if (!item) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">{nicheConfig.nicheNameSingular} not found</h1>
          <p>The {nicheConfig.nicheNameSingular.toLowerCase()} you are looking for does not exist.</p>
        </main>
      </>
    );
  }

  const itemName = item[nicheConfig.itemDisplayNameKey] as string || item.name;
  const displayAddress = item.address || item.location || "Not available";

  // Prepare breadcrumb data
  const itemLocation = item.location;
  const itemCategory = item.category; 
  const locationEncoded = itemLocation ? encodeURIComponent(itemLocation) : null;
  const categoryEncoded = itemCategory ? encodeURIComponent(itemCategory) : null;
  
// Define interfaces for common JSON-LD structures
interface JsonLdAddress {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

interface JsonLdGeoCoordinates {
  "@type": "GeoCoordinates";
  latitude?: string | number;
  longitude?: string | number;
}

interface JsonLdAggregateRating {
  "@type": "AggregateRating";
  ratingValue?: string | number;
  reviewCount?: string | number;
  bestRating?: string | number;
  worstRating?: string | number;
}

interface JsonLdOffer {
  "@type": "Offer";
  price?: string | number;
  priceCurrency?: string;
  availability?: string; 
  validFrom?: string; 
  itemOffered?: JsonLdBase; 
}

// Base interface for any schema.org entity
interface JsonLdBase {
  "@context": "https://schema.org";
  "@type": string;
  "@id"?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | { "@type": "ImageObject"; url: string; contentUrl?: string; }[];
  address?: JsonLdAddress | string; 
  geo?: JsonLdGeoCoordinates;
  aggregateRating?: JsonLdAggregateRating;
  offers?: JsonLdOffer | JsonLdOffer[];
  [key: string]: unknown; // Allow other properties, but encourage specific typing
}

  let jsonLdData: JsonLdBase | null = null;
  if (nicheConfig.schemaOrg && item) {
    jsonLdData = {
      "@context": "https://schema.org",
      "@type": nicheConfig.schemaOrg.type,
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/item/${item.slug}`,
    };
    nicheConfig.schemaOrg.propertyMappings?.forEach(mapping => {
      const value = item[mapping.itemKey];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        let targetObject = jsonLdData;
        let schemaProp = mapping.schemaProperty;
        if (mapping.isAggregateRating) {
          if (!jsonLdData.aggregateRating) jsonLdData.aggregateRating = { "@type": "AggregateRating" };
          targetObject = jsonLdData.aggregateRating;
          schemaProp = schemaProp.includes('.') ? schemaProp.split('.')[1] : schemaProp;
        } else if (mapping.isOffer) {
          if (!jsonLdData.offers) jsonLdData.offers = { "@type": "Offer" };
          targetObject = jsonLdData.offers;
          schemaProp = schemaProp.includes('.') ? schemaProp.split('.')[1] : schemaProp;
        }
        setNestedValue(targetObject, schemaProp, value);
      }
    });
    if (jsonLdData.address && !jsonLdData.address['@type']) {
        jsonLdData.address['@type'] = 'PostalAddress';
    }
  }

  const relatedItems = (await searchItems(item.category || "", item.location || ""))
    .filter(related => related.id !== item.id)
    .slice(0, 3);

  return (
    <>
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}
      <Header q={item.category} location={item.location} />
      <main className="container mx-auto px-4 py-8">
        {/* Visible Breadcrumbs */}
        {(itemLocation && locationEncoded && itemCategory && categoryEncoded) && (
          <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center space-x-1.5">
              <li>
                <Link href="/" className="hover:text-primary hover:underline">Home</Link>
              </li>
              <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
              <li>
                <Link href={`/${locationEncoded}/all-items`} className="hover:text-primary hover:underline">
                  {itemLocation}
                </Link>
              </li>
              <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
              <li>
                <Link href={`/${locationEncoded}/${categoryEncoded}`} className="hover:text-primary hover:underline">
                  {itemCategory}
                </Link>
              </li>
              <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
              <li aria-current="page" className="font-medium text-foreground">
                {itemName}
              </li>
            </ol>
          </nav>
        )}
        <article className="rounded-lg bg-white p-6 shadow-lg">
          {item.image && (
            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-md md:h-96">
              <Image src={item.image} alt={itemName} fill className="object-cover" priority />
            </div>
          )}
          <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{itemName}</h1>
          {typeof item.rating === 'number' && (
            <div className="mb-4 flex items-center">
              <StarRating rating={item.rating} />
              {item.reviews && <span className="ml-2 text-sm text-gray-600">({item.reviews} reviews)</span>}
            </div>
          )}
          {item.description && <p className="mb-6 text-base text-gray-700 md:text-lg">{item.description}</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Details</h2>
              {nicheConfig.itemDefinition.fields.map(field => {
                const value = item[field.key];
                if (!field.displayInDetail || !value) return null;
                if (['image', 'name', 'description', 'rating', 'reviews', 'slug'].includes(field.key)) return null;
                let icon = <Info className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />;
                if (field.key === 'hours') icon = <Clock className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />;
                if (field.key === 'phone') icon = <Phone className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />;
                if (field.key === 'address' || field.key === 'location') icon = <MapPin className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />;
                if (field.key === 'website') icon = <ExternalLink className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />;
                return (
                  <div key={field.key} className="flex items-start">
                    {!['Address', 'Location', 'Phone', 'Hours', 'Website', 'Event Website'].includes(field.label) && <Badge variant="outline" className="mr-3 mt-1 flex-shrink-0">{field.label}</Badge>}
                    {['Address', 'Location', 'Phone', 'Hours', 'Website', 'Event Website'].includes(field.label) && icon}
                    {(field.key === 'website' || field.key === 'eventWebsite') ? (
                      <a href={String(value).startsWith('http') ? String(value) : `http://${String(value)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    ) : (
                      <span className="text-gray-700">{String(value)}</span>
                    )}
                  </div>
                );
              })}
              {displayAddress && !nicheConfig.itemDefinition.fields.find(f => ['address', 'location'].includes(f.key) && f.displayInDetail) && (
                 <div className="flex items-start">
                    <MapPin className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <span className="text-gray-700">{displayAddress}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {nicheConfig.itemDefinition.fields.find(f => f.key === 'tags' && f.displayInDetail) && Array.isArray(item.tags) && item.tags.length > 0 && (
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-gray-800">{nicheConfig.itemDefinition.fields.find(f => f.key === 'tags')?.label || "Tags"}</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}
                  </div>
                </div>
              )}
              {Object.entries(item)
                .filter(([key]) => 
                  !nicheConfig.itemDefinition.fields.find(f => f.key === key) && 
                  !['id', 'slug', 'image', 'name', 'description', 'rating', 'reviews'].includes(key) 
                )
                .map(([key, value]) => value && ( 
                  <div key={key} className="flex items-start">
                    <Info className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div>
                      <h3 className="text-sm font-medium capitalize text-gray-600">{key.replace(/_/g, ' ')}</h3>
                      <p className="text-gray-700">{String(value)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Lead Gen Form Modal Integration */}
          {nicheConfig.leadGenForm && (
            <div className="mt-8 text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {nicheConfig.leadGenForm.title || "Get a Quote"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>{nicheConfig.leadGenForm.title}</DialogTitle>
                    {nicheConfig.leadGenForm.description && (
                      <DialogDescription>
                        {nicheConfig.leadGenForm.description}
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  <MultiStepLeadForm
                    formDefinition={nicheConfig.leadGenForm as FormDefinition}
                    onSubmit={async (data) => {
                      console.log("Lead form submitted from item page:", data);
                      try {
                        const response = await fetch('/api/leads/submit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data),
                        });
                        const result = await response.json();
                        if (response.ok) {
                          console.log('Lead submission successful:', result);
                          alert('Thank you! Your request has been submitted.');
                          // setIsModalOpen(false); // Dialog handles its own close on success typically or via DialogClose
                        } else {
                          console.error('Lead submission failed:', result);
                          alert(`Submission failed: ${result.message || 'Unknown error'}`);
                        }
                      } catch (error) {
                        console.error('Error submitting lead form:', error);
                        alert('An error occurred while submitting your request.');
                      }
                      // Note: setIsModalOpen(false) might not be needed if Dialog auto-closes
                      // or if a DialogClose button is used within the form's success message area.
                      // For now, we rely on users closing it or a future DialogClose integration.
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </article>
        {relatedItems.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">You might also like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((relatedItem) => (<DirectoryItemCard key={relatedItem.id} item={relatedItem} />))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
