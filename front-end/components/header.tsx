'use client'

import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Brain, Plus, User } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const { user, isLoaded } = useUser()

  return (
    <header className="mx-auto px-4 py-6 flex items-center w-full justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hover:cursor-pointer" />
        <Link href="/">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            CreatorCompanion
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {!isLoaded ? (
          <Skeleton className="w-32 h-[36px]" />
        ) : user ? (
          <>
            <Link href="/ideas/new">
              <Button className="gap-2 hover:cursor-pointer">
                <Plus size={16} />
                New Idea
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                </span>
              </Button>
            </Link>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button className="gap-2 hover:cursor-pointer">
              <User size={16} />
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}
