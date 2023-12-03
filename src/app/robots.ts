import {siteUrl} from "@/shared/constants"
import {MetadataRoute} from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/private/",
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
