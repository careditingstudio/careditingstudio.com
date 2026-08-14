export type EmailDraft = {
  id: string;
  title: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bannerUrl: string;
  headline: string;
  bodyText: string;
  showPhotoGrid: boolean;
  photoUrls: string[];
  ctaText: string;
  ctaUrl: string;
  showSocialLinks: boolean;
  showContactFooter: boolean;
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
    bannerUrl: "",
    headline: preset.headline,
    bodyText: preset.bodyText,
    showPhotoGrid: true,
    photoUrls: [],
    ctaText: preset.ctaText,
    ctaUrl: preset.ctaUrl,
    showSocialLinks: true,
    showContactFooter: true,
    updatedAt: new Date().toISOString(),
  };
}
