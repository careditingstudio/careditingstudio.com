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

function metadataBaseFromHeaders(h: Headers): URL {
  const host =
    h.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    h.get("host") ??
    "careditingstudio.com";
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const proto =
    h.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    (isLocal ? "http" : "https");
  return new URL(`${proto}://${host}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const metadataBase = metadataBaseFromHeaders(h);

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
    metadataBase,
    title: {
      default: "Car Editing Studio",
      template: "%s | Car Editing Studio",
    },
    description: baseDescription,
    keywords: tags.length > 0 ? tags : undefined,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/icon.png", type: "image/png", sizes: "180x180" }],
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
  themeColor: "#09090b",
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
