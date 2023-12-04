import {siteUrl} from "@/shared/constants"
import {MetadataRoute} from "next"
import {subjects} from "./[subject]/constants"
import {loadArticles} from "./[subject]/functions"

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
