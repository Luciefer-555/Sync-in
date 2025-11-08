import type { Metadata } from "next"
import { Inter, Roboto, Nunito_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "./providers"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Configure the fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['sans-serif']
})

const nunitoSans = Nunito_Sans({ 
  subsets: ["latin"],
  variable: '--font-nunito-sans',
  display: 'swap',
  fallback: ['sans-serif']
})

export const metadata: Metadata = {
  title: {
    default: 'SyncIn | Student Platform',
    template: '%s | SyncIn'
  },
  description: 'Track your academic and technical growth with SyncIn',
  keywords: ['student', 'education', 'learning', 'academics', 'progress tracking'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syncin.vercel.app',
    title: 'SyncIn | Student Platform',
    description: 'Track your academic and technical growth with SyncIn',
    siteName: 'SyncIn',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SyncIn | Student Platform',
    description: 'Track your academic and technical growth with SyncIn',
    creator: '@yourhandle',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${nunitoSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
