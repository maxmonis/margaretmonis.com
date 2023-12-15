"use client"
import {getDateText} from "@/shared/functions"

export function DateText(...props: Parameters<typeof getDateText>) {
  return <>{getDateText(...props)}</>
}
