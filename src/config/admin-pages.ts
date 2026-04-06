/**
 * Admin sidebar: each item maps to a public page. URLs use `/editor/...` so the
 * segment does not clash with Next.js `page.tsx` in the same folder.
 */
export const ADMIN_PAGE_NAV = [
  { href: "/editor/home", label: "Home" },
  { href: "/editor/services", label: "Services" },
  { href: "/editor/pricing", label: "Pricing" },
  { href: "/editor/portfolio", label: "Portfolio" },
  { href: "/editor/about", label: "About Us" },
  { href: "/editor/contact", label: "Contact Us" },
  { href: "/editor/free-trial", label: "Free Trial" },
] as const;
