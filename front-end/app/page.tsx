import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Clipboard, Plus, Brain } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">CreatorCompanion</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="font-medium">
            My Ideas
          </Button>
          <Button className="gap-2">
            <Plus size={16} />
            New Idea
            <span className="ml-1 h-2 w-2 rounded-full bg-green-500"></span>
          </Button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-6">Hello, Creator 👋 What would you like to work on today?</h2>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="gap-2">
            <Mic size={18} />
            Record Idea
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Clipboard size={18} />
            Paste Idea
          </Button>
        </div>
      </section>

      {/* Content Ideas Section */}
      <section>
        <h2 className="text-xl font-medium mb-4 pb-2 border-b">📁 Your Content Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Content Idea Card 1 */}
          <Card>
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

          {/* Content Idea Card 2 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="text-purple-500" />
                  Burnout Recovery
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-muted-foreground">"Why hustle culture is..."</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>🕒 Yesterday</span>
                <span>|</span>
                <Badge variant="outline">YouTube</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="bg-green-500 hover:bg-green-600">
                  ✅ Ready
                </Badge>
                <Badge variant="outline">📈 +5 Likes</Badge>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
