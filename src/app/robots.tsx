import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/*?is_edit=true"],
    },
    sitemap: "https://mtiyt.ru/sitemap.xml",
  }
}
