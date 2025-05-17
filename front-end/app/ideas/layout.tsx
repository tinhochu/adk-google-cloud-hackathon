import connectMongo from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function IdeasLayout({ children }: { children: React.ReactNode }) {
  await connectMongo()

  const user = await currentUser()

  if (!user) redirect('/')

  return <>{children}</>
}
