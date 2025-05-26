import { ourFileRouter } from '@/app/api/uploadthing/core'
import { AppSidebar } from '@/components/app-sidebar'
import Header from '@/components/header'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
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
    <html>
      <NuqsAdapter>
        <ClerkProvider>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex flex-col w-full">
                <Suspense>
                  <Header />
                </Suspense>
                {children}
              </main>
              <Toaster />
            </SidebarProvider>
          </body>
        </ClerkProvider>
      </NuqsAdapter>
    </html>
  )
}
