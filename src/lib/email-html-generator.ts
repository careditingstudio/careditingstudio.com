import type { SiteSettings } from "@/lib/cms-types";
import type { EmailDraft } from "@/lib/email-template-types";
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
  
  // Replace {{name}} placeholder if present
  const recipientName = draft.recipientName.trim() || "Valued Client";
  const bodyTextFormatted = draft.bodyText
    .replace(/\{\{name\}\}/g, recipientName)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #d4d4d8;">${p}</p>`)
    .join("");

  const bannerUrl = draft.bannerUrl ? resolveAbsoluteUrl(draft.bannerUrl, domain) : "";
  const photoUrls = (draft.photoUrls || [])
    .map((u) => resolveAbsoluteUrl(u, domain))
    .filter(Boolean);

  const ctaUrl = draft.ctaUrl ? resolveAbsoluteUrl(draft.ctaUrl, domain) : domain;
  const ctaText = draft.ctaText.trim() || "Visit Website";

  // Build social links HTML
  let socialLinksHtml = "";
  if (draft.showSocialLinks && site?.socialLinks && site.socialLinks.length > 0) {
    const itemsHtml = site.socialLinks
      .filter((s) => s.url && s.url.trim())
      .map((s) => {
        const title = socialPlatformTitle(s.platform);
        const url = resolveAbsoluteUrl(s.url, domain);
        return `
          <a href="${url}" target="_blank" style="display: inline-block; margin: 0 6px; padding: 6px 12px; border-radius: 20px; background-color: #27272a; color: #e4e4e7; font-size: 12px; font-weight: 500; text-decoration: none;">
            ${title}
          </a>
        `;
      })
      .join("");

    if (itemsHtml) {
      socialLinksHtml = `
        <tr>
          <td align="center" style="padding: 24px 30px 12px 30px; border-top: 1px solid #27272a;">
            <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; font-weight: 600;">Connect With Us</p>
            <div>${itemsHtml}</div>
          </td>
        </tr>
      `;
    }
  }

  // Build Photo Grid HTML
  let photoGridHtml = "";
  if (draft.showPhotoGrid && photoUrls.length > 0) {
    const photosContent = photoUrls
      .map(
        (url, idx) => `
          <div style="margin-bottom: 16px; border-radius: 12px; overflow: hidden; border: 1px solid #27272a; background-color: #09090b;">
            <img src="${url}" alt="Showcase Image ${idx + 1}" style="width: 100%; height: auto; display: block; border: 0;" />
          </div>
        `,
      )
      .join("");

    photoGridHtml = `
      <tr>
        <td style="padding: 10px 30px 20px 30px;">
          ${photosContent}
        </td>
      </tr>
    `;
  }

  // Build Contact Footer
  let footerHtml = "";
  if (draft.showContactFooter) {
    const email = site?.email || "info@careditingstudio.com";
    const phone = site?.whatsappDisplay || site?.whatsappDial || "";
    footerHtml = `
      <tr>
        <td align="center" style="padding: 20px 30px 30px 30px; color: #71717a; font-size: 12px; line-height: 1.6;">
          <p style="margin: 0 0 6px 0; font-weight: 500; color: #a1a1aa;">${businessName}</p>
          <p style="margin: 0 0 6px 0;">
            Email: <a href="mailto:${email}" style="color: #e07a45; text-decoration: none;">${email}</a>
            ${phone ? ` &nbsp;·&nbsp; Phone / WhatsApp: <span style="color: #d4d4d8;">${phone}</span>` : ""}
          </p>
          <p style="margin: 12px 0 0 0; font-size: 11px; color: #52525b;">
            © ${new Date().getFullYear()} ${businessName}. All rights reserved.
          </p>
        </td>
      </tr>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${draft.subject || "Car Editing Studio"}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #fafaf9; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; width: 100%; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <!-- Email Container Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141417; border-radius: 20px; border: 1px solid #27272a; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          
          <!-- Header Bar with Logo -->
          <tr>
            <td style="padding: 24px 30px; background-color: #0d0d10; border-bottom: 1px solid #27272a;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <a href="${domain}" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center;">
                      <img src="${logoUrl}" alt="${businessName}" height="38" style="height: 38px; width: auto; border: 0; display: block;" />
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="font-size: 13px; font-weight: 600; color: #e07a45; letter-spacing: 0.05em; text-transform: uppercase;">${site?.domainLabel || "careditingstudio.com"}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            bannerUrl
              ? `
          <!-- Optional Banner -->
          <tr>
            <td style="padding: 0;">
              <img src="${bannerUrl}" alt="Banner" style="width: 100%; max-height: 240px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>
          `
              : ""
          }

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 30px 20px 30px;">
              ${
                draft.headline
                  ? `<h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.01em;">${draft.headline}</h1>`
                  : ""
              }
              ${bodyTextFormatted}
            </td>
          </tr>

          ${photoGridHtml}

          <!-- CTA Button -->
          ${
            ctaText
              ? `
          <tr>
            <td align="center" style="padding: 10px 30px 32px 30px;">
              <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #e07a45; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px; box-shadow: 0 8px 24px rgba(224, 122, 69, 0.35);">
                ${ctaText}
              </a>
            </td>
          </tr>
          `
              : ""
          }

          ${socialLinksHtml}
          ${footerHtml}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
