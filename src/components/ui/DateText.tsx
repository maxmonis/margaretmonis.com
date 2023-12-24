"use client"
import getDateText from "@/functions/getDateText"

export default function DateText(props: Parameters<typeof getDateText>[0]) {
  return <>{getDateText(props)}</>
}
