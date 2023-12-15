import {loadAllSlugs, loadSubjectArticleCount} from "@/datocms/queries"
import {siteUrl, subjects} from "@/shared/constants"
import {MetadataRoute} from "next"

export default async function Sitemap() {
  const lastModified = new Date()
  const sitemap: MetadataRoute.Sitemap = [
    {
      changeFrequency: "weekly",
      lastModified,
      priority: 1,
      url: siteUrl,
    },
  ]
  for (const subject of subjects) {
    const count = await loadSubjectArticleCount(subject)
    let page = 0
    while (page * 12 < count) {
      page++
      sitemap.push({
        changeFrequency: "weekly",
        lastModified,
        priority: 0.8,
        url: `${siteUrl}/${subject}/${page}`,
      })
    }
  }
  const slugs = await loadAllSlugs()
  for (const slug of slugs) {
    sitemap.push({
      changeFrequency: "monthly",
      lastModified,
      priority: 0.5,
      url: `${siteUrl}/posts/${slug}`,
    })
  }
  return sitemap
}
