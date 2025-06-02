import GPTTypingEffect from '@/components/gpt-typing-effect'
import { MusicPlayer } from '@/components/music-player'
import PhoneSimulator from '@/components/phone-simulator'
import PromptUpdater from '@/components/prompt-updater'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GoogleGenAI } from '@google/genai'
import { Loader2 } from 'lucide-react'

import { Caption } from './caption'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY })

const parseScript = (script: string) => {
  if (!script) return []

  const scenes = script
    .split('\n')
    .map((scene, index) => {
      const sceneMatch = scene.match(/\[Scene_(\d+)\]: (.+)/)
      if (sceneMatch) {
        return {
          number: sceneMatch[1],
          content: sceneMatch[2],
        }
      }
      return null
    })
    .filter(Boolean)
  return scenes
}

function ScriptSectionLoading({ idea }: { idea: any }) {
  const { prompt, generated_caption } = idea
  const parsedScenes = parseScript(idea?.generated_script || '')

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">💭 Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md italic">
              <GPTTypingEffect text={`"${prompt}"`} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-full h-10" />
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-4 gap-4">
            {/* Left Section - Album Art and Controls */}
            <div className="col-span-1 flex flex-col">
              <Skeleton className="w-full aspect-square rounded-lg mb-4" />
              <div className="flex items-center justify-center gap-6">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
            </div>

            {/* Right Section - Track Listing */}
            <div className="col-span-3">
              {/* Album Info */}
              <div className="mb-5">
                <Skeleton className="w-full h-10" />
              </div>

              {/* Track List */}
              <div className="space-y-1 relative">
                <div className="relative">
                  <Skeleton className="w-full h-[300px]" />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">🎬 Script</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {parsedScenes.map((scene, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {scene?.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
                      <GPTTypingEffect text={scene?.content!} className="select-all" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Caption caption={generated_caption} />
      </div>
      <div className="col-span-1">
        <PhoneSimulator />
      </div>
    </div>
  )
}

async function ScriptSection({ idea }: { idea: any }) {
  // Get the idea data
  const { generated_script, generated_caption, generated_music, prompt } = idea

  // Parse the script into scenes
  const parsedScenes = parseScript(generated_script)

  // Generate images for each scene
  const sceneImages = await Promise.all(
    parsedScenes.map(async (scene) => {
      const prompt = `show me a picture or mockup with this scene: ${scene?.content}. make an rough example image`
      const response = await ai.models.generateImages({
        model: 'models/imagen-3.0-generate-002',
        config: {
          numberOfImages: 1,
          aspectRatio: '9:16',
        },
        prompt,
      })

      // Adjust this depending on the actual response structure
      const image = response.generatedImages?.[0]?.image?.imageBytes

      // return base64 string
      return image || null
    })
  )

  // Guess the Country of the Idea
  const countryResponse = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: `Guess the country of the idea based on the prompt: ${prompt}. if you can't guess the country, the fallback is US. return the country in the following format:
    {
      "country_code": "Country Code"
    }
    `,
  })

  const country = JSON.parse(countryResponse.text?.replace(/```json\n|```/g, '') ?? '{}')

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">💭 Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <PromptUpdater ideaId={idea.id} initialPrompt={prompt} />
          </CardContent>
        </Card>

        <MusicPlayer music={generated_music} guessCountry={country?.country_code ?? 'US'} />

        <Card className="mb-6 mt-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">🎬 Script</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {parsedScenes.map((scene, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {scene?.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
                      <p className="select-all">{scene?.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Caption caption={generated_caption} gptEffect={false} />
      </div>
      <div className="col-span-1">
        <div className="sticky top-4">
          <PhoneSimulator images={sceneImages.filter((img): img is string => typeof img === 'string')} />
        </div>
      </div>
    </div>
  )
}

export { ScriptSection, ScriptSectionLoading }
