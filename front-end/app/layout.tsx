import { ourFileRouter } from '@/app/api/uploadthing/core'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { ClerkProvider } from '@clerk/nextjs'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { extractRouterConfig } from 'uploadthing/server'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Creator Companion (ADK Hackathon 2025)',
  description: 'Your AI companion for creating content',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NuqsAdapter>
            <Suspense>
              <Header />
            </Suspense>
            <main className="container mx-auto px-4 max-w-5xl">{children}</main>
            <Toaster />
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  )
}
