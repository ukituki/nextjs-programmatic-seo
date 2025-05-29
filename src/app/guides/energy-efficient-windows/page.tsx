import type { Metadata } from 'next';
import Link from 'next/link'; // For potential internal links
import Header from '@/components/Header'; // Assuming a generic header is desired

// Prepare today's date in YYYY-MM-DD format
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const dd = String(today.getDate()).padStart(2, '0');
const formattedDate = `${yyyy}-${mm}-${dd}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "/guides/energy-efficient-windows" // Updated placeholder
  },
  "headline": "The Ultimate Guide to Choosing Energy-Efficient Windows",
  "description": "Learn all about energy-efficient windows, from materials and glass types to understanding energy ratings like U-Factor and SHGC.",
  "image": [
    "/images/placeholder-guide-main.jpg", // Updated placeholder
    "/images/placeholder-guide-lowe.jpg",
    "/images/placeholder-nfrc.jpg" // Updated placeholder
   ],
  "author": {
    "@type": "Organization", // Assuming the site/org is the author
    "name": "Doors & Windows Products Experts" // Updated placeholder
  },  
  "publisher": {
    "@type": "Organization",
    "name": "Doors & Windows Products Experts", // Updated placeholder
    "logo": {
      "@type": "ImageObject",
      "url": "/assets/doors-windows-logo.png" // Updated placeholder
    }
  },
  "datePublished": formattedDate, // Updated placeholder
  "dateModified": formattedDate // Updated placeholder
};

export const metadata: Metadata = {
  title: jsonLd.headline,
  description: jsonLd.description,
  // The JSON-LD will be injected directly into the JSX for this task
};

export default function EnergyEfficientWindowsGuidePage() {
  return (
    <>
      <Header /> {/* Include a site header */}
      <div className="container mx-auto px-4 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="prose lg:prose-xl max-w-none mx-auto bg-white p-6 rounded-lg shadow-md">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{jsonLd.headline}</h1>
            <p className="text-sm text-gray-500">
              Published on <time dateTime={jsonLd.datePublished}>{new Date(jsonLd.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Welcome to your comprehensive guide on selecting energy-efficient windows for your home. Understanding the nuances of window technology can significantly impact your home's comfort, energy consumption, and environmental footprint. This guide will walk you through the key considerations, from materials and glass types to deciphering energy performance ratings.
            </p>
          </header>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-700 mb-3">Why Do Energy-Efficient Windows Matter?</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Energy-efficient windows are more than just a buzzword; they are a critical component of a sustainable and cost-effective home. Traditional, older windows can be a major source of energy loss, accounting for up to 25-30% of residential heating and cooling energy use. By choosing energy-efficient models, homeowners can reduce their utility bills, improve indoor comfort by minimizing drafts and cold spots, and lessen their carbon footprint.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Beyond energy savings, these windows also contribute to a quieter home environment by reducing outside noise. They can also protect your furniture, carpets, and artwork from fading by blocking harmful ultraviolet (UV) rays. Investing in high-performance windows is an investment in your home's value and your quality of life.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-700 mb-3">Key Factors that Make a Window Energy-Efficient</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Several components and technologies contribute to a window's overall energy efficiency. Understanding these factors will empower you to make an informed decision:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>
                <strong>Frame Material:</strong> Materials like vinyl, wood, fiberglass, and composite offer varying levels of insulation. Vinyl is popular for its low maintenance and good thermal performance, while wood offers excellent insulation but requires more upkeep. Fiberglass is durable and efficient, and composites combine the best features of multiple materials.
              </li>
              <li>
                <strong>Multiple Panes of Glass (Glazing):</strong> Double-pane or triple-pane windows significantly reduce heat transfer compared to single-pane windows. The air or gas fill between the panes acts as an insulator.
              </li>
              <li>
                <strong>Low-E Glass (Low-Emissivity Coatings):</strong> This is a microscopically thin, virtually invisible metallic coating applied to the glass surface. Low-E coatings reflect infrared heat, keeping heat inside during winter and outside during summer, without significantly reducing visible light.
              </li>
              <li>
                <strong>Gas Fills:</strong> Inert gases like argon or krypton are often filled between the panes of glass in double- or triple-glazed windows. These gases are denser than air and provide better insulation.
              </li>
              <li>
                <strong>Warm-Edge Spacers:</strong> Spacers keep the glass panes the correct distance apart. Warm-edge spacers are made of materials that conduct less heat than traditional metal spacers, reducing heat loss around the window edge and minimizing condensation.
              </li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              When evaluating windows, you'll also encounter NFRC (National Fenestration Rating Council) labels, which provide standardized ratings for U-factor, Solar Heat Gain Coefficient (SHGC), Visible Transmittance (VT), and Air Leakage (AL). Understanding these ratings is crucial for comparing products and ensuring they meet your local climate needs and energy goals. We'll delve deeper into these ratings in subsequent sections.
            </p>
          </section>
          
          {/* Placeholder for more sections if needed */}
          <div className="mt-12 text-center">
            <Link href="/guides" className="text-blue-600 hover:text-blue-800 hover:underline">
              Back to All Guides
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
