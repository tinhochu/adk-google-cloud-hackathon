import { Separator } from '@/components/ui/separator'
import { getIdeas } from '@/helpers/getIdeas'

export default async function IdeasPage() {
  const ideas = await getIdeas({ limit: -1 })

  return (
    <div className="w-full mx-auto px-4">
      <h1 className="text-2xl font-bold">Ideas ({ideas.length})</h1>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-6">
        {ideas.map((idea: any, index: number) => (
          <div key={idea.id}>{idea.prompt}</div>
        ))}
      </div>
    </div>
  )
}
