import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { nicheConfig } from "@/config"; // Import nicheConfig

const geistSans = Geist({
  variable: "--font-geist-sans", // This sets CSS var for Geist Sans
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${nicheConfig.nicheNameSingular} Finder`, // Dynamic title
  description: `Find the best ${nicheConfig.nicheNamePlural.toLowerCase()} near you`, // Dynamic description
};

// Helper function to convert HEX to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  if (!hex || hex.length < 4) return null; // Basic validation
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) { // #RGB format
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) { // #RRGGBB format
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else {
    return null; // Invalid format
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = nicheConfig.theme;

  // Default HSL values from globals.css (approximated)
  let primaryH = 126, primaryS = 38, primaryL = 48;
  let secondaryH = 240, secondaryS = 5, secondaryL = 96; // Adjusted S and L slightly for common representation

  if (theme?.primaryColor) {
    const hslPrimary = hexToHsl(theme.primaryColor);
    if (hslPrimary) {
      primaryH = hslPrimary.h;
      primaryS = hslPrimary.s;
      primaryL = hslPrimary.l;
    }
  }

  if (theme?.secondaryColor) {
    const hslSecondary = hexToHsl(theme.secondaryColor);
    if (hslSecondary) {
      secondaryH = hslSecondary.h;
      secondaryS = hslSecondary.s;
      secondaryL = hslSecondary.l;
    }
  }
  
  // Font family: Prepend custom font to Geist Sans if provided
  // The `geistSans.variable` already provides `--font-geist-sans`.
  // Tailwind will use `sans: ["var(--font-sans)", ...fontFamily.sans]`
  // So we define `--font-sans` to be either the custom font + geist, or just geist.
  const customFontFamily = theme?.fontFamily && theme.fontFamily.trim() !== "" ? `'${theme.fontFamily}', ` : "";

  const themeStyles = `
    :root {
      --color-primary-h: ${primaryH};
      --color-primary-s: ${primaryS}%;
      --color-primary-l: ${primaryL}%;
      --color-secondary-h: ${secondaryH};
      --color-secondary-s: ${secondaryS}%;
      --color-secondary-l: ${secondaryL}%;
      --font-sans: ${customFontFamily}var(--font-geist-sans);
    }
  `;

  const siteName = `${nicheConfig.nicheNamePlural} Finder`; // Or a more generic site name from config if available
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const logoUrl = `${baseUrl}/images/logo.png`; // Placeholder logo URL

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: logoUrl, // Optional: include if a logo is available
    // sameAs: [] // Optional: array of social media URLs
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const combinedSchemas = [organizationSchema, webSiteSchema];

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
        />
      </head>
      {/* Use geistSans.variable for the main font setup, which includes --font-geist-sans */}
      {/* The custom font (if any) is prepended via --font-sans in the <style> block */}
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
