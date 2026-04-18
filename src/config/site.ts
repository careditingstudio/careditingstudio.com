/** Edit these for your live contact details. */
export const siteConfig = {
  name: "Car Editing Studio",
  domain: "careditingstudio.com",
  email: "info@careditingstudio.com",
  /** Digits only (country code, no +), for https://wa.me/… */
  whatsappDial: "1234567890123",
  /** Shown in the announcement bar */
  whatsappDisplay: "+1 (234) 567-8901",
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About Us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/free-trial", label: "Free Trial" },
] as const;
