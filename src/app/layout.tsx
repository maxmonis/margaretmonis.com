import TextLink from "@/components/links/TextLink"
import {siteUrl, subjects} from "@/constants"
import {AuthContextProvider} from "@/context/AuthContext"
import {montserrat} from "@/styles/fonts"
import "@/styles/globals.css"
import {getSubjectText} from "@/utils/parsers"
import {Metadata} from "next"

export default function RootLayout({children}: React.PropsWithChildren) {
  return (
    <html className="scroll-smooth 2xl:[font-size:18px]" lang="en">
      <body
        className={`${montserrat.className} flex min-h-screen w-screen flex-col justify-between gap-20 overflow-x-hidden bg-blue-50 text-blue-950`}
      >
        <AuthContextProvider>
          <div id="top-of-page">
            <header className="mb-4 flex w-screen flex-col items-center justify-center p-6">
              <div className="flex w-full items-center justify-between">
                <TextLink href="/" text="Home" variant="underlined" />
                <TextLink
                  href="mailto:monismargaret@gmail.com"
                  text="Contact"
                  variant="filled"
                />
              </div>
              <span className="flex items-center">
                <TextLink
                  className="mt-8 text-center text-xl font-bold uppercase sm:-mt-7"
                  href="/"
                  text="Margaret Monis"
                />
              </span>
            </header>
            {children}
          </div>
          <footer className="flex w-screen justify-center p-4 text-center text-xs">
            <p>Copyright © 2020-{new Date().getFullYear()} | Margaret Monis</p>
          </footer>
        </AuthContextProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  applicationName: "Margaret Monis",
  authors: {name: "Margaret Monis"},
  creator: "Max Monis",
  description: "Margaret Monis's blog",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  generator: "Next.js",
  keywords: [
    "Margaret Monis",
    "Blog",
    "Margaret Monis Blog",
    "Margaret's Musings",
    "Random Samplings",
    ...subjects.map(getSubjectText),
  ],
  metadataBase: new URL(siteUrl),
  publisher: "Vercel",
  referrer: "origin-when-cross-origin",
  title: {
    default: "Margaret Monis",
    template: "%s | Margaret Monis",
  },
}
