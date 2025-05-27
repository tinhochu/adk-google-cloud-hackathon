import GPTTypingEffect from '@/components/gpt-typing-effect'

export default async function ScriptSection({ scenes }: { scenes: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-6">
        {scenes.map((scene, index) => (
          <div key={index} className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {scene?.number}
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-r from-muted to-muted/50 p-4 rounded-lg">
                  <GPTTypingEffect text={scene?.content} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
