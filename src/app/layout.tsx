import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { headers } from "next/headers";
import Script from "next/script";
import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { ChromeScrollLockProvider } from "@/components/ChromeScrollLockContext";
import { HomeChromeProvider } from "@/components/HomeChromeProvider";
import { SiteTopChromeWrapper } from "@/components/SiteTopChromeWrapper";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { readCms } from "@/lib/cms-store";
import { getPublicVisitorState } from "@/lib/public-visitor";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
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
    alternates: {
      canonical: "/",
    },
    keywords: tags.length > 0 ? tags : undefined,
    icons: {
      icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/icon.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: {
      title: "Car Editing Studio",
      description: baseDescription,
      url: "https://careditingstudio.com",
      siteName: "Car Editing Studio",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 512,
          height: 512,
          alt: "Car Editing Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Car Editing Studio",
      description: baseDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
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
  /** GA4 — override via NEXT_PUBLIC_GA_MEASUREMENT_ID for staging/preview builds */
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-54LV6Y2J8R";

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

  let whatsappDial = "";
  let visitorLocale = "en";
  let visitorDir: "ltr" | "rtl" = "ltr";
  try {
    const cms = await readCms();
    whatsappDial = cms.site.whatsappDial?.trim() ?? "";
  } catch {
    whatsappDial = "";
  }
  try {
    const v = await getPublicVisitorState();
    visitorLocale = v.locale;
    visitorDir = v.locale === "ar" ? "rtl" : "ltr";
  } catch {
    /* headers unavailable — keep defaults */
  }

  const htmlLang = visitorLocale === "zh" ? "zh-Hans" : visitorLocale;

  return (
    <html
      lang={htmlLang}
      dir={visitorDir}
      className="h-full scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${sans.className} flex min-h-dvh flex-col bg-[var(--background)] text-[var(--foreground)] antialiased`}
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
        <FloatingWhatsAppButton whatsappDial={whatsappDial} />
        <Script id="tawk-to" strategy="lazyOnload">
          {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69e0f8ff06245e1c331a9ce4/1jmbcp9ji';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
        </Script>
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
