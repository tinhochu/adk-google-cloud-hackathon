import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function MusicSection({ music }: { music: any[] }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🎵 Curated Music Selection</CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-selected tracks that match your motivational tone and luxury aesthetic
        </p>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md"></div>
      </CardContent>
    </Card>
  )
}

export { MusicSection }
