import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { ChromeScrollLockProvider } from "@/components/ChromeScrollLockContext";
import { HomeChromeProvider } from "@/components/HomeChromeProvider";
import { SiteTopChromeWrapper } from "@/components/SiteTopChromeWrapper";
import { readCms } from "@/lib/cms-store";
import { parseSiteTags } from "@/lib/site-tags";
import { sans } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  // Keep metadata stable even if CMS is temporarily unavailable.
  let tags: string[] = [];
  try {
    const cms = await readCms();
    tags = parseSiteTags(cms.site);
  } catch {
    tags = [];
  }

  const baseDescription =
    "Automotive retouching and graphics — car edits, composites, and visual work for brands and creators.";

  return {
    metadataBase: new URL("https://careditingstudio.com"),
    title: {
      default: "Car Editing Studio",
      template: "%s | Car Editing Studio",
    },
    description: baseDescription,
    keywords: tags.length > 0 ? tags : undefined,
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png" },
      ],
      apple: [
        { url: "/icon.png", type: "image/png" },
      ],
    },
    openGraph: {
      title: "Car Editing Studio",
      description: baseDescription,
      url: "https://careditingstudio.com",
      siteName: "Car Editing Studio",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Car Editing Studio",
      description: baseDescription,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f7" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const isAdminHost = isAdminHostFromIncomingHeaders((name) => h.get(name));

  if (isAdminHost) {
    return (
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={`${sans.className} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className={`${sans.className} flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          // Keep simple, stable schema to help Google understand site structure.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Car Editing Studio",
                  url: "https://careditingstudio.com/",
                },
                {
                  "@type": "Organization",
                  name: "Car Editing Studio",
                  url: "https://careditingstudio.com/",
                },
              ],
            }),
          }}
        />
        <HomeChromeProvider>
          <ChromeScrollLockProvider>
            <SiteTopChromeWrapper>{children}</SiteTopChromeWrapper>
          </ChromeScrollLockProvider>
        </HomeChromeProvider>
      </body>
    </html>
  );
}
