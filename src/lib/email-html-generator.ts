import type { SiteSettings } from "@/lib/cms-types";
import type { EmailBlockType, EmailDraft } from "@/lib/email-template-types";
import { getSocialBrandColor, getSocialSvgIcon } from "@/lib/email-social-icons";
import { socialPlatformTitle } from "@/lib/social-platforms";

function resolveAbsoluteUrl(url: string, defaultDomain = "https://careditingstudio.com"): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return `${defaultDomain}${trimmed}`;
  return `https://${trimmed}`;
}

export function generateEmailHtml(draft: EmailDraft, site?: SiteSettings): string {
  const domain = site?.domainLabel ? `https://${site.domainLabel}` : "https://careditingstudio.com";
  const businessName = site?.businessName || "Car Editing Studio";
  const logoUrl = `${domain}/logo.png`;

  const recipientName = draft.recipientName.trim() || "Valued Client";
  const bodyTextFormatted = draft.bodyText
    .replace(/\{\{name\}\}/g, recipientName)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${p}</p>`)
    .join("");

  const bannerUrl = draft.bannerUrl ? resolveAbsoluteUrl(draft.bannerUrl, domain) : "";
  const photoUrls = (draft.photoUrls || [])
    .map((u) => resolveAbsoluteUrl(u, domain))
    .filter(Boolean);

  const ctaUrl = draft.ctaUrl ? resolveAbsoluteUrl(draft.ctaUrl, domain) : domain;
  const ctaText = draft.ctaText.trim() || "Visit Website";

  // Block Order System
  const blockOrder = draft.blockOrder || [
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

  // Helper to render individual blocks
  const renderBlock = (blockType: EmailBlockType): string => {
    switch (blockType) {
      case "header":
        return `
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 36px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <a href="${domain}" target="_blank" style="text-decoration: none;">
                      <img src="${logoUrl}" alt="${businessName}" height="40" style="height: 40px; width: auto; border: 0; display: block;" />
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="font-size: 13px; font-weight: 700; color: #e07a45; letter-spacing: 0.05em; text-transform: uppercase;">${site?.domainLabel || "careditingstudio.com"}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;

      case "banner":
        if (!bannerUrl) return "";
        return `
          <!-- Banner Image -->
          <tr>
            <td style="padding: 0;">
              <img src="${bannerUrl}" alt="Banner" style="width: 100%; max-height: 320px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>
        `;

      case "headline":
        if (!draft.headline) return "";
        return `
          <!-- Headline -->
          <tr>
            <td style="padding: 32px 36px 12px 36px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.02em;">${draft.headline}</h1>
            </td>
          </tr>
        `;

      case "bodyText":
        if (!bodyTextFormatted) return "";
        return `
          <!-- Body Text -->
          <tr>
            <td style="padding: 12px 36px 20px 36px;">
              ${bodyTextFormatted}
            </td>
          </tr>
        `;

      case "services":
        if (!draft.showServices || !draft.servicesList || draft.servicesList.length === 0) return "";
        const servicePills = draft.servicesList
          .map(
            (s) => `
              <div style="display: inline-block; margin: 4px; padding: 8px 16px; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 20px; color: #1e293b; font-size: 13px; font-weight: 600;">
                ✓ ${s}
              </div>
            `,
          )
          .join("");
        return `
          <!-- Services List -->
          <tr>
            <td style="padding: 12px 36px 24px 36px;">
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; uppercase; letter-spacing: 0.1em; color: #64748b;">Specialized Automotive Services</p>
              <div style="text-align: left;">${servicePills}</div>
            </td>
          </tr>
        `;

      case "photoGrid":
        if (!draft.showPhotoGrid || photoUrls.length === 0) return "";
        const photosContent = photoUrls
          .map(
            (url, idx) => `
              <div style="margin-bottom: 16px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #f8fafc;">
                <img src="${url}" alt="Showcase Image ${idx + 1}" style="width: 100%; height: auto; display: block; border: 0;" />
              </div>
            `,
          )
          .join("");
        return `
          <!-- Photo Showcase -->
          <tr>
            <td style="padding: 12px 36px 24px 36px;">
              ${photosContent}
            </td>
          </tr>
        `;

      case "cta":
        if (!ctaText) return "";
        return `
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 16px 36px 32px 36px;">
              <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #e07a45; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 14px; box-shadow: 0 10px 25px rgba(224, 122, 69, 0.35);">
                ${ctaText}
              </a>
            </td>
          </tr>
        `;

      case "signature":
        if (!draft.showSignature || !draft.signature || !draft.signature.show) return "";
        const sig = draft.signature;
        const sigName = sig.name.trim() || "Jakaria Khondokar";
        const sigRole = sig.role.trim() || "CEO & Co-Founder, Car Editing Studio";
        const sigPhone = sig.phone.trim() || "+8801730848933";
        const sigEmail = sig.email.trim() || "info@careditingstudio.com";
        const sigWebsite = sig.website.trim() || "https://careditingstudio.com";
        const sigAddress = sig.address.trim() || "Talgachi, Dhaka, Bangladesh";
        const sigAvatar = sig.avatarUrl.trim() || logoUrl;

        // Build signature social icons pills (Facebook, LinkedIn, WhatsApp, etc.)
        let sigSocialPills = "";
        if (site?.socialLinks && site.socialLinks.length > 0) {
          sigSocialPills = site.socialLinks
            .filter((s) => s.url && s.url.trim())
            .map((s) => {
              const bg = getSocialBrandColor(s.platform);
              const svg = getSocialSvgIcon(s.platform, 16);
              const url = resolveAbsoluteUrl(s.url, domain);
              return `
                <a href="${url}" target="_blank" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; border-radius: 50%; background-color: ${bg}; text-align: center; margin-right: 8px; vertical-align: middle; text-decoration: none;">
                  ${svg}
                </a>
              `;
            })
            .join("");
        }

        // WhatsApp direct pill
        if (!sigSocialPills.includes("whatsapp") && sigPhone) {
          const digits = sigPhone.replace(/\D/g, "");
          const waBg = getSocialBrandColor("whatsapp");
          const waSvg = getSocialSvgIcon("whatsapp", 16);
          sigSocialPills += `
            <a href="https://wa.me/${digits}" target="_blank" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; border-radius: 50%; background-color: ${waBg}; text-align: center; margin-right: 8px; vertical-align: middle; text-decoration: none;">
              ${waSvg}
            </a>
          `;
        }

        return `
          <!-- Executive Sender Signature Block -->
          <tr>
            <td style="padding: 24px 36px 32px 36px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Left Avatar Column -->
                  <td width="100" align="left" style="vertical-align: top; padding-right: 20px;">
                    <img src="${sigAvatar}" alt="${sigName}" width="84" height="84" style="width: 84px; height: 84px; border-radius: 16px; object-fit: contain; border: 1px solid #cbd5e1; display: block;" />
                  </td>

                  <!-- Right Details Column -->
                  <td align="left" style="vertical-align: top;">
                    <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 800; color: #0f172a;">${sigName}</h3>
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 500; color: #475569;">${sigRole}</p>
                    
                    <div style="height: 2px; background-color: #0f172a; width: 100%; margin-bottom: 12px;"></div>

                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #334155; line-height: 1.8;">
                      ${
                        sigWebsite
                          ? `<tr>
                              <td style="padding-right: 8px; color: #64748b;">🌐</td>
                              <td><a href="${resolveAbsoluteUrl(sigWebsite, domain)}" target="_blank" style="color: #0f172a; text-decoration: underline; font-weight: 500;">${sigWebsite.replace(/^https?:\/\//, "")}</a></td>
                            </tr>`
                          : ""
                      }
                      ${
                        sigPhone
                          ? `<tr>
                              <td style="padding-right: 8px; color: #64748b;">📞</td>
                              <td><a href="tel:${sigPhone.replace(/\s+/g, "")}" style="color: #0f172a; text-decoration: none; font-weight: 500;">${sigPhone}</a></td>
                            </tr>`
                          : ""
                      }
                      ${
                        sigEmail
                          ? `<tr>
                              <td style="padding-right: 8px; color: #64748b;">✉️</td>
                              <td><a href="mailto:${sigEmail}" style="color: #0f172a; text-decoration: none; font-weight: 500;">${sigEmail}</a></td>
                            </tr>`
                          : ""
                      }
                      ${
                        sigAddress
                          ? `<tr>
                              <td style="padding-right: 8px; color: #64748b;">📍</td>
                              <td style="color: #475569; font-weight: 500;">${sigAddress}</td>
                            </tr>`
                          : ""
                      }
                    </table>

                    ${
                      sigSocialPills
                        ? `<div style="margin-top: 14px;">${sigSocialPills}</div>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;

      case "social":
        if (!draft.showSocialLinks || !site?.socialLinks || site.socialLinks.length === 0) return "";
        const socialBadges = site.socialLinks
          .filter((s) => s.url && s.url.trim())
          .map((s) => {
            const bg = getSocialBrandColor(s.platform);
            const svg = getSocialSvgIcon(s.platform, 18);
            const title = socialPlatformTitle(s.platform);
            const url = resolveAbsoluteUrl(s.url, domain);
            return `
              <a href="${url}" target="_blank" title="${title}" style="display: inline-block; width: 36px; height: 36px; line-height: 36px; border-radius: 50%; background-color: ${bg}; text-align: center; margin: 0 5px; vertical-align: middle; text-decoration: none;">
                ${svg}
              </a>
            `;
          })
          .join("");

        if (!socialBadges) return "";
        return `
          <!-- Standalone Social Icons Strip -->
          <tr>
            <td align="center" style="padding: 24px 36px 12px 36px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700;">Connect With Car Editing Studio</p>
              <div>${socialBadges}</div>
            </td>
          </tr>
        `;

      case "footer":
        if (!draft.showContactFooter) return "";
        const footerAddr = draft.footerAddress || site?.officeLocations?.[0]?.address || "Talgachi, Dhaka, Bangladesh";
        const email = site?.email || "info@careditingstudio.com";
        const phone = site?.whatsappDisplay || site?.whatsappDial || "";
        return `
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 36px 32px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 13px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e293b;">${businessName}</p>
              <p style="margin: 0 0 6px 0;">${footerAddr}</p>
              <p style="margin: 0 0 12px 0;">
                Email: <a href="mailto:${email}" style="color: #e07a45; text-decoration: none; font-weight: 600;">${email}</a>
                ${phone ? ` &nbsp;·&nbsp; WhatsApp: <span style="color: #334155; font-weight: 600;">${phone}</span>` : ""}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                © ${new Date().getFullYear()} ${businessName}. All rights reserved.
              </p>
            </td>
          </tr>
        `;

      default:
        return "";
    }
  };

  const compiledBlocksHtml = blockOrder.map(renderBlock).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${draft.subject || "Car Editing Studio"}</title>
</head>
<body style="margin: 0; padding: 0; background-color: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: transparent; width: 100%; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <!-- Email Container Card (Wider 680px Layout) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 680px; width: 100%; background-color: #ffffff; border-radius: 20px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.08);">
          ${compiledBlocksHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
