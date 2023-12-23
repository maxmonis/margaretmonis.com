import {siteUrl} from "@/constants"
import {MetadataRoute} from "next"

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/private/",
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
