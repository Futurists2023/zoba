export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    const normalizedUrl = siteUrl.replace(/\/+$/, "");

    try {
      return new URL(normalizedUrl).toString().replace(/\/+$/, "");
    } catch {
      return normalizedUrl;
    }
  }

  return "http://localhost:3000";
}
