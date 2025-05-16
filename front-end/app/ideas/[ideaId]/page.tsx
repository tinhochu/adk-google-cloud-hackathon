"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, RefreshCw, ExternalLink, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface IdeaDetailsPageProps {
  params: Promise<{
    ideaId: string;
  }>;
}

export default async function IdeaDetailsPage({ params }: IdeaDetailsPageProps) {
  // Get the ideaId from the URL
  const { ideaId } = await params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ideaData = {
    id: "dopamine-detox",
    title: "Dopamine Detox Debunked",
    script: "POV: You're 19, giving up chocolate because Huberman said...",
    caption: "Your brain is NOT the villain 🧠💥 #dopamine #huberman #healthhumor",
    audio: {
      title: "Am I the Drama?",
      url: "https://example.com/audio.mp3", // This would be a real audio URL in production
    },
  };

  const handleCopyAll = () => {
    const contentToCopy = `
SCRIPT:
${ideaData.script}

CAPTION:
${ideaData.caption}

AUDIO:
${ideaData.audio.title}
    `.trim();

    navigator.clipboard.writeText(contentToCopy);
    toast.success("Copied to clipboard");
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);

    // Simulate regeneration process
    setTimeout(() => {
      setIsRegenerating(false);
      toast.success("Content regenerated");
    }, 2000);
  };

  const handlePostBuffer = () => {
    toast.success("Opening Buffer");
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-xl font-medium">Idea: {ideaData.title}</h1>
        <div className="w-32"></div> {/* Spacer for centering */}
      </header>

      {/* Script Section */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">📝 AI-Generated Script</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">"{ideaData.script}"</div>
        </CardContent>
      </Card>

      {/* Caption Section */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">📣 Caption + Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">{ideaData.caption}</div>
        </CardContent>
      </Card>

      {/* Audio Section */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">🎵 Trending Audio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 bg-muted p-4 rounded-md">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={toggleAudio}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div>
              <div className="font-medium">{ideaData.audio.title}</div>
              <div className="text-sm text-muted-foreground">Trending on TikTok</div>
            </div>
            {/* Hidden audio element */}
            <audio ref={audioRef} src={ideaData.audio.url} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleCopyAll}>
          <Copy className="mr-2 h-4 w-4" />
          Copy All
        </Button>
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleRegenerate} disabled={isRegenerating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </Button>
        <Button className="flex-1 sm:flex-none" onClick={handlePostBuffer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Post via Buffer
        </Button>
      </div>
    </div>
  );
}
