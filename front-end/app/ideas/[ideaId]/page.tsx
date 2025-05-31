import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { STATUS } from '@/constants'
import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { ScriptSection, ScriptSectionLoading } from './_components/script-section'

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
  const { ideaId } = await params
  const ideaData = await getIdea(ideaId)

  if (ideaData?.status !== STATUS.COMPLETED) {
    return <div className="w-full mx-auto px-4 py-6">Idea not completed yet</div>
  }

  return (
    <div className="w-full mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ideas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ideas
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500 text-white font-semibold text-md">{ideaData.status.toUpperCase()}</Badge>
        </div>
      </header>

      <Suspense fallback={<ScriptSectionLoading idea={ideaData} />}>
        <ScriptSection idea={ideaData} />
      </Suspense>
    </div>
  )
}
