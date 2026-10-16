/** Team inbox for leads and vendor registrations. Override with INQUIRY_NOTIFY_EMAIL. */
export function getTeamInboxEmail(): string {
  return process.env.INQUIRY_NOTIFY_EMAIL ?? "info@bizhkex.com";
}

export const SITE_PHONE = "+852 3565 3138";
