import {TextLink} from "@/components/links"
import {AuthContextProvider} from "@/context/AuthContext"
import {siteUrl, subjects} from "@/shared/constants"
import {getSubjectText} from "@/shared/functions"
import type {Metadata} from "next"
import {Montserrat} from "next/font/google"
import "./globals.css"

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html className="scroll-smooth" lang="en">
      <body
        className={`${font.className} flex min-h-screen w-screen flex-col justify-between gap-40 overflow-x-hidden bg-blue-50 text-blue-950`}
      >
        <AuthContextProvider>
          <div id="top-of-page">
            <header className="mb-10 flex w-screen flex-col items-center justify-center p-6">
              <div className="flex w-full max-w-screen-2xl items-center justify-between">
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
  authors: [{name: "Max Monis", url: "https://maxmonis.com"}],
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
  openGraph: {
    images: ["/travel.jpg"],
  },
  publisher: "Vercel",
  referrer: "origin-when-cross-origin",
  title: {
    default: "Margaret Monis",
    template: "%s | Margaret Monis",
  },
}

const font = Montserrat({subsets: ["latin"], weight: ["400", "700"]})
