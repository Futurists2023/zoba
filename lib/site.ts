export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    const normalizedUrl = siteUrl.replace(/\/+$/, "");

    try {
      const url = new URL(normalizedUrl);

      if (url.hostname === "zoba.co.za") {
        url.hostname = "www.zoba.co.za";
      }

      return url.toString().replace(/\/+$/, "");
    } catch {
      return normalizedUrl;
    }
  }

  return "http://localhost:3000";
}
