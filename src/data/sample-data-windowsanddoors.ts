import { DirectoryItem } from '../interfaces';

export const sampleWindowsAndDoorsItems: DirectoryItem[] = [
  {
    id: 1,
    productName: "Modern Fiberglass Entry Door",
    slug: "modern-fiberglass-entry-door",
    image: "https://images.unsplash.com/photo-1599946343373-2ff519e0a7ea?w=800&auto=format&fit=crop&q=60", // Generic modern door
    description: "A sleek and durable fiberglass entry door, perfect for modern homes. Offers excellent insulation and security.",
    material: "Fiberglass",
    style: "Entry Door",
    size: "36x80",
    energyRating: "Energy Star Certified",
    brand: "Therma-Tru",
    priceRange: "$$$",
    location: "New York, NY",
    address: "123 Main St, New York, NY 10001",
    phone: "(212) 555-0101",
    website: "https://www.thermatru.example.com",
    tags: ["Entry Door", "Modern", "Fiberglass", "Energy Efficient"]
  },
  {
    id: 2,
    productName: "Classic Wood Casement Window",
    slug: "classic-wood-casement-window",
    image: "https://images.unsplash.com/photo-1520207502691-2a2c901734e6?w=800&auto=format&fit=crop&q=60", // Generic window
    description: "Beautifully crafted wood casement window, adding a timeless touch to any home. Features easy-to-use crank operation.",
    material: "Wood",
    style: "Casement Window",
    size: "30x48",
    energyRating: "Low-E Glass",
    brand: "Andersen",
    priceRange: "$$$$",
    location: "Los Angeles, CA",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    phone: "(310) 555-0102",
    website: "https://www.andersenwindows.example.com",
    tags: ["Casement Window", "Wood", "Classic", "Replacement"]
  },
  {
    id: 3,
    productName: "Vinyl Sliding Patio Door",
    slug: "vinyl-sliding-patio-door",
    image: "https://images.unsplash.com/photo-1600585152220-0f7937040036?w=800&auto=format&fit=crop&q=60", // Generic sliding door
    description: "Durable and low-maintenance vinyl sliding patio door. Provides smooth operation and energy efficiency.",
    material: "Vinyl",
    style: "Sliding Door",
    size: "72x80",
    energyRating: "Energy Star Certified",
    brand: "Pella",
    priceRange: "$$",
    location: "Chicago, IL",
    address: "789 Pine Rd, Chicago, IL 60601",
    phone: "(312) 555-0103",
    website: "https://www.pella.example.com",
    tags: ["Patio Door", "Vinyl", "Sliding", "New Installation"]
  },
  {
    id: 4,
    productName: "Aluminum Double-Hung Window",
    slug: "aluminum-double-hung-window",
    image: "https://images.unsplash.com/photo-1618221097048-250e3a037618?w=800&auto=format&fit=crop&q=60", // Generic double hung window
    description: "Strong and lightweight aluminum double-hung window, ideal for contemporary designs and durability.",
    material: "Aluminum",
    style: "Double-Hung Window",
    size: "28x54",
    energyRating: "Standard Glazing",
    brand: "Jeld-Wen",
    priceRange: "$$",
    location: "Houston, TX",
    address: "101 Maple Dr, Houston, TX 77001",
    phone: "(713) 555-0104",
    website: "https://www.jeld-wen.example.com",
    tags: ["Double-Hung Window", "Aluminum", "Contemporary", "Custom Size"]
  },
  {
    id: 5,
    productName: "Fiberglass French Doors",
    slug: "fiberglass-french-doors",
    image: "https://images.unsplash.com/photo-1556912173-35fee9eb96b4?w=800&auto=format&fit=crop&q=60", // Generic french doors
    description: "Elegant fiberglass French doors that offer the look of wood with minimal maintenance. Enhances natural light.",
    material: "Fiberglass",
    style: "French Door",
    size: "60x80",
    energyRating: "Low-E Glass",
    brand: "Marvin",
    priceRange: "$$$$",
    location: "Phoenix, AZ",
    address: "202 Birch Ln, Phoenix, AZ 85001",
    phone: "(602) 555-0105",
    website: "https://www.marvin.example.com",
    tags: ["French Door", "Fiberglass", "Elegant", "Patio Access"]
  },
  {
    id: 6,
    productName: "Energy Efficient Vinyl Window",
    slug: "energy-efficient-vinyl-window",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60", // Generic house window
    description: "High-performance vinyl window designed for maximum energy savings and comfort. Triple-pane glass option available.",
    material: "Vinyl",
    style: "Picture Window",
    size: "48x36",
    energyRating: "Triple-Pane, Energy Star",
    brand: "Simonton",
    priceRange: "$$$",
    location: "New York, NY", // Duplicate location for testing
    address: "303 Cedar Ave, New York, NY 10002",
    phone: "(212) 555-0106",
    website: "https://www.simonton.example.com",
    tags: ["Picture Window", "Vinyl", "Energy Efficient", "Triple-Pane"]
  },
  {
    id: 7,
    productName: "Custom Wooden Arch Window",
    slug: "custom-wooden-arch-window",
    image: "https://images.unsplash.com/photo-1604707571124-2f7987e7d619?w=800&auto=format&fit=crop&q=60", // Generic arched window
    description: "Bespoke wooden arch window, crafted to your specifications. A statement piece for unique architectural styles.",
    material: "Wood",
    style: "Arch Window",
    size: "Custom",
    energyRating: "Low-E Glass, Argon Filled",
    brand: "Andersen", // Duplicate brand for testing
    priceRange: "$$$$",
    location: "San Francisco, CA",
    address: "505 Redwood Blvd, San Francisco, CA 94102",
    phone: "(415) 555-0107",
    website: "https://www.andersenwindows.example.com/custom",
    tags: ["Custom Window", "Wood", "Arch", "Luxury"]
  }
];

export const windowsAndDoorsLocations: string[] = Array.from(
  new Set(sampleWindowsAndDoorsItems.map(item => item.location))
);
