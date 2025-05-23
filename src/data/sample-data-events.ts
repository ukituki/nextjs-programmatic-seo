import { DirectoryItem } from "@/interfaces";

export const sampleEventItems: DirectoryItem[] = [
  {
    id: "event1",
    slug: "summer-music-festival-2024",
    eventName: "Summer Music Festival 2024",
    eventDate: "2024-08-15T18:00:00", // ISO format for dates
    venueName: "City Park Amphitheater",
    address: "123 Park Ave",
    location: "San Francisco, CA", // Used for location filtering
    category: "Music",
    description: "An outdoor music festival featuring top local bands and artists. Food trucks and activities available.",
    ticketPrice: "25", // Or "Free"
    eventWebsite: "https://example.com/summerfest",
    organizer: "SF Events Co.",
    // coverImage property removed, 'image' is now the primary image field.
    // Ensure base DirectoryItem fields are present if not directly mapped from above
    name: "Summer Music Festival 2024", // From itemDisplayNameKey
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80", 
  },
  {
    id: "event2",
    slug: "tech-conference-2024",
    eventName: "Tech Conference 2024",
    eventDate: "2024-10-20T09:00:00",
    venueName: "Downtown Convention Center",
    address: "456 Market St",
    location: "San Francisco, CA",
    category: "Technology",
    description: "A deep dive into the future of AI and Web3. Keynote speakers from major tech companies.",
    ticketPrice: "199",
    eventWebsite: "https://example.com/techconf",
    organizer: "Future Tech Institute",
    // coverImage property removed
    name: "Tech Conference 2024",
    image: "https://images.unsplash.com/photo-1495754149474-e54c07932677?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "event3",
    slug: "chicago-art-exhibition-fall",
    eventName: "Fall Art Exhibition",
    eventDate: "2024-09-05T10:00:00",
    venueName: "Grand Gallery Hall",
    address: "789 Art St",
    location: "Chicago, IL",
    category: "Arts & Culture",
    description: "Showcasing contemporary art from emerging artists in the Midwest.",
    ticketPrice: "Free",
    eventWebsite: "https://example.com/artfall",
    organizer: "Chicago Art Society",
    // coverImage property removed
    name: "Fall Art Exhibition",
    image: "https://images.unsplash.com/photo-1531026307540-35c99905332f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "event4",
    slug: "miami-food-truck-rally",
    eventName: "Miami Food Truck Rally",
    eventDate: "2024-11-12T12:00:00",
    venueName: "Bayfront Park South",
    address: "301 Biscayne Blvd",
    location: "Miami, FL",
    category: "Food & Drink",
    description: "A gathering of the best food trucks in Miami, offering diverse cuisines.",
    ticketPrice: "Free Entry", // Price might be for food items
    eventWebsite: "https://example.com/miamifoodrally",
    organizer: "Miami Foodies United",
    // coverImage property removed
    name: "Miami Food Truck Rally",
    image: "https://images.unsplash.com/photo-1576642028089-679c89809249?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "event5",
    slug: "beginners-coding-workshop-chicago",
    eventName: "Beginner's Coding Workshop",
    eventDate: "2024-07-25T14:00:00",
    venueName: "Tech Hub Chicago",
    address: "101 Coding Ln",
    location: "Chicago, IL",
    category: "Workshop",
    description: "Learn the basics of Python programming in this hands-on workshop. No prior experience needed.",
    ticketPrice: "50",
    eventWebsite: "https://example.com/codingworkshop",
    organizer: "Code Academy IL",
    // coverImage property removed
    name: "Beginner's Coding Workshop",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  }
];

// Extract unique locations from sample events for the locations array
export const eventLocations: string[] = Array.from(new Set(sampleEventItems.map(event => event.location).filter(Boolean) as string[]));
