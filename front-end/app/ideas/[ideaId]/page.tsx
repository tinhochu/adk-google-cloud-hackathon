import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import { ArrowLeft, Copy, ExternalLink, Pause, Play, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface IdeaDetailsPageProps {
  params: Promise<{
    ideaId: string
  }>
}

const getIdea = async (ideaId: string) => {
  try {
    await connectMongo()
    const ideaObj = await Idea.findById(ideaId)

    return ideaObj?.toJSON()
  } catch (error) {
    console.error(error)
    return null
  }
}

export default async function IdeaDetailsPage({ params }: IdeaDetailsPageProps) {
  // Get the ideaId from the URL
  const { ideaId } = await params
  const ideaData = await getIdea(ideaId)

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="w-32"></div> {/* Spacer for centering */}
      </header>
      <h1 className="text-xl font-medium">Idea: {ideaData.prompt}</h1>
    </div>
  )
}
