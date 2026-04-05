/**
 * Admin sidebar: each item maps to a public site page you can edit settings for.
 * URLs use `/editor/...` (not `/page/...`) so the segment never clashes with
 * Next.js `page.tsx` in the same folder.
 */
export const ADMIN_PAGE_NAV = [
  {
    href: "/editor/home",
    label: "Home",
    publicPath: "/",
    hint: "Hero, floating car, before/after",
  },
  {
    href: "/editor/services",
    label: "Services",
    publicPath: "/services",
    hint: "Page settings (expand later)",
  },
  {
    href: "/editor/pricing",
    label: "Pricing",
    publicPath: "/pricing",
    hint: "Page settings (expand later)",
  },
  {
    href: "/editor/portfolio",
    label: "Portfolio",
    publicPath: "/portfolio",
    hint: "Page settings (expand later)",
  },
  {
    href: "/editor/about",
    label: "About Us",
    publicPath: "/about",
    hint: "Page settings (expand later)",
  },
  {
    href: "/editor/contact",
    label: "Contact Us",
    publicPath: "/contact",
    hint: "Page settings (expand later)",
  },
  {
    href: "/editor/free-trial",
    label: "Free Trial",
    publicPath: "/free-trial",
    hint: "Page settings (expand later)",
  },
] as const;
