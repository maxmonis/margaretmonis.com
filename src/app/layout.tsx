import {TextLink} from "@/components/TextLink"
import type {Metadata} from "next"
import {Montserrat} from "next/font/google"
import "./globals.css"

const font = Montserrat({subsets: ["latin"], weight: ["400", "700"]})

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
  keywords: ["Margaret Monis", "Margaret Monis Blog"],
  publisher: "Vercel",
  referrer: "origin-when-cross-origin",
  title: {
    default: "Margaret Monis",
    template: "%s | Margaret Monis",
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${font.className} flex min-h-screen w-screen flex-col justify-between gap-40 overflow-x-hidden bg-blue-50 text-blue-950`}
      >
        <div>
          <Header />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header
      className="mb-10 flex w-screen flex-col items-center justify-center p-6"
      id="top-of-page"
    >
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
  )
}

function Footer() {
  return (
    <footer className="flex w-screen flex-col items-center justify-center px-4 pb-4 text-center text-xs">
      <p>Copyright © 2019-{new Date().getFullYear()} | Margaret Monis</p>
    </footer>
  )
}
