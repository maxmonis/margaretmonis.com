"use client"
import {getDateText} from "@/shared/functions"

export function DateText(props: Parameters<typeof getDateText>[0]) {
  return <>{getDateText(props)}</>
}
