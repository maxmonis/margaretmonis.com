import {siteUrl, subjects} from "@/shared/constants"
import {loadArticles} from "@/shared/functions"
import {MetadataRoute} from "next"

export default async function Sitemap() {
  const lastModified = new Date()
  const sitemap: MetadataRoute.Sitemap = [
    {
      changeFrequency: "yearly",
      lastModified,
      priority: 1,
      url: siteUrl,
    },
  ]
  for (const subject of subjects) {
    sitemap.push({
      changeFrequency: "monthly",
      lastModified,
      priority: 0.8,
      url: `${siteUrl}/${subject}`,
    })
    const articles = await loadArticles(subject)
    for (const {slug} of articles) {
      sitemap.push({
        changeFrequency: "weekly",
        lastModified,
        priority: 0.5,
        url: `${siteUrl}/${subject}/${slug}`,
      })
    }
  }
  return sitemap
}
