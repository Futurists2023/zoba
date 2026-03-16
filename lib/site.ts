export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    return siteUrl.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}
