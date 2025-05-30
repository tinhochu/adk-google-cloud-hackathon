import DeleteIdeaButton from '@/components/delete-idea-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { getIdeas } from '@/helpers/getIdeas'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function IdeasPage() {
  const user = await currentUser()
  const ideas = await getIdeas({ limit: -1 })

  return (
    <div className="w-full mx-auto px-4">
      <h1 className="text-2xl font-bold">Ideas ({ideas.length})</h1>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4">
        {ideas.length > 0 ? (
          ideas?.map((idea: any, index: number) => (
            <Card key={idea.id}>
              <CardHeader>
                <CardTitle className="relative pr-48">
                  <Link href={`/ideas/${idea.id}`} className="hover:cursor-pointer leading-relaxed hover:underline">
                    {idea.prompt}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-0 right-2" asChild>
                      <Button className="hover:cursor-pointer">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        <DeleteIdeaButton ideaId={idea.id} userId={user?.id!} />
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-xl font-bold">No ideas found</p>
              <p className="text-sm text-muted-foreground">Create an idea to get started.</p>
              <Link href="/ideas/new" className="mt-4">
                <Button className="hover:cursor-pointer">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
