import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getIdeas } from '@/helpers/getIdeas'
import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import User from '@/models/User'
import { currentUser } from '@clerk/nextjs/server'
import { Eye, FileText, Heart, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

const stats = {
  totalViews: '2.4M',
  totalLikes: '156K',
  totalShares: '23K',
  engagementRate: '8.2%',
  contentGenerated: 47,
  activeIdeas: 12,
}

const platformColors = {
  tiktok: 'bg-black text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  youtube: 'bg-red-600 text-white',
}

const statusColors = {
  completed: 'bg-green-500',
  processing: 'bg-yellow-500 animate-pulse',
  draft: 'bg-gray-500',
}

export default async function Page() {
  const ideas = (await getIdeas({ limit: 5 })) ?? []

  return (
    <div className="w-full mx-auto px-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagementRate}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentGenerated}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ideas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIdeas}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">3</span> generating now
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <FileText className="h-5 w-5" />
              Recent Content Ideas
            </CardTitle>
            <Link href="/ideas">
              <Button variant="outline" size="sm" className="hover:cursor-pointer">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ideas.map((idea: any) => (
                <div key={idea.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${statusColors[idea.status as keyof typeof statusColors]}`} />
                    <div className="flex flex-col gap-2">
                      <div className="font-medium">{idea.prompt}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge
                          className={`${platformColors[idea?.platform as keyof typeof platformColors]} text-xs font-semibold`}
                        >
                          {idea?.platform}
                        </Badge>
                        <span>{idea?.createdAt?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {idea.status === 'published' && (
                      <div className="text-right text-sm">
                        <div className="font-medium">{idea.views}</div>
                        <div className="text-muted-foreground">{idea.engagement}</div>
                      </div>
                    )}
                    {idea.status === 'scheduled' && (
                      <div className="text-right text-sm">
                        <div className="font-medium">Scheduled</div>
                        <div className="text-muted-foreground">{idea.scheduledFor}</div>
                      </div>
                    )}
                    {idea.status === 'generating' && (
                      <div className="text-right text-sm w-20">
                        <div className="font-medium">{idea.progress}%</div>
                        <Progress value={idea.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
