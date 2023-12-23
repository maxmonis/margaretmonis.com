export const articlePreview = `{
  blurb
  date
  image {
    alt
    url(imgixParams: {fit: crop, h: 200, w: 200})
  }
  slug
  subject
  title
}` as const
