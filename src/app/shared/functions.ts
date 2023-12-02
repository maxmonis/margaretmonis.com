export function capitalize(text: string) {
  return text ? text[0].toUpperCase() + text.slice(1).toLowerCase() : ""
}

export async function makeDatoRequest<T>({
  includeDrafts = false,
  query,
  variables = {},
}: {
  includeDrafts?: boolean
  query: string
  variables?: object
}) {
  const response = await fetch("https://graphql.datocms.com/", {
    body: JSON.stringify({query, variables}),
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
      ...(includeDrafts ? {"X-Include-Drafts": "true"} : {}),
    },
    method: "POST",
    next: {
      revalidate: 3600,
    },
  })
  const responseBody = await response.json()
  if (!response.ok) {
    throw Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(
        responseBody,
      )}`,
    )
  }
  return Object.values(responseBody.data)[0] as T
}
