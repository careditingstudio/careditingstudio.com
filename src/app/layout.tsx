import type { Metadata, Viewport } from "next";
import { sans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://careditingstudio.com"),
  title: {
    default: "Car Editing Studio",
    template: "%s | Car Editing Studio",
  },
  description:
    "Automotive retouching and graphics — car edits, composites, and visual work for brands and creators.",
  openGraph: {
    title: "Car Editing Studio",
    description:
      "Automotive retouching and graphics — car edits, composites, and visual work.",
    url: "https://careditingstudio.com",
    siteName: "Car Editing Studio",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${sans.className} min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
