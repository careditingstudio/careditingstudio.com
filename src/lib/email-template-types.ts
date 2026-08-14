export type EmailBlockType =
  | "header"
  | "banner"
  | "headline"
  | "bodyText"
  | "services"
  | "photoGrid"
  | "cta"
  | "signature"
  | "social"
  | "footer";

export const DEFAULT_BLOCK_ORDER: EmailBlockType[] = [
  "header",
  "banner",
  "headline",
  "bodyText",
  "services",
  "photoGrid",
  "cta",
  "signature",
  "social",
  "footer",
];

export const EMAIL_BLOCK_LABELS: Record<EmailBlockType, string> = {
  header: "Brand Logo & Header",
  banner: "Top Hero Banner Image",
  headline: "Greeting & Main Headline",
  bodyText: "Message Paragraph Content",
  services: "Featured Services List / Badges",
  photoGrid: "Photo Showcase / Before-After Grid",
  cta: "Call To Action (CTA) Button",
  signature: "Executive Sender Signature Block",
  social: "Social Media Icons Strip",
  footer: "Office Address & Legal Footer",
};

export type SenderSignature = {
  show: boolean;
  name: string;
  role: string;
  avatarUrl: string;
  phone: string;
  email: string;
  website: string;
  address: string;
};

export type EmailDraft = {
  id: string;
  title: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  blockOrder: EmailBlockType[];
  bannerUrl: string;
  headline: string;
  bodyText: string;
  showServices: boolean;
  servicesList: string[];
  showPhotoGrid: boolean;
  photoUrls: string[];
  ctaText: string;
  ctaUrl: string;
  showSignature: boolean;
  signature: SenderSignature;
  showSocialLinks: boolean;
  showContactFooter: boolean;
  footerAddress: string;
  updatedAt: string;
};

export type EmailTemplatePreset = {
  id: string;
  name: string;
  description: string;
  subject: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  ctaUrl: string;
  bannerUrl?: string;
  photoUrls?: string[];
  servicesList?: string[];
};

export const PRESET_TEMPLATES: EmailTemplatePreset[] = [
  {
    id: "free-trial-completed",
    name: "Free Trial Results / Showcase",
    description: "Send processed free trial car photos to prospective clients with portfolio preview.",
    subject: "Your Free Trial Car Photo Retouching is Ready! - Car Editing Studio",
    headline: "Your Sample Car Photos Have Been Retouched!",
    bodyText:
      "Hello {{name}},\n\nThank you for choosing Car Editing Studio for your automotive photo retouching!\n\nOur team of expert vehicle photo editors has processed your sample car photos. We've removed background clutter, balanced lighting, corrected reflection glare, and enhanced vehicle paint gloss to retail-ready standards.\n\nTake a look at your retouched photos below or click the link to download the high-resolution files.",
    ctaText: "Download High-Res Retouched Photos",
    ctaUrl: "https://careditingstudio.com/portfolio",
    servicesList: [
      "Car Background Removal",
      "Shadow & Reflection Creation",
      "Color Correction & Paint Polish",
      "Window Tinting & License Plate",
    ],
  },
  {
    id: "custom-quotation",
    name: "Custom Quotation & Pricing Proposal",
    description: "Formal quote for volume dealerships, car auctions, and automotive marketplaces.",
    subject: "Custom Editing Quotation for Your Vehicle Inventory - Car Editing Studio",
    headline: "Tailored Retouching Quotation & Turnaround Details",
    bodyText:
      "Hello {{name}},\n\nThank you for reaching out to us regarding vehicle photo editing for your inventory.\n\nBased on your volume and requirements, we are pleased to offer custom bulk pricing for your team. Our 24/7 dedicated studio team guarantees 12-to-24 hour turnaround with 100% quality guarantee.\n\nKey Service Details:\n• Background removal & replacement (studio floor / custom dealership backdrop)\n• Drop shadow & reflection creation\n• Windows tint & plate replacement\n• Paint polish & scratch cleanup",
    ctaText: "Approve Quotation & Start Project",
    ctaUrl: "https://careditingstudio.com/contact",
    servicesList: [
      "Bulk Vehicle Editing",
      "Custom Dealership Backdrops",
      "24/7 Priority Studio Support",
    ],
  },
  {
    id: "inquiry-reply",
    name: "General Inquiry / Consultation Reply",
    description: "Professional quick response for general client contact inquiries.",
    subject: "Thank You for Contacting Car Editing Studio",
    headline: "We'd Love to Help Elevate Your Car Photos",
    bodyText:
      "Hello {{name}},\n\nWe received your inquiry regarding automotive photo editing services.\n\nWhether you need standard background cleanup, high-end showroom retouching, or automated batch processing for your online vehicle listings, our team is ready to deliver flawless results.\n\nWould you like to schedule a quick 10-minute consultation or try a free sample edit?",
    ctaText: "Schedule a Quick Meeting",
    ctaUrl: "https://careditingstudio.com/schedule-meeting",
    servicesList: [
      "Car Photo Editing",
      "Automotive Retouching",
      "Dealership Inventory Management",
    ],
  },
  {
    id: "seasonal-promo",
    name: "Portfolio Update & Promotional Offer",
    description: "Re-engage existing clients with new portfolio showcases and bulk discounts.",
    subject: "Upgrade Your Dealership Listings with Studio Retouching",
    headline: "Boost Online Car Sales with Retail-Ready Imagery",
    bodyText:
      "Hello {{name}},\n\nDid you know that listings with professional studio-background car photos receive up to 40% higher buyer engagement online?\n\nCar Editing Studio helps dealerships and automotive platforms convert leads faster with high-impact visual retouching. Check out our latest portfolio work and special bulk volume discounts available this month.",
    ctaText: "Explore Portfolio & Packages",
    ctaUrl: "https://careditingstudio.com/pricing",
    servicesList: [
      "Showroom Floor Backgrounds",
      "HD Glare & Dirt Removal",
      "Multi-Angle Vehicle Batch Editing",
    ],
  },
];

export function makeDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createDefaultDraft(): EmailDraft {
  const preset = PRESET_TEMPLATES[0]!;
  return {
    id: makeDraftId(),
    title: "Untitled Draft",
    recipientEmail: "",
    recipientName: "Valued Client",
    subject: preset.subject,
    blockOrder: [...DEFAULT_BLOCK_ORDER],
    bannerUrl: "",
    headline: preset.headline,
    bodyText: preset.bodyText,
    showServices: true,
    servicesList: preset.servicesList ? [...preset.servicesList] : [
      "Car Background Removal",
      "Reflection Creation",
      "Paint Polish",
    ],
    showPhotoGrid: true,
    photoUrls: [],
    ctaText: preset.ctaText,
    ctaUrl: preset.ctaUrl,
    showSignature: true,
    signature: {
      show: true,
      name: "Jakaria Khondokar",
      role: "CEO & Co-Founder, Car Editing Studio",
      avatarUrl: "https://careditingstudio.com/logo.png",
      phone: "+8801730848933",
      email: "info@careditingstudio.com",
      website: "https://careditingstudio.com",
      address: "Talgachi, Dhaka, Bangladesh",
    },
    showSocialLinks: true,
    showContactFooter: true,
    footerAddress: "Talgachi, Dhaka, Bangladesh",
    updatedAt: new Date().toISOString(),
  };
}
