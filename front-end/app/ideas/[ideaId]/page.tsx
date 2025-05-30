import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const ideaData = {
  _id: '683537c028cf5fe413dbc458',
  prompt:
    'I want to promote watches from China in Colombia, in tiktok with only three scenes in tone classy. This will go on instagram. Make it sound motivational',
  platform: 'instagram',
  tone: 'motivational',
  status: 'completed',
  generated_script:
    '[Scene_1]: Tired of the same old story? [Close-up of a sleek watch] Time is your most valuable asset. Invest it wisely.\n\n[Scene_2]: Crafted with precision. Designed for success. [Quick cuts showcasing different watch styles and features] Elevate your status. Redefine your limits.\n\n[Scene_3]: From China to Colombia, seize the moment. [Shot of a watch on a wrist, confidently checking the time against a scenic Colombian backdrop]. Your time is now. #luxury #watches #colombia',
  generated_caption:
    'Your time is now. Elevate your style with a touch of global craftsmanship.\n\n#LuxuryWatches #MadeInChina #ColombianStyle',
  generated_music: [
    {
      clip_id: '7498488534715336720',
      title: 'Almost forgot that this was the whole point - Take my Hand Instrumental',
      author: 'AntonioVivald',
      link: 'https://www.tiktok.com/music/x-7498488534715336720',
      country_code: 'US',
      cover: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2774/ogeg5emA1RGQlgMIfCLAfIABGoAuIAFyBjAAJK.jpeg',
      duration: 60,
      reason:
        'This instrumental piece provides a sophisticated and motivational backdrop, perfect for showcasing the elegance and craftsmanship of the watches. Its gentle build-up can mirror the precision involved in watchmaking.',
    },
    {
      clip_id: '6929598289828907010',
      title: 'Lose You',
      author: 'Drake',
      link: 'https://www.tiktok.com/music/x-6929598289828907010',
      country_code: 'US',
      cover: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2774/oAr6qAmUSElAiVEWKAW0jZYicARABAtv20AEo.jpeg',
      duration: 60,
      reason:
        "Drake's 'Lose You' offers a blend of introspection and ambition. The mellow yet driving beat can highlight the watches as symbols of success and personal style, aligning with a motivational theme.",
    },
    {
      clip_id: '6696407724445403138',
      title: "Why Don't We Fall in Love (feat. Ludacris) (Main Mix)",
      author: 'Amerie',
      link: 'https://www.tiktok.com/music/x-6696407724445403138',
      country_code: 'US',
      cover: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2774/3e4f4e672b3440d0b196d5e07875b42d.jpeg',
      duration: 60,
      reason:
        "This track has a smooth, confident vibe that complements the watches' elegance. The lyrics hint at timeless appeal and making bold choices, fitting for a classy promotional video.",
    },
    {
      clip_id: '7504636490551953425',
      title: 'Dark Til Daylight',
      author: 'Morgan Wallen',
      link: 'https://www.tiktok.com/music/x-7504636490551953425',
      country_code: 'US',
      cover: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2774/oIAA1t0OAls3iKyWi0BAJEEBmwPoEApAWVfEp4.jpeg',
      duration: 60,
      reason:
        "This sound blends modern and classic elements, mirroring the watches' design. Its rising trend suggests relevance, and the motivational undertones resonate with the theme of achieving goals.",
    },
    {
      clip_id: '7504636490551920657',
      title: '20 Cigarettes',
      author: 'Morgan Wallen',
      link: 'https://www.tiktok.com/music/x-7504636490551920657',
      country_code: 'US',
      cover: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2774/oIAA1t0OAls3iKyWi0BAJEEBmwPoEApAWVfEp4.jpeg',
      duration: 60,
      reason:
        'The laid-back yet confident vibe of this track matches the sophisticated tone desired. Its rising popularity will attract attention, while the mature sound suits a luxury watch promotion.',
    },
    {
      clip_id: '7501188134202918929',
      title: 'Back Of My Mind (feat. Nino Paid)',
      author: 'Rockout Danny',
      link: 'https://www.tiktok.com/music/x-7501188134202918929',
      country_code: 'US',
      cover: 'https://p16-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2774/o0SQHRf5GMTZZAGmaEXBAxQQmKDeAef81AFgAk.jpeg',
      duration: 60,
      reason:
        "With a blend of modern R&B and subtle beats, 'Back Of My Mind' can add an element of understated luxury to the TikTok. The motivational lyrics and overall vibe work well with the theme of success and personal achievement.",
    },
  ],
  createdAt: '2025-05-27T03:55:44.870Z',
  updatedAt: '2025-05-27T03:56:07.968Z',
}

export default async function IdeaDetailsPage({ params }: IdeaDetailsPageProps) {
  const { ideaId } = await params
  const ideaData = await getIdea(ideaId)

  if (ideaData?.status !== 'completed') {
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
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {ideaData.platform.toUpperCase()}
          </Badge>
          <Badge className="bg-green-500 text-white font-semibold">{ideaData.status.toUpperCase()}</Badge>
        </div>
      </header>

      <Suspense fallback={<ScriptSectionLoading idea={ideaData} />}>
        <ScriptSection idea={ideaData} />
      </Suspense>

      {/* Action Buttons */}
      {/* <div className="flex flex-wrap gap-4 justify-center">
        <Button size="lg" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Post to Instagram
        </Button>
        <Button variant="outline" size="lg" onClick={handleRegenerate} disabled={isRegenerating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate Content'}
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <Copy className="h-4 w-4" />
          Copy All Content
        </Button>
      </div> */}
    </div>
  )
}
