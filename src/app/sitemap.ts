import {siteUrl} from "@/shared/constants"
import {MetadataRoute} from "next"
import {subjects} from "./[subject]/constants"
import {loadArticles} from "./[subject]/functions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleRoutes: MetadataRoute.Sitemap = []
  for (const subject of subjects) {
    const articles = await loadArticles(subject)
    for (const {slug} of articles) {
      const route = {
        changeFrequency: "weekly",
        lastModified: new Date(),
        priority: 0.5,
        url: `${siteUrl}/${subject}/${slug}`,
      } as const
      articleRoutes.push(route)
    }
  }
  return [
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 1,
      url: siteUrl,
    },
    ...subjects.map(
      subject =>
        ({
          changeFrequency: "monthly",
          lastModified: new Date(),
          priority: 0.8,
          url: `${siteUrl}/${subject}`,
        }) as const,
    ),
    ...articleRoutes,
  ]
}
