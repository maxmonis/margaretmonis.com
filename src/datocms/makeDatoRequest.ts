/**
 * Gets data from DatoCMS using a graphQL query
 */
export default async function makeDatoRequest<T>({
  /* unpublished items will only be displayed in development by default */
  includeDrafts = process.env.NODE_ENV === "development",
  query,
  variables = {},
}: {
  includeDrafts?: boolean
  query: string
  variables?: object
}): Promise<T> {
  const response = await fetch("https://graphql.datocms.com/", {
    body: JSON.stringify({query, variables}),
    headers: {
      Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
      ...(includeDrafts && {"X-Include-Drafts": "true"}),
    },
    method: "POST",
    next: {revalidate: 3600},
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(
        responseBody,
      )}`,
    )
  }
  return responseBody.data
}
