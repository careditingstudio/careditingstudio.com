import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { ChromeScrollLockProvider } from "@/components/ChromeScrollLockContext";
import { HomeChromeProvider } from "@/components/HomeChromeProvider";
import { SiteTopChromeWrapper } from "@/components/SiteTopChromeWrapper";
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
        <HomeChromeProvider>
          <ChromeScrollLockProvider>
            <SiteTopChromeWrapper>{children}</SiteTopChromeWrapper>
          </ChromeScrollLockProvider>
        </HomeChromeProvider>
      </body>
    </html>
  );
}
