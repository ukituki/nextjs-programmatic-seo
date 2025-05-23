import { NicheConfig } from './niche.config.base';
import { restaurantsNicheConfig } from './niche.restaurants.config';
import { booksNicheConfig } from './niche.books.config';
import { eventsNicheConfig } from './niche.events.config'; // Import events config
import { DirectoryItem } from '@/interfaces';
import { sampleRestaurantItems, restaurantLocations } from '@/data/sample-data-restaurants';
import { sampleBookItems, bookLocations } from '@/data/sample-data-books';
import { sampleEventItems, eventLocations } from '@/data/sample-data-events'; // Import events data

// Default to 'restaurants'. Can be 'books', 'events', etc.
const activeNicheName = process.env.NEXT_PUBLIC_ACTIVE_NICHE || 'restaurants'; 

let activeConfig: NicheConfig;
let activeSampleItems: DirectoryItem[];
let activeLocations: string[];

if (activeNicheName === 'books') {
  activeConfig = booksNicheConfig;
  activeSampleItems = sampleBookItems;
  activeLocations = bookLocations;
  console.log("Activating BOOKS niche.");
} else if (activeNicheName === 'events') { // Added condition for events
  activeConfig = eventsNicheConfig;
  activeSampleItems = sampleEventItems;
  activeLocations = eventLocations;
  console.log("Activating EVENTS niche.");
} else { // Default to restaurants
  activeConfig = restaurantsNicheConfig;
  activeSampleItems = sampleRestaurantItems;
  activeLocations = restaurantLocations;
  console.log("Activating RESTAURANTS niche (default).");
}

export const nicheConfig = activeConfig;
export const sampleItems = activeSampleItems;
export const locations = activeLocations;

// Log the active niche to confirm during build/runtime
console.log(`Current active niche: ${activeNicheName}`);
console.log(`Loaded niche name: ${nicheConfig.nicheNamePlural}`);
