import { invokeLLM } from "./llm";

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

/**
 * Send email notification using Manus built-in email service
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Use the Manus notification system to send emails
    const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.htmlContent,
        text: options.textContent || stripHtml(options.htmlContent),
      }),
    });

    if (!response.ok) {
      console.error(`Email send failed: ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email service error:", error);
    return false;
  }
}

/**
 * Send new inquiry notification email to provider
 */
export async function sendNewInquiryEmail(
  providerEmail: string,
  providerName: string,
  officeName: string,
  inquirerName: string,
  inquirerEmail: string,
  message: string,
  dashboardUrl: string
): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Inquiry Received!</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Hi ${providerName},</p>
        
        <p>You have received a new inquiry for your office listing:</p>
        
        <div style="background-color: white; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111827;">${officeName}</h3>
          <p><strong>From:</strong> ${inquirerName}</p>
          <p><strong>Email:</strong> ${inquirerEmail}</p>
          <p><strong>Message:</strong></p>
          <p style="color: #6b7280;">${message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          You can manage your notification preferences in your provider dashboard settings.
        </p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>© 2026 ServicED. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: providerEmail,
    subject: `New Inquiry for ${officeName} - ServicED`,
    htmlContent,
  });
}

/**
 * Send inquiry status update email
 */
export async function sendInquiryStatusUpdateEmail(
  inquirerEmail: string,
  inquirerName: string,
  officeName: string,
  status: string,
  providerMessage?: string
): Promise<boolean> {
  const statusLabels: Record<string, string> = {
    contacted: "We've been contacted",
    resolved: "Your inquiry has been resolved",
    archived: "Your inquiry has been archived",
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Inquiry Update</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Hi ${inquirerName},</p>
        
        <p>We have an update on your inquiry for <strong>${officeName}</strong>:</p>
        
        <div style="background-color: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111827;">${statusLabels[status] || status}</h3>
          ${providerMessage ? `<p style="color: #6b7280;">${providerMessage}</p>` : ""}
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for your interest in our office spaces!
        </p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>© 2026 ServicED. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: inquirerEmail,
    subject: `Update on Your Inquiry - ServicED`,
    htmlContent,
  });
}

function emailShell(title: string, body: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">${title}</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; color: #111827;">${body}</div>
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>© ${new Date().getFullYear()} BizHKEx</p>
      </div>
    </div>
  `;
}

export async function sendBusinessInquiryToTeam(input: {
  referenceId: string;
  listingId: number;
  listingTitle: string;
  listingCode?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  teamEmail: string;
}): Promise<boolean> {
  const body = `
    <p><strong>New business transfer inquiry</strong></p>
    <p style="color:#6b7280;font-size:13px;">Ref: ${input.referenceId}</p>
    <div style="background:white;padding:15px;border-left:4px solid #059669;margin:16px 0;">
      <p><strong>Listing:</strong> ${input.listingTitle}</p>
      <p><strong>Code:</strong> ${input.listingCode ?? `BIZ-${input.listingId}`}</p>
      <p><strong>Name:</strong> ${input.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${input.email}">${input.email}</a></p>
      <p><strong>Phone:</strong> ${input.phone}</p>
      <p><strong>Message:</strong></p>
      <p style="color:#4b5563;white-space:pre-wrap;">${input.message}</p>
    </div>
  `;
  return sendEmail({
    to: input.teamEmail,
    subject: `[BizHKEx] Business inquiry — ${input.listingCode ?? input.listingTitle}`,
    htmlContent: emailShell("New business inquiry", body),
  });
}

export async function sendBusinessInquiryConfirmation(input: {
  name: string;
  email: string;
  listingTitle: string;
  referenceId: string;
}): Promise<boolean> {
  const body = `
    <p>Hi ${input.name},</p>
    <p>Thank you for your interest in <strong>${input.listingTitle}</strong>.</p>
    <p>We received your inquiry (<span style="font-family:monospace;">${input.referenceId}</span>) and will contact you within 1–2 business days with the financial pack and next steps.</p>
    <p style="color:#6b7280;font-size:14px;">For urgent questions, WhatsApp us at +852 3565 3138.</p>
  `;
  return sendEmail({
    to: input.email,
    subject: `BizHKEx — We received your inquiry`,
    htmlContent: emailShell("Inquiry received", body),
  });
}

export async function sendVendorRegistrationConfirmation(input: {
  contactName: string;
  email: string;
  name: string;
  referenceId: string;
  locale: "en" | "zh";
}): Promise<boolean> {
  const isZh = input.locale === "zh";
  const body = isZh
    ? `
    <p>Hi ${input.contactName}，</p>
    <p>多謝你透過 BizHKEx 提交<strong>${input.name}</strong>嘅登記申請。</p>
    <p>參考編號：<span style="font-family:monospace;">${input.referenceId}</span></p>
    <p>你的申請已進入審核隊列，<strong>尚未上架</strong>，亦未有公開盤源。團隊覆核後先會聯絡你。成功配對佣金為 5–10%。審核通過前未能登入後台。</p>
    <p style="color:#6b7280;font-size:14px;">如有查詢，WhatsApp +852 3565 3138。</p>
  `
    : `
    <p>Hi ${input.contactName},</p>
    <p>Thank you for registering <strong>${input.name}</strong> on BizHKEx.</p>
    <p>Reference: <span style="font-family:monospace;">${input.referenceId}</span></p>
    <p>Your application is in the review queue and is <strong>not published</strong>. Nothing from this draft is live on BizHKEx. We will contact you after review. Success commission is 5–10%. Dashboard login opens only after approval.</p>
    <p style="color:#6b7280;font-size:14px;">Questions? WhatsApp +852 3565 3138.</p>
  `;
  return sendEmail({
    to: input.email,
    subject: isZh
      ? `BizHKEx — 已收到你嘅業主登記（${input.referenceId}）`
      : `BizHKEx — Registration received (${input.referenceId})`,
    htmlContent: emailShell(isZh ? "登記已收到" : "Registration received", body),
  });
}

export async function sendProviderLoginLink(input: {
  email: string;
  name: string;
  loginUrl: string;
}): Promise<boolean> {
  const body = `
    <p>Hi ${input.name},</p>
    <p>Click the button below to sign in to your BizHKEx vendor dashboard. This link expires in 1 hour.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${input.loginUrl}" style="background-color:#059669;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
        Sign in to dashboard
      </a>
    </div>
    <p style="color:#6b7280;font-size:13px;word-break:break-all;">Or copy this link: ${input.loginUrl}</p>
  `;
  return sendEmail({
    to: input.email,
    subject: "BizHKEx — Your vendor dashboard login link",
    htmlContent: emailShell("Vendor dashboard login", body),
  });
}

export async function sendVendorRegistrationToTeam(input: {
  referenceId: string;
  type: "office" | "business";
  contactName: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  industry?: string;
  summary: string;
  photoUrls: string[];
  teamEmail: string;
}): Promise<boolean> {
  const photos =
    input.photoUrls.length > 0
      ? `<p><strong>Photos:</strong></p><ul>${input.photoUrls.map((u) => `<li><a href="${u}">${u}</a></li>`).join("")}</ul>`
      : "<p><em>No photos uploaded</em></p>";
  const body = `
    <p><strong>Vendor intake (${input.type}) — pending review, not published</strong></p>
    <p style="color:#6b7280;font-size:13px;">Ref: ${input.referenceId}. Approve by setting vendorRegistrations.status to approved before any public listing is created.</p>
    <div style="background:white;padding:15px;border-left:4px solid #059669;margin:16px 0;">
      <p><strong>Business:</strong> ${input.name}</p>
      <p><strong>Contact:</strong> ${input.contactName}</p>
      <p><strong>Email:</strong> ${input.email}</p>
      <p><strong>Phone:</strong> ${input.phone}</p>
      <p><strong>District:</strong> ${input.district}</p>
      ${input.industry ? `<p><strong>Industry:</strong> ${input.industry}</p>` : ""}
      <p><strong>Summary:</strong></p>
      <p style="color:#4b5563;white-space:pre-wrap;">${input.summary}</p>
      ${photos}
    </div>
  `;
  return sendEmail({
    to: input.teamEmail,
    subject: `[BizHKEx] Vendor registration — ${input.name}`,
    htmlContent: emailShell("New vendor registration", body),
  });
}

/**
 * Strip HTML tags from content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}
