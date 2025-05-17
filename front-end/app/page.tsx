import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'
import { currentUser } from '@clerk/nextjs/server'
import { Brain, Clipboard, Mic } from 'lucide-react'
import Link from 'next/link'

const getData = async () => {
  // Get the current user
  const user = await currentUser()

  // If the user is not found, return an empty array
  if (!user) return []

  // Connect to the database
  await connectMongo()

  // Get the user from the database
  const mongoUser = await User.findOne({ clerkId: user.id })

  // If the user is not found, return an empty array
  if (!mongoUser) return []

  // Convert the user to a JSON object
  const userJSON = mongoUser.toJSON()

  // Get the user's ideas
  const ideas = await Idea.find({ userId: userJSON.id }).lean()

  return ideas
}

export default async function Page() {
  const ideas = (await getData()) ?? []

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome Section */}
      <section className="mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium mb-6">Hello, Creator 👋 What would you like to work on today?</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/ideas/new?inputMethod=voice">
            <Button size="lg" variant="outline" className="gap-2 hover:cursor-pointer">
              🎙️ Record Idea
            </Button>
          </Link>
          <Link href="/ideas/new?inputMethod=text">
            <Button size="lg" variant="outline" className="gap-2 hover:cursor-pointer">
              👨‍💻 Write Idea
            </Button>
          </Link>
        </div>
      </section>

      {/* Content Ideas Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-medium mb-4 pb-2 border-b">📁 Your Content Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.length > 0 &&
            ideas.map((idea: any) => (
              <Card key={idea._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="text-purple-500" />
                      Dopamine Detox Debunked
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground">"POV: You're 19..."</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>🕒 2 min ago</span>
                    <span>|</span>
                    <Badge variant="outline">TikTok</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="bg-green-500 hover:bg-green-600">
                      ✅ Ready
                    </Badge>
                    <Badge variant="outline">🎬 Script/Caption</Badge>
                  </div>
                </CardFooter>
              </Card>
            ))}

          {ideas.length === 0 && (
            <div className="col-span-2 p-14 bg-muted rounded-lg grid gap-4">
              <p className="text-center text-2xl text-muted-foreground font-semibold">
                🤔 No ideas found. Create one to get started 💥.
              </p>
              <p className="text-center text-muted-foreground">
                You can create an 💡idea by clicking the button <span className="text-2xl">👇</span> below or 📋 pasting
                your idea into the text field.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/ideas/new?inputMethod=voice">
                  <Button size="lg" variant="outline" className="gap-2 hover:cursor-pointer">
                    🎙️ Record Idea
                  </Button>
                </Link>
                <Link href="/ideas/new?inputMethod=text">
                  <Button size="lg" variant="outline" className="gap-2 hover:cursor-pointer">
                    👨‍💻 Write Idea
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
